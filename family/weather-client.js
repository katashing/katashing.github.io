(function (root, factory) {
  var client = factory(root);
  if (typeof module === 'object' && module.exports) { module.exports = client; }
  else { root.WeatherClient = client; }
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function (root) {
  'use strict';
  var ENDPOINT = 'https://api.open-meteo.com/v1/forecast?latitude=22.5431&longitude=114.0579&current=temperature_2m%2Cweather_code&daily=temperature_2m_max%2Ctemperature_2m_min&timezone=Asia%2FShanghai&forecast_days=1';
  var SUCCESS_DELAY = 600000, ERROR_DELAY = 120000, REQUEST_TIMEOUT = 12000;
  // Kept identical to server/refresh_weather.py; unknown numeric codes are safe.
  var CONDITIONS = {
    '0': ['晴', 'Clear'], '1': ['晴间少云', 'Mostly clear'], '2': ['多云', 'Partly cloudy'], '3': ['阴', 'Overcast'],
    '45': ['雾', 'Fog'], '48': ['雾凇', 'Freezing fog'],
    '51': ['小毛毛雨', 'Light drizzle'], '53': ['中等毛毛雨', 'Moderate drizzle'], '55': ['浓毛毛雨', 'Heavy drizzle'],
    '56': ['轻微冻毛毛雨', 'Light freezing drizzle'], '57': ['浓冻毛毛雨', 'Heavy freezing drizzle'],
    '61': ['小雨', 'Light rain'], '63': ['中雨', 'Moderate rain'], '65': ['大雨', 'Heavy rain'],
    '66': ['小冻雨', 'Light freezing rain'], '67': ['大冻雨', 'Heavy freezing rain'],
    '71': ['小雪', 'Light snow'], '73': ['中雪', 'Moderate snow'], '75': ['大雪', 'Heavy snow'], '77': ['米雪', 'Snow grains'],
    '80': ['小阵雨', 'Light showers'], '81': ['中等阵雨', 'Moderate showers'], '82': ['强阵雨', 'Heavy showers'],
    '85': ['小阵雪', 'Light snow showers'], '86': ['大阵雪', 'Heavy snow showers'],
    '95': ['雷雨', 'Thunderstorm'], '96': ['雷雨伴小冰雹', 'Thunderstorm with light hail'],
    '97': ['强雷雨', 'Heavy thunderstorm'], '99': ['雷雨伴大冰雹', 'Thunderstorm with heavy hail']
  };
  function array(value) { return Object.prototype.toString.call(value) === '[object Array]'; }
  function numeric(value) { return typeof value === 'number' && isFinite(value); }
  function pad(value) { return ('0' + value).slice(-2); }
  function snapshot(payload, now) {
    if (!payload || typeof payload !== 'object' || payload.error || payload.utc_offset_seconds !== 28800) { return null; }
    var current = payload.current, daily = payload.daily;
    if (!current || !daily || !array(daily.time) || !array(daily.temperature_2m_min) || !array(daily.temperature_2m_max)) { return null; }
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::00)?$/.exec(current.time || '');
    if (!match || +match[1] < 100 || +match[4] > 23 || +match[5] > 59) { return null; }
    var date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
    if (date.getUTCFullYear() !== +match[1] || date.getUTCMonth() !== +match[2] - 1 || date.getUTCDate() !== +match[3]) { return null; }
    var day = match[1] + '-' + match[2] + '-' + match[3], local = new Date(now + 28800000);
    var today = local.getUTCFullYear() + '-' + pad(local.getUTCMonth() + 1) + '-' + pad(local.getUTCDate());
    if (day !== today || daily.time[0] !== day) { return null; }
    var temperature = current.temperature_2m, code = current.weather_code, low = daily.temperature_2m_min[0], high = daily.temperature_2m_max[0];
    if (!numeric(temperature) || !numeric(code) || code % 1 !== 0 || !numeric(low) || !numeric(high) || low > high) { return null; }
    var condition = CONDITIONS[code] || ['天气未知', 'Unknown'];
    return {
      location: '深圳', locationEn: 'Shenzhen', temperatureC: temperature, lowC: low, highC: high,
      condition: condition[0], conditionEn: condition[1],
      observedAt: day + 'T' + match[4] + ':' + match[5] + ':00+08:00',
      source: 'Open-Meteo', sourceUrl: 'https://open-meteo.com/'
    };
  }
  function start(options) {
    options = options || {};
    // Optional dependency injection is for isolated tests; callers normally
    // provide only onWeather and onError.
    var XHR = options.XMLHttpRequest || root.XMLHttpRequest;
    var setTimer = options.setTimeout || function (fn, delay) { return root.setTimeout(fn, delay); };
    var clearTimer = options.clearTimeout || function (id) { return root.clearTimeout(id); };
    var now = options.now || function () { return new Date().getTime(); };
    var pending = null, timer = null, stopped = false;
    function cancelTimer() {
      if (timer !== null) { clearTimer(timer); timer = null; }
    }
    function notify(callback, value) {
      if (typeof callback === 'function') {
        try { callback(value); } catch (error) { /* A consumer error must not break cleanup or retry. */ }
      }
    }
    function detach(request) {
      request.onreadystatechange = null; request.onerror = null; request.onabort = null; request.ontimeout = null;
    }
    function abort(request) { try { request.abort(); } catch (error) { /* Already closed. */ } }
    function later(delay) {
      if (stopped) { return; }
      cancelTimer();
      timer = setTimer(function () { timer = null; requestWeather(); }, delay);
    }
    function finish(request, value, error) {
      if (stopped || pending !== request) { return; }
      pending = null; cancelTimer(); detach(request);
      if (value) { notify(options.onWeather, value); }
      else { notify(options.onError, error); }
      later(value ? SUCCESS_DELAY : ERROR_DELAY);
    }
    function requestWeather() {
      if (stopped || pending !== null) { return; }
      var request;
      try {
        if (typeof XHR !== 'function') { throw new Error('XHR unavailable'); }
        request = new XHR(); pending = request;
        request.onreadystatechange = function () {
          if (stopped || pending !== request || request.readyState !== 4) { return; }
          try {
            if (request.status !== 200) { finish(request, null, 'http'); return; }
            var value = snapshot(JSON.parse(request.responseText), now());
            finish(request, value, value ? null : 'invalid-weather');
          } catch (error) { finish(request, null, 'invalid-response'); }
        };
        request.onerror = function () { finish(request, null, 'network'); };
        request.onabort = function () { finish(request, null, 'aborted'); };
        request.ontimeout = function () { finish(request, null, 'timeout'); };
        request.open('GET', ENDPOINT, true);
        if (stopped || pending !== request) { return; }
        timer = setTimer(function () {
          if (stopped || pending !== request) { return; }
          finish(request, null, 'timeout'); abort(request);
        }, REQUEST_TIMEOUT);
        request.send(null);
      } catch (error) {
        if (request && pending === request) { finish(request, null, 'network'); abort(request); }
        else if (!stopped && !request) { notify(options.onError, 'unavailable'); later(ERROR_DELAY); }
      }
    }
    var handle = { stop: function () {
      if (stopped) { return; }
      stopped = true; cancelTimer();
      var request = pending; pending = null;
      if (request) { detach(request); abort(request); }
    } };
    requestWeather();
    return handle;
  }
  return { start: start };
}));
