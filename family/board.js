(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  function text(target, value) {
    var property = 'textContent' in target ? 'textContent' : 'innerText';
    if (target[property] !== value) { target[property] = value; }
  }
  function attribute(target, name, value) {
    value = String(value);
    if (target.getAttribute(name) !== value) { target.setAttribute(name, value); }
  }
  function className(target, value) { if (target.className !== value) { target.className = value; } }
  function style(target, name, value) { if (target.style[name] !== value) { target.style[name] = value; } }
  function initial(id) {
    var target = el(id);
    try { return JSON.parse(target.textContent || target.innerText || target.text); }
    catch (error) { return {}; }
  }
  function array(value) { return Object.prototype.toString.call(value) === '[object Array]'; }
  function node(tag, className, value) {
    var target = document.createElement(tag);
    if (className) { target.className = className; }
    if (typeof value !== 'undefined') { text(target, value); }
    return target;
  }
  function visible(target, show) { style(target, 'display', show ? '' : 'none'); className(target, target.className.replace(/\s*hidden/g, '')); }
  function clear(target) { while (target.firstChild) { target.removeChild(target.firstChild); } }
  function pad(value) { return ('0' + value).slice(-2); }
  function shanghaiNow() { return new Date(new Date().getTime() + 8 * 3600000); }
  function today() {
    var now = shanghaiNow();
    return now.getUTCFullYear() + '-' + pad(now.getUTCMonth() + 1) + '-' + pad(now.getUTCDate());
  }
  function defaultChildDate() { return shiftDate(today(), shanghaiNow().getUTCHours() < 12 ? 0 : 1); }
  function contentPeriod() {
    var hour = shanghaiNow().getUTCHours();
    return today() + '/' + (hour < 6 ? 0 : hour < 10 ? 6 : hour < 12 ? 10 : hour < 18 ? 12 : 18);
  }
  function shiftDate(key, offset) {
    var bits = key.split('-'), date = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2] + offset));
    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate());
  }
  function dateLabel(key, en, compact) {
    var bits = key.split('-'), date = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2]));
    if (en) { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()] + ' ' + (+bits[2]) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+bits[1] - 1]; }
    return (+bits[1]) + '月' + (+bits[2]) + '日 ' + (compact ? '周' : '星期') + '日一二三四五六'.charAt(date.getUTCDay());
  }
  function localized(item, en) { return en ? (item.textEn || item.text || '') : (item.text || ''); }
  function validDrinks(drinks) {
    if (typeof drinks === 'undefined') { return true; }
    if (!array(drinks)) { return false; }
    for (var i = 0; i < drinks.length; i++) {
      var drink = drinks[i];
      if (!drink || typeof drink.text !== 'string' || !array(drink.weekdays) || !drink.weekdays.length) { return false; }
      for (var w = 0; w < drink.weekdays.length; w++) {
        var day = drink.weekdays[w];
        if (typeof day !== 'number' || day < 0 || day > 6 || day % 1 !== 0) { return false; }
      }
    }
    return true;
  }
  function breakfastDrink(date, en) {
    var bits = date.split('-'), day = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2])).getUTCDay();
    var drinks = menus.drinks || [];
    for (var i = 0; i < drinks.length; i++) {
      for (var w = 0; w < drinks[i].weekdays.length; w++) {
        if (drinks[i].weekdays[w] === day) { return localized(drinks[i], en); }
      }
    }
    return '';
  }
  function itemTime(item, en) {
    if (item.period) { return en ? { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }[item.period] : { morning: '上午', afternoon: '下午', evening: '晚上' }[item.period]; }
    return item.start + ' – ' + item.end;
  }
  function itemOrder(item) { return item.start || { morning: '00:00', afternoon: '12:00', evening: '18:00' }[item.period] || ''; }
  var data = initial('initial-data'), course = initial('initial-schedule'), weather = initial('initial-weather'), menus = initial('initial-breakfasts'), calendar = initial('initial-calendar'), almanac = initial('initial-almanac'), festivals = initial('initial-festivals');
  var CLIENT_VERSION = '20261125-kindle1';
  var kindleSite = location.hostname === '43.128.89.2';
  var REQUEST_TIMEOUT = 12000;
  var RETRY_DELAYS = [120000, 300000, 900000, 1800000];
  function retryDelay(failures) { return RETRY_DELAYS[Math.min(failures - 1, RETRY_DELAYS.length - 1)]; }
  var views = [], current = 0, playing = false, timer = null, lastControl = null;
  var errors = {}, payloads = {}, currentDay = today(), selectedDay = defaultChildDate();
  var defaultDay = selectedDay, lastContentPeriod = contentPeriod(), clockTimer = null, pollers = [], reloading = false;
  var initialPage = (location.hash || '').replace(/^#/, '');
  var topLineKey = null, bodyKey = null, photoCropKey = null, photoFailed = false;
  var weatherClient = null, weatherPollTimer = null, weatherPending = false, weatherNextDue = 0;
  var weatherStartedAt = 0, cancelWeatherRequest = null, weatherFailures = 0, savedForecast = null;
  var plannerScript = { path: 'breakfast-planner.js?v=20261026-porridge1', loading: false, failed: false, startedAt: 0 };
  var weatherScript = { path: 'weather-client.js?v=20261123-static1', loading: false, failed: false, startedAt: 0 };
  function githubPage() { return /(^|\.)github\.io$/.test(location.hostname || ''); }
  function scriptAvailable(state) {
    return state === plannerScript ? typeof BreakfastPlanner !== 'undefined' : typeof WeatherClient !== 'undefined';
  }
  function scriptNeeded(state) {
    return state === plannerScript ? views.length && !isChild(views[current].page) && !isTasks(views[current].page) : githubPage();
  }
  function startWeatherClient() {
    if (weatherClient || !githubPage() || typeof WeatherClient === 'undefined') { return; }
    weatherClient = WeatherClient.start({ initialWeather: weather, onWeather: function (next) {
      acceptWeather(next); topLine();
      if (dailyWeatherValid(weather) && !weatherPending) { scheduleWeatherPoll(nextWeatherRefresh()); }
    } });
  }
  function loadOptionalScript(state, force) {
    if (!scriptNeeded(state)) { return; }
    if (scriptAvailable(state)) { if (state === weatherScript) { startWeatherClient(); } return; }
    var now = new Date().getTime();
    if (state.loading) {
      if (now - state.startedAt < REQUEST_TIMEOUT) { return; }
      state.cancel();
    }
    if (!force && now < (state.retryAt || 0)) { return; }
    if (state.retryTimer) { clearTimeout(state.retryTimer); state.retryTimer = null; }
    var script = node('script'), finished = false, timeout;
    state.loading = true; state.startedAt = now; state.failed = false;
    function detach() {
      script.onload = null; script.onerror = null;
      if (script.parentNode) { script.parentNode.removeChild(script); }
    }
    state.cancel = function () {
      if (finished) { return; }
      finished = true; clearTimeout(timeout); state.loading = false; state.cancel = null; detach();
    };
    function finish(ok) {
      if (finished) { return; }
      state.cancel(); state.failed = !ok;
      if (ok) {
        state.retryAt = 0; state.failures = 0;
        if (state === weatherScript) { startWeatherClient(); }
      } else if (kindleSite) {
        state.retryAt = Infinity;
      } else {
        state.failures = (state.failures || 0) + 1;
        var delay = retryDelay(state.failures);
        state.retryAt = new Date().getTime() + delay;
        state.retryTimer = setTimeout(function () { state.retryTimer = null; loadOptionalScript(state, false); }, delay);
      }
      if (state === plannerScript && scriptNeeded(state)) { render(); }
    }
    script.onload = function () { finish(scriptAvailable(state)); };
    script.onerror = function () { finish(false); };
    script.async = true; script.src = state.path;
    timeout = setTimeout(function () { finish(false); }, REQUEST_TIMEOUT);
    try { document.body.appendChild(script); } catch (error) { finish(false); }
  }
  function pageById(id) {
    for (var i = 0; i < data.pages.length; i++) { if (data.pages[i].id === id) { return data.pages[i]; } }
    return null;
  }
  function isChild(page) { return page.id === 'child' || page.sourceId === 'child'; }
  function isTasks(page) { return page.id === 'tasks' || page.id === 'tasks_en'; }
  function english() { return views.length && views[current].page.lang === 'en'; }
  function datedItems(items, date) {
    var result = [], bits = date.split('-'), weekday = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2])).getUTCDay();
    for (var i = 0; i < (items || []).length; i++) {
      var item = items[i];
      if ((item.date && item.date !== date) || (item.startDate && date < item.startDate) || (item.endDate && date > item.endDate)) { continue; }
      if (array(item.weekdays)) {
        var matches = false;
        for (var w = 0; w < item.weekdays.length; w++) { if (item.weekdays[w] === weekday) { matches = true; break; } }
        if (!matches) { continue; }
        var occurrence = {};
        for (var key in item) { if (Object.prototype.hasOwnProperty.call(item, key)) { occurrence[key] = item[key]; } }
        occurrence.done = item.done === true && item.doneDate === date;
        result.push(occurrence);
      } else { result.push(item); }
    }
    return result;
  }
  function dayPlan() {
    var source = null, items = [], i;
    if (course.days && selectedDay >= course.validFrom && selectedDay <= course.validThrough) {
      for (i = 0; i < course.days.length; i++) { if (course.days[i].date === selectedDay) { source = course.days[i]; break; } }
    }
    if (source) { items = source.items.slice(0); }
    var bits = selectedDay.split('-'), weekday = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2])).getUTCDay();
    for (i = 0; i < (course.weeklyItems || []).length; i++) {
      var rule = course.weeklyItems[i];
      if ((rule.startDate && selectedDay < rule.startDate) || (rule.endDate && selectedDay > rule.endDate)) { continue; }
      for (var j = 0; j < rule.weekdays.length; j++) { if (rule.weekdays[j] === weekday) { items.push(rule); break; } }
    }
    if (!source && !items.length) { return null; }
    items.sort(function (a, b) { return itemOrder(a) < itemOrder(b) ? -1 : itemOrder(a) > itemOrder(b) ? 1 : 0; });
    return { items: items, noteZh: source ? source.noteZh : '辅导课表待提供', noteEn: source ? source.noteEn : 'Tutoring timetable not provided', hasDatedPlan: !!source };
  }
  function homeTasks(date) {
    var source = pageById('family'), all = datedItems(source.items || [], date), tasks = [], zh = [], en = [], cleaning = false, done = true;
    for (var i = 0; i < all.length; i++) {
      var item = all[i];
      if (item.group === 'cleaning') {
        cleaning = true; done = done && !!item.done;
        if (item.id !== 'daily-floors-bathrooms') {
          zh.push(item.text.replace(/^清洁/, ''));
          en.push((item.textEn || item.text).replace(/^Clean /, ''));
        }
      } else if (item.group === 'linen' || item.id === 'daily-water-plants') { tasks.push(item); }
    }
    if (cleaning) { tasks.unshift({ text: '清洁' + (zh.length ? '：' + zh.join('、') : ''), textEn: 'Clean' + (en.length ? ': ' + en.join('; ') : ''), done: done }); }
    return tasks;
  }
  function entriesFor(page) {
    if (isChild(page)) { var plan = dayPlan(); return plan ? plan.items : []; }
    if (!isTasks(page)) { return []; }
    var tasks = homeTasks(currentDay), list = [];
    for (var i = 0; i < tasks.length; i++) { list.push({ item: tasks[i], category: 'task' }); }
    return list;
  }
  function rebuild(id, chunk) {
    views = [];
    for (var i = 0; i < data.pages.length; i++) {
      var page = data.pages[i], entries = entriesFor(page), size = isChild(page) ? Math.max(1, entries.length) : 4;
      var count = Math.max(1, Math.ceil(entries.length / size));
      for (var part = 0; part < count; part++) {
        views.push({ page: page, chunk: part, count: count, entries: entries.slice(part * size, (part + 1) * size) });
      }
    }
    current = 0;
    for (var j = 0; j < views.length; j++) {
      if (views[j].page.id === id) {
        current = j;
        if (views[j].chunk === Math.min(chunk || 0, views[j].count - 1)) { break; }
      }
    }
  }
  function interval() {
    var seconds = Number((data.settings || {}).intervalSeconds);
    return isFinite(seconds) ? Math.max(30, Math.min(3600, seconds)) * 1000 : 120000;
  }
  function stop() { if (timer !== null) { clearTimeout(timer); timer = null; } }
  function schedule() {
    stop();
    if (playing && views.length > 1) {
      timer = setTimeout(function () { timer = null; current = (current + 1) % views.length; render(); schedule(); }, interval());
    }
  }
  function pause() { playing = false; stop(); }
  function select(id, chunk) {
    pause(); rebuild(id, chunk || 0); render();
  }
  function selected(button, active) {
    className(button, active ? 'selected' : '');
    attribute(button, 'aria-pressed', active ? 'true' : 'false');
  }
  function weatherTime(value) {
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || '');
    return match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4] - 8, +match[5]) : NaN;
  }
  function morningWeatherTime(value) {
    var match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})\+08:00$/.exec(value || '');
    if (!match || shiftDate(match[1], 0) !== match[1] || +match[2] > 23 || +match[3] > 59 || +match[4] > 59) { return NaN; }
    return weatherTime(match[1] + 'T' + match[2] + ':' + match[3]) + (+match[4] * 1000);
  }
  function weatherBatchDate() {
    return shiftDate(today(), shanghaiNow().getUTCHours() < 6 ? -1 : 0);
  }
  function weatherCycle() {
    var date = today(), hour = shanghaiNow().getUTCHours(), batchDate = hour < 6 ? shiftDate(date, -1) : date;
    var batchHour = hour >= 6 && hour < 18 ? '06' : '18';
    var start = weatherTime(batchDate + 'T' + batchHour + ':00:00+08:00');
    return { start: start, next: start + 43200000, forecastDate: batchHour === '18' ? shiftDate(batchDate, 1) : batchDate };
  }
  function dailyWeatherValid(value) {
    if (!value || (value.refreshMode !== 'daily-morning' && value.refreshMode !== 'twice-daily') || !/^\d{4}-\d{2}-\d{2}$/.test(value.forecastDate || '') || shiftDate(value.forecastDate, 0) !== value.forecastDate) { return false; }
    if (typeof value.lowC !== 'number' || !isFinite(value.lowC) || typeof value.highC !== 'number' || !isFinite(value.highC) || value.lowC > value.highC) { return false; }
    if (value.refreshMode === 'twice-daily') {
      var cycle = weatherCycle(), fetched = morningWeatherTime(value.refreshedAt), observation = morningWeatherTime(value.observedAt);
      return value.forecastDate === cycle.forecastDate && isFinite(fetched) && fetched >= cycle.start && fetched < cycle.next && fetched <= new Date().getTime() + 60000 && isFinite(observation) && observation >= fetched - 10800000 && observation <= fetched + 60000 && typeof value.temperatureC === 'number' && isFinite(value.temperatureC) && typeof value.condition === 'string' && !!value.condition && typeof value.conditionEn === 'string' && !!value.conditionEn;
    }
    if (value.forecastDate !== weatherBatchDate()) { return false; }
    var start = weatherTime(value.forecastDate + 'T06:00:00+08:00'), refreshed = morningWeatherTime(value.refreshedAt), observed = morningWeatherTime(value.observedAt);
    return isFinite(refreshed) && refreshed >= start && String(value.refreshedAt).slice(0, 10) === value.forecastDate && refreshed < start + 86400000 && refreshed <= new Date().getTime() + 60000 && isFinite(observed) && String(value.observedAt).slice(0, 10) === value.forecastDate && typeof value.condition === 'string' && typeof value.conditionEn === 'string';
  }
  function acceptWeather(next) {
    if (!next || (kindleSite && next.refreshMode !== 'twice-daily')) { return false; }
    if (next.refreshMode === 'daily-morning' || next.refreshMode === 'twice-daily') {
      if (!dailyWeatherValid(next)) { return false; }
      if (dailyWeatherValid(weather) && weather.refreshMode === 'twice-daily' && next.refreshMode !== 'twice-daily') { return true; }
      if (!dailyWeatherValid(weather) || (next.refreshMode === 'twice-daily' && weather.refreshMode !== 'twice-daily') || morningWeatherTime(next.refreshedAt) >= morningWeatherTime(weather.refreshedAt)) { weather = next; }
      return true;
    }
    if (next.refreshMode || typeof next.temperatureC !== 'number' || !isFinite(next.temperatureC) || !isFinite(weatherTime(next.observedAt))) { return false; }
    // A frequently updated legacy snapshot must not replace a valid forecast.
    if (!dailyWeatherValid(weather) && (!isFinite(weatherTime(weather.observedAt)) || weatherTime(next.observedAt) >= weatherTime(weather.observedAt))) { weather = next; }
    return true;
  }
  function nextWeatherRefresh() {
    return weatherCycle().next - new Date().getTime();
  }
  function scheduleWeatherPoll(delay) {
    if (weatherPollTimer !== null) { clearTimeout(weatherPollTimer); }
    weatherNextDue = new Date().getTime() + delay;
    weatherPollTimer = setTimeout(pollWeather, delay);
  }
  function pollWeather() {
    if (location.protocol === 'file:' || weatherPending) { return; }
    if (weatherPollTimer !== null) { clearTimeout(weatherPollTimer); weatherPollTimer = null; }
    weatherPending = true; weatherStartedAt = new Date().getTime();
    var xhr = new XMLHttpRequest(), finished = false, timeout;
    cancelWeatherRequest = function () {
      if (finished) { return; }
      finished = true; clearTimeout(timeout); weatherPending = false; cancelWeatherRequest = null;
      xhr.onreadystatechange = null;
      try { xhr.abort(); } catch (error) {}
    };
    function finish(ok) {
      if (finished) { return; }
      finished = true; clearTimeout(timeout); weatherPending = false; cancelWeatherRequest = null; errors.weather = !ok; topLine();
      if (kindleSite) { return; }
      var ready = ok && weather.refreshMode === 'twice-daily' && dailyWeatherValid(weather);
      weatherFailures = ready ? 0 : weatherFailures + 1;
      var delay = ready ? nextWeatherRefresh() : retryDelay(weatherFailures);
      scheduleWeatherPoll(delay);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || finished) { return; }
      if (xhr.status !== 200) { finish(false); return; }
      try { finish(acceptWeather(JSON.parse(xhr.responseText))); }
      catch (error) { finish(false); }
    };
    try {
      xhr.open('GET', 'weather.json?_=' + new Date().getTime(), true);
      timeout = setTimeout(function () { finish(false); try { xhr.abort(); } catch (error) {} }, REQUEST_TIMEOUT);
      xhr.send(null);
    } catch (error) { finish(false); }
  }
  function resumeWeather() {
    var now = new Date().getTime(), expired = weatherPending && now - weatherStartedAt >= REQUEST_TIMEOUT;
    if (expired) { cancelWeatherRequest(); }
    loadOptionalScript(weatherScript, true);
    if (weatherClient && weatherClient.resume) { weatherClient.resume(); }
    if (!weatherPending && (expired || now >= weatherNextDue || (weatherFailures > 0 && now - weatherStartedAt >= 1000))) { pollWeather(); }
    topLine();
  }
  function topLine() {
    var en = english(), value = currentDay;
    var lunar = calendar.dates && calendar.dates[currentDay], age = new Date().getTime() - weatherTime(weather.observedAt);
    var traditionalDay = almanac.dates && almanac.dates[currentDay];
    var suitable = !en && traditionalDay && array(traditionalDay.yi) && traditionalDay.yi.length ? '宜' + traditionalDay.yi.slice(0, 2).join('、') : '';
    var events = festivals.dates && festivals.dates[currentDay] || [], names = [], seenNames = {};
    for (var h = 0; h < events.length; h++) {
      var name = en ? events[h].textEn || events[h].text : events[h].text;
      if (name && !seenNames[name]) { names.push(name); seenNames[name] = true; }
    }
    var lunarLabel = names.length ? names.join(' · ') : lunar ? (en ? lunar.textEn : lunar.text) : '';
    var fresh = dailyWeatherValid(weather);
    if (kindleSite && fresh) { savedForecast = weather; }
    var shown = fresh ? weather : savedForecast || weather, daily = fresh || !!savedForecast;
    var showWeather = daily || (!shown.refreshMode && typeof shown.temperatureC === 'number' && isFinite(shown.temperatureC) && isFinite(age) && age <= 3 * 3600000 && age >= -3600000);
    var tomorrow = daily && shown.forecastDate === shiftDate(today(), 1);
    var temperatureLabel = daily ? Math.round(shown.lowC) + '–' + Math.round(shown.highC) + '°C' : Math.round(shown.temperatureC) + '°C';
    var periodLabel = tomorrow ? (en ? ' (Tmr)' : '（明）') : '';
    if (daily && kindleSite && shown.forecastDate < currentDay) { periodLabel = ' ' + shown.forecastDate.slice(5).replace('-', '/'); }
    var forecastLabel = daily ? (en ? shown.forecastDate + ' daily forecast, updated ' + shown.refreshedAt.slice(11, 16) + ', refresh at 06:00 and 18:00 Beijing time' : shown.forecastDate + ' 日预报，' + shown.refreshedAt.slice(11, 16) + '更新，每日06:00和18:00刷新') : '';
    var condition = (shown.condition || '') + ' ' + (shown.conditionEn || ''), icon = 'cloud';
    var weatherLabel = en ? shown.conditionEn || shown.condition : shown.condition;
    if (/雷|Thunder/i.test(condition)) { icon = 'cloud-lightning'; }
    else if (/雪|Snow/i.test(condition)) { icon = 'snowflake'; }
    else if (/雨|Rain|Drizzle/i.test(condition)) { icon = 'cloud-rain'; }
    else if (/多云|Partly/i.test(condition)) { icon = 'cloud-sun'; }
    else if (/晴|Clear/i.test(condition)) { icon = 'sun'; }
    var weatherLine = el('weather-line');
    if (showWeather) {
      attribute(weatherLine, 'aria-label', (tomorrow ? (en ? 'Tomorrow’s weather, ' : '明日天气，') : '') + weatherLabel + ' ' + temperatureLabel + (forecastLabel ? ', ' + forecastLabel : ''));
      attribute(weatherLine, 'title', forecastLabel || weatherLabel + ' ' + temperatureLabel);
    }
    var key = JSON.stringify([value, !!en, lunarLabel, suitable, showWeather ? [icon, weatherLabel, temperatureLabel, periodLabel] : null]);
    // Polling still checks freshness, but unchanged content should not repaint the e-ink header.
    if (key === topLineKey) { return; }
    topLineKey = key;
    text(el('lunar-text'), lunarLabel);
    text(el('almanac-line'), suitable ? (lunarLabel ? ' · ' : '') + suitable : '');
    attribute(el('lunar-line'), 'title', lunarLabel + (suitable ? (lunarLabel ? ' · ' : '') + suitable : ''));
    visible(el('almanac-line'), !!suitable); visible(el('lunar-line'), true);
    text(el('top-line'), value);
    clear(weatherLine); visible(weatherLine, false);
    if (showWeather) {
      var picture = node('img', 'weather-icon'); picture.src = 'images/weather/' + icon + '.svg'; picture.alt = weatherLabel;
      picture.onerror = function () { this.style.display = 'none'; topLineKey = null; };
      visible(weatherLine, true); weatherLine.appendChild(picture);
      weatherLine.appendChild(node('span', '', ' ' + temperatureLabel));
      if (periodLabel) { weatherLine.appendChild(node('span', 'weather-period', periodLabel)); }
    }
  }
  function addRow(target, item, en, timed, concise) {
    var row = node('div', 'row' + (item.done ? ' done' : '')), content = node('div', 'entry');
    if (timed && (item.text === '午餐' || item.textEn === 'Lunch')) { row.className += ' lunch-row'; }
    row.appendChild(node('span', timed ? 'time' : 'mark', timed ? itemTime(item, en) : (item.done ? '✓' : '□')));
    var title = node('div', 'entry-title', localized(item, en));
    if (item.example) { title.appendChild(node('span', 'sample', en ? 'Sample' : '示例')); }
    content.appendChild(title);
    var detail = en ? item.detailEn || item.detail : item.detail;
    if (concise) { detail = ''; }
    else if (!timed && item.start) { detail = item.start + (item.end ? ' – ' + item.end : '') + (detail ? ' · ' + detail : ''); }
    if (detail) { content.appendChild(node('div', 'detail', detail)); }
    row.appendChild(content); target.appendChild(row);
  }
  function breakfast(en) {
    loadOptionalScript(plannerScript, false);
    var date = shanghaiNow().getUTCHours() < 10 ? currentDay : shiftDate(currentDay, 1), meal = null;
    for (var i = 0; i < (data.breakfasts || []).length; i++) { if (data.breakfasts[i].date === date) { meal = data.breakfasts[i]; break; } }
    var rotation = data.breakfastRotation || {};
    if (!meal && typeof BreakfastPlanner !== 'undefined') {
      var mealId = BreakfastPlanner.mealForDate(date, rotation);
      if (mealId) { meal = { date: date, mealId: mealId }; }
    }
    var label = date === currentDay ? (en ? 'Today’s breakfast' : '今日早餐') : (en ? 'Tomorrow’s breakfast' : '明日早餐');
    text(el('breakfast-label'), label);
    var recipe = meal, entries = menus.items || [];
    if (meal && meal.mealId) {
      for (var m = 0; m < entries.length; m++) { if (entries[m].id === meal.mealId) { recipe = entries[m]; break; } }
    }
    var name = meal && meal.text ? localized(meal, en) : (recipe ? localized(recipe, en) : '');
    var fallback = en ? 'Not planned yet' : '待安排';
    if (typeof BreakfastPlanner === 'undefined') {
      fallback = plannerScript.failed ? (en ? 'Breakfast unavailable' : '早餐读取失败') : (en ? 'Loading breakfast' : '早餐读取中');
    }
    text(el('breakfast-text'), name || fallback);
    visible(el('breakfast-visual'), !!(recipe && recipe.image));
    if (recipe && recipe.image) {
      var photo = el('breakfast-photo'), visual = el('breakfast-visual'), cropBox = el('breakfast-crop'), crop = recipe.crop;
      var sourceChanged = photo.getAttribute('src') !== recipe.image;
      var cropKey = JSON.stringify(crop || null);
      if (photo.alt !== name) { photo.alt = name; }
      photo.onerror = function () { photoFailed = true; visible(visual, false); };
      var fitCrop = function (sw, x, y, width, height) {
        var scale = Math.min(1 / width, 0.5 / height);
        style(cropBox, 'width', (width * scale * 100) + '%'); style(cropBox, 'paddingBottom', (height * scale * 100) + '%');
        style(cropBox, 'left', ((1 - width * scale) * 50) + '%'); style(cropBox, 'marginTop', ((0.5 - height * scale) * 50) + '%');
        style(photo, 'width', (sw / width * 100) + '%'); style(photo, 'left', (-x / width * 100) + '%'); style(photo, 'marginTop', (-y / width * 100) + '%'); style(photo, 'top', '0');
      };
      if (sourceChanged || cropKey !== photoCropKey) {
        photoCropKey = cropKey;
        className(visual, 'breakfast-visual cropped'); style(visual, 'paddingBottom', '50%');
        photo.onload = null;
        if (crop && crop.sourceWidth > 0 && crop.sourceHeight > 0 && crop.width > 0 && crop.height > 0 && crop.x >= 0 && crop.y >= 0 && crop.x + crop.width <= crop.sourceWidth && crop.y + crop.height <= crop.sourceHeight) {
          fitCrop(crop.sourceWidth, crop.x, crop.y, crop.width, crop.height);
        } else {
          style(cropBox, 'width', '100%'); style(cropBox, 'paddingBottom', '50%'); style(cropBox, 'left', '0'); style(cropBox, 'marginTop', '0');
          style(photo, 'width', '100%'); style(photo, 'left', '0'); style(photo, 'marginTop', '0'); style(photo, 'top', '0');
          photo.onload = function () {
            var width = photo.naturalWidth || photo.width, height = photo.naturalHeight || photo.height;
            if (width > 0 && height > 0) { fitCrop(width, 0, 0, width, height); }
          };
        }
        if (!sourceChanged && photo.complete && photo.onload) { photo.onload(); }
      }
      // Reassigning an unchanged src can revalidate and decode a large PNG on old Kindle browsers.
      if (sourceChanged || photoFailed) {
        photoFailed = false; photo.src = recipe.image;
        if (photo.complete && photo.onload) { photo.onload(); }
      }
    }
    var detailSource = meal && meal.detail ? meal : recipe;
    var detail = detailSource ? (en ? detailSource.detailEn || detailSource.detail : detailSource.detail) : '';
    if (recipe && recipe.porridge === true && typeof BreakfastPlanner !== 'undefined') {
      var porridge = BreakfastPlanner.porridgeForDate(date, menus.porridgeRotation, en);
      if (porridge && detail) { detail = detail.replace(en ? /millet or oat porridge/gi : /小米\/燕麦粥/g, porridge); }
    }
    var drink = breakfastDrink(date, en);
    if (drink) { detail = detail ? detail + (en ? '; ' : '、') + drink : drink; }
    visible(el('breakfast-detail'), !!detail); text(el('breakfast-detail'), detail ? (en ? 'With ' : '搭配：') + detail : '');
    var note = recipe ? (en ? recipe.noteEn || recipe.note : recipe.note) : '';
    visible(el('breakfast-note'), !!note); text(el('breakfast-note'), note || '');
  }
  function renderFamily(view, en) {
    breakfast(en);
  }
  function renderTasks(view, en, redraw) {
    var target = el('entries'); className(target, 'task-handwriting');
    if (redraw) {
      for (var i = 0; i < view.entries.length; i++) { addRow(target, view.entries[i].item, en, false, true); }
      if (!view.entries.length) { target.appendChild(node('p', 'empty', en ? 'No tasks for today' : '今天没有待办事项')); }
    }
  }
  function visibleBodyKey(view, en) {
    var child = isChild(view.page), tasks = isTasks(view.page), rows = [], notes = null, bring = [];
    for (var i = 0; i < view.entries.length; i++) {
      var item = tasks ? view.entries[i].item : view.entries[i];
      rows.push([!!item.done, child ? itemTime(item, en) : null, localized(item, en), !!item.example,
        child && (item.text === '午餐' || item.textEn === 'Lunch'),
        child ? (en ? item.detailEn || item.detail : item.detail) || '' : '']);
    }
    if (child) {
      var plan = dayPlan(), source = view.page.sourceId ? pageById(view.page.sourceId) : view.page;
      notes = plan ? [true, (en ? plan.noteEn || plan.noteZh : plan.noteZh) || ''] : [false];
      var items = datedItems(source.items || [], selectedDay);
      for (var j = 0; j < items.length; j++) { bring.push(localized(items[j], en)); }
    }
    return JSON.stringify([view.page.id, !!en, view.chunk, view.count, currentDay, child ? selectedDay : null,
      notes, bring, !!(data.demo || view.page.demo), rows]);
  }
  function renderChild(view, en, redraw) {
    var target = el('entries'), plan = dayPlan(), source = view.page.sourceId ? pageById(view.page.sourceId) : view.page;
    var dateBits = selectedDay.split('-'), dateValue = new Date(Date.UTC(+dateBits[0], +dateBits[1] - 1, +dateBits[2]));
    var label = en ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateValue.getUTCDay()] : '周' + '日一二三四五六'.charAt(dateValue.getUTCDay());
    var context = selectedDay === shiftDate(currentDay, 1) ? (en ? 'Tomorrow’s schedule' : '明日课表') : selectedDay === currentDay ? (en ? 'Today’s schedule' : '今日课表') : (en ? 'Schedule' : '课表');
    text(el('day-context'), context);
    text(el('heading'), label);
    text(el('day-prev'), en ? 'Prev day' : '前一天'); text(el('day-next'), en ? 'Next day' : '后一天');
    var returnLabel = defaultChildDate() === currentDay ? (en ? 'Back to today' : '回到今天') : (en ? 'Back to tomorrow' : '回到明天');
    attribute(el('day-today'), 'aria-label', selectedDay + ' ' + label + (en ? ', ' + returnLabel.toLowerCase() : '，' + returnLabel));
    attribute(el('day-today'), 'title', returnLabel);
    attribute(el('day-nav'), 'aria-label', en ? 'Choose a date' : '查看日期');
    selected(el('day-today'), selectedDay === defaultChildDate());
    visible(el('day-note'), !!(plan && (plan.noteZh || plan.noteEn)));
    if (plan) { text(el('day-note'), en ? plan.noteEn || plan.noteZh : plan.noteZh); }
    visible(el('scope'), false);
    if (!plan && redraw) {
      target.appendChild(node('p', 'missing', en ? 'No timetable has been provided for this date.' : '这一天尚未收到课表。'));
    } else if (plan) {
      className(target, 'list');
      if (redraw) {
        for (var i = 0; i < view.entries.length; i++) { addRow(target, view.entries[i], en, true); }
        if (!plan.items.length) { target.appendChild(node('p', 'empty', en ? 'No activities scheduled' : '没有安排活动')); }
      }
    }
    var bring = datedItems(source.items || [], selectedDay), labels = [];
    for (var j = 0; j < bring.length; j++) { labels.push(localized(bring[j], en)); }
    visible(el('bring'), labels.length > 0);
    text(el('bring'), (en ? 'Bring: ' : '记得带：') + labels.join(en ? '; ' : '；'));
  }
  function renderErrors() {
    var en = english(), names = [];
    if (errors.board) { names.push(en ? 'home' : '家庭内容'); }
    if (errors.schedule) { names.push(en ? 'timetable' : '课表'); }
    if (errors.breakfasts) { names.push(en ? 'breakfast photos' : '早餐图片'); }
    visible(el('sync-error'), names.length > 0);
    text(el('sync-error'), names.length ? (en ? 'Sync failed: ' : '同步失败：') + names.join(' / ') + (en ? '. Keeping saved content.' : '，保留上次内容。') : '');
  }
  function fitChild() {
    if (!views.length || !isChild(views[current].page)) { return; }
    var page = el('page'), controls = el('controls'), target = el('entries');
    if (!page.getBoundingClientRect || !controls || !controls.getBoundingClientRect) { return; }
    className(page, 'child-page');
    for (var restored = 0; restored < target.children.length; restored++) {
      if (/(^|\s)lunch-row(\s|$)/.test(target.children[restored].className)) { style(target.children[restored], 'display', ''); }
    }
    var boundary = controls.getBoundingClientRect().top - 8;
    if (boundary <= 0 || page.getBoundingClientRect().bottom <= boundary) { return; }
    className(page, 'child-page child-compact');
    if (page.getBoundingClientRect().bottom <= boundary) { return; }
    // Lunch remains in the source and full timetable; only this small-screen view may omit it.
    for (var i = 0; i < target.children.length; i++) {
      var row = target.children[i];
      if (/(^|\s)lunch-row(\s|$)/.test(row.className)) { style(row, 'display', 'none'); }
    }
  }
  function render() {
    var view = views[current], en = english(), child = isChild(view.page), tasks = isTasks(view.page), target = el('entries');
    var nextBodyKey = visibleBodyKey(view, en), redraw = bodyKey !== nextBodyKey;
    bodyKey = nextBodyKey;
    if (!child || redraw) { className(el('page'), child ? 'child-page' : tasks ? 'tasks-page' : 'breakfast-page'); }
    var language = en ? 'en' : 'zh-CN';
    if (document.documentElement.lang !== language) { document.documentElement.lang = language; }
    text(el('home'), en ? 'Breakfast' : '早餐'); text(el('tasks'), en ? 'Tasks' : '待办'); text(el('child'), en ? 'Child' : '孩子');
    selected(el('home'), !child && !tasks); selected(el('tasks'), tasks); selected(el('child'), child); selected(el('zh'), !en); selected(el('en'), en);
    topLine();
    if (!child) { text(el('heading'), view.page.title || (en ? 'Home today' : '家庭安排')); }
    text(el('part'), view.count > 1 ? (view.chunk + 1) + ' / ' + view.count : '');
    visible(el('day-nav'), child); visible(el('breakfast'), !child && !tasks);
    if (!child) { visible(el('day-note'), false); visible(el('scope'), false); visible(el('bring'), false); }
    if (redraw) { clear(target); className(target, ''); }
    visible(target, child || tasks);
    visible(el('more-items'), view.count > 1);
    text(el('more-items'), child ? (en ? 'More activities' : '更多安排') : (en ? 'More tasks' : '更多任务'));
    if (child) { renderChild(view, en, redraw); } else if (tasks) { renderTasks(view, en, redraw); } else { renderFamily(view, en); }
    text(el('all-data'), en ? 'All info' : '全部资料');
    attribute(el('all-data'), 'href', 'all.html?lang=' + (en ? 'en' : 'zh') + '&section=' + (child ? 'schedule' : tasks ? 'household' : 'breakfasts'));
    var demo = data.demo || view.page.demo;
    visible(el('demo-note'), !!demo);
    text(el('demo-note'), demo ? (en ? 'Sample content' : '示例内容') : '');
    text(el('play'), en ? (playing ? 'Stop auto switch' : 'Start auto switch') : (playing ? '停止轮播' : '开启轮播'));
    renderErrors();
    if (child && redraw) { fitChild(); }
  }
  function validBreakfastDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) { return false; }
    var bits = value.split('-'), year = +bits[0], month = +bits[1], day = +bits[2];
    if (year < 100) { return false; }
    var date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  function contains(values, value) {
    for (var i = 0; i < values.length; i++) { if (values[i] === value) { return true; } }
    return false;
  }
  // Keep these schema checks aligned with breakfast-planner.js so delayed or
  // failed helper loading never weakens validation of shared household data.
  function validBreakfastRotation(rotation) {
    if (!rotation || rotation.enabled !== true || rotation.strategy !== 'shuffle-bag' || !validBreakfastDate(rotation.startDate)) { return false; }
    var seed = rotation.seed, ids = rotation.mealIds, noodles = rotation.noodleIds || [], meals = [], noodleIds = [], i;
    if (typeof seed !== 'number' || !isFinite(seed) || seed % 1 !== 0 || seed < 1 || seed > 4294967295 || !array(ids) || !ids.length || !array(noodles)) { return false; }
    for (i = 0; i < ids.length; i++) {
      if (typeof ids[i] !== 'string' || !ids[i] || contains(meals, ids[i])) { return false; }
      meals.push(ids[i]);
    }
    for (i = 0; i < noodles.length; i++) {
      if (!contains(meals, noodles[i]) || contains(noodleIds, noodles[i])) { return false; }
      noodleIds.push(noodles[i]);
    }
    return rotation.weekendNoodles !== true || (noodleIds.length > 0 && meals.length <= noodleIds.length * 7);
  }
  function validPorridgeRotation(rotation) {
    if (typeof rotation === 'undefined') { return true; }
    if (!rotation || !validBreakfastDate(rotation.startDate) || !array(rotation.items) || rotation.items.length !== 2) { return false; }
    for (var i = 0; i < rotation.items.length; i++) {
      var item = rotation.items[i];
      if (!item || typeof item.text !== 'string' || !item.text || typeof item.textEn !== 'string' || !item.textEn) { return false; }
    }
    return true;
  }
  function validBoard(next) {
    if (!next || !array(next.pages) || !next.pages.length || next.pages.length > 20) { return false; }
    var ids = {}, required = ['family', 'family_en', 'tasks', 'tasks_en', 'child', 'child_en'];
    for (var i = 0; i < next.pages.length; i++) {
      var page = next.pages[i];
      if (!page || typeof page.id !== 'string' || ids[page.id] || !array(page.items)) { return false; }
      ids[page.id] = true;
      var fields = [page.items, page.reminders || []];
      for (var f = 0; f < fields.length; f++) {
        if (!array(fields[f])) { return false; }
        for (var j = 0; j < fields[f].length; j++) {
          var task = fields[f][j];
          if (!task || typeof task.text !== 'string') { return false; }
          if (typeof task.weekdays !== 'undefined') {
            if (!array(task.weekdays) || !task.weekdays.length) { return false; }
            for (var d = 0; d < task.weekdays.length; d++) { if (typeof task.weekdays[d] !== 'number' || task.weekdays[d] < 0 || task.weekdays[d] > 6 || task.weekdays[d] % 1 !== 0) { return false; } }
          }
        }
      }
    }
    for (var r = 0; r < required.length; r++) { if (!ids[required[r]]) { return false; } }
    for (var s = 0; s < next.pages.length; s++) { if (next.pages[s].sourceId && !ids[next.pages[s].sourceId]) { return false; } }
    if (next.breakfasts && !array(next.breakfasts)) { return false; }
    for (var b = 0; b < (next.breakfasts || []).length; b++) { if (!next.breakfasts[b] || typeof next.breakfasts[b].date !== 'string' || (typeof next.breakfasts[b].text !== 'string' && typeof next.breakfasts[b].mealId !== 'string')) { return false; } }
    if (next.breakfastRotation && next.breakfastRotation.enabled) {
      var rotation = next.breakfastRotation;
      if (!validBreakfastRotation(rotation)) { return false; }
      if (typeof BreakfastPlanner !== 'undefined' && !BreakfastPlanner.mealForDate(rotation.startDate, rotation)) { return false; }
    }
    return true;
  }
  function validFestivals(next) {
    if (!next || !next.dates || typeof next.dates !== 'object' || array(next.dates) || !/^\d{4}-\d{2}-\d{2}$/.test(next.validFrom || '') || !/^\d{4}-\d{2}-\d{2}$/.test(next.validThrough || '') || next.validFrom > next.validThrough) { return false; }
    for (var date in next.dates) {
      if (!Object.prototype.hasOwnProperty.call(next.dates, date)) { continue; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < next.validFrom || date > next.validThrough || !array(next.dates[date])) { return false; }
      for (var i = 0; i < next.dates[date].length; i++) {
        var item = next.dates[date][i];
        if (!item || typeof item.id !== 'string' || typeof item.text !== 'string' || !item.text || (typeof item.textEn !== 'undefined' && typeof item.textEn !== 'string')) { return false; }
      }
    }
    return true;
  }
  function validSchedule(next) {
    if (!next || !array(next.days) || !/^\d{4}-\d{2}-\d{2}$/.test(next.validFrom || '') || !/^\d{4}-\d{2}-\d{2}$/.test(next.validThrough || '') || next.validFrom > next.validThrough) { return false; }
    var dates = {};
    for (var i = 0; i < next.days.length; i++) {
      var day = next.days[i];
      if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day.date || '') || dates[day.date] || day.date < next.validFrom || day.date > next.validThrough || !array(day.items)) { return false; }
      dates[day.date] = true;
      for (var j = 0; j < day.items.length; j++) {
        var item = day.items[j];
        if (!item || typeof item.text !== 'string') { return false; }
        if (item.period) {
          if (!/^(morning|afternoon|evening)$/.test(item.period) || typeof item.start !== 'undefined' || typeof item.end !== 'undefined') { return false; }
        } else if (!/^\d{2}:\d{2}$/.test(item.start || '') || !/^\d{2}:\d{2}$/.test(item.end || '') || item.start >= item.end) { return false; }
      }
    }
    if (next.weeklyItems && !array(next.weeklyItems)) { return false; }
    for (var r = 0; r < (next.weeklyItems || []).length; r++) {
      var rule = next.weeklyItems[r];
      if (!rule || !array(rule.weekdays) || !rule.weekdays.length || typeof rule.text !== 'string' || !/^\d{2}:\d{2}$/.test(rule.start || '') || !/^\d{2}:\d{2}$/.test(rule.end || '') || rule.start >= rule.end) { return false; }
      for (var w = 0; w < rule.weekdays.length; w++) { if (rule.weekdays[w] < 0 || rule.weekdays[w] > 6 || rule.weekdays[w] % 1 !== 0) { return false; } }
    }
    return true;
  }
  function validMenus(next) {
    if (!next || !array(next.items) || !validDrinks(next.drinks) || !validPorridgeRotation(next.porridgeRotation)) { return false; }
    for (var i = 0; i < next.items.length; i++) {
      var meal = next.items[i];
      if (!meal || typeof meal.id !== 'string' || typeof meal.text !== 'string' || (meal.image && !/^images\/breakfast\/[a-zA-Z0-9_.-]+\.(jpg|jpeg|png|webp)$/.test(meal.image))) { return false; }
    }
    return true;
  }
  function calendarReady(key, value) {
    if (!value || !value.dates || !value.validFrom || !value.validThrough || currentDay < value.validFrom || currentDay > value.validThrough) { return false; }
    if (key === 'festivals') { return validFestivals(value); }
    var day = value.dates[currentDay];
    return !!day && (key === 'calendar' ? typeof day.text === 'string' && typeof day.textEn === 'string' : array(day.yi));
  }
  function refreshMissingCalendars() {
    var values = { calendar: calendar, almanac: almanac, festivals: festivals };
    for (var i = 0; i < pollers.length; i++) {
      var key = pollers[i].key;
      if (values[key] && !calendarReady(key, values[key])) { pollers[i].run(); }
    }
  }
  function applyBoard(next, initialLoad) {
    if (!validBoard(next)) { return false; }
    var old = views[current], previousInterval = interval(), cv = String((next.settings || {}).controlVersion || 0);
    var changeControl = initialLoad || cv !== lastControl;
    data = next; data.settings = data.settings || {};
    rebuild(old ? old.page.id : 'family', old ? old.chunk : 0);
    if (changeControl) {
      currentDay = today(); selectedDay = defaultChildDate(); defaultDay = selectedDay;
      playing = data.settings.autoRotate !== false;
      var id = data.settings.showPage;
      if (id === 'helper') { id = 'family'; } else if (id === 'helper_en') { id = 'family_en'; }
      if (initialLoad && pageById(initialPage)) { id = initialPage; playing = false; }
      else if (initialLoad && kindleSite && !pageById(id)) { id = 'family_en'; }
      if (id && pageById(id)) { rebuild(id, 0); } else { rebuild(views[current].page.id, views[current].chunk); }
    }
    lastControl = cv;
    render();
    if (timer === null || changeControl || previousInterval !== interval()) { schedule(); }
    return true;
  }
  function contentPollDelay() {
    var seconds = Number((data.settings || {}).pollIntervalSeconds);
    return isFinite(seconds) && seconds >= 60 ? Math.min(7200, seconds) * 1000 : null;
  }
  function checkClientVersion(next) {
    var version = (next.settings || {}).clientVersion;
    if (reloading || location.protocol === 'file:' || typeof version !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(version) || version === CLIENT_VERSION || !location.replace) { return; }
    if (new RegExp('(?:^|[?&])_app=' + version + '(?:&|$)').test(location.search || '')) { return; }
    reloading = true;
    location.replace('index.html?_app=' + version + '&_=' + new Date().getTime() + '#' + views[current].page.id);
  }
  function pollJson(path, delay, key, accept, initialDelay) {
    if (location.protocol === 'file:') { return; }
    var poller = { key: key, pending: false, timer: null, lastStarted: null, failures: 0 };
    poller.run = function () {
      if (poller.pending) { return; }
      if (poller.timer !== null) { clearTimeout(poller.timer); poller.timer = null; }
      poller.pending = true; poller.lastStarted = new Date().getTime();
      var xhr, finished = false, timeout;
      function finish(ok) {
        if (finished) { return; }
        finished = true; clearTimeout(timeout); poller.pending = false; poller.cancel = null;
        errors[key] = !ok; topLine(); renderErrors();
        poller.failures = ok ? 0 : poller.failures + 1;
        var nextDelay = typeof delay === 'function' ? (ok ? delay() : null) : delay;
        if (!ok && !kindleSite) { nextDelay = retryDelay(poller.failures); }
        if (nextDelay !== null) { poller.timer = setTimeout(poller.run, nextDelay); }
      }
      poller.cancel = function () {
        if (finished) { return; }
        finished = true; clearTimeout(timeout); poller.pending = false; poller.cancel = null;
        if (xhr) {
          xhr.onreadystatechange = null;
          try { xhr.abort(); } catch (error) {}
        }
      };
      try {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4 || finished) { return; }
          if (xhr.status !== 200) { finish(false); return; }
          try {
            var next = JSON.parse(xhr.responseText), signature = payloadSignature(next);
            if (payloads[key] === signature) {
              if (key === 'board') { checkClientVersion(next); }
              finish(true); return;
            }
            var ok = accept(next) !== false;
            if (ok) { payloads[key] = signature; }
            finish(ok);
          } catch (error) { finish(false); }
        };
        xhr.open('GET', path + '?_=' + new Date().getTime(), true);
        try { xhr.setRequestHeader('Cache-Control', 'no-cache'); } catch (headerError) {}
        timeout = setTimeout(function () { finish(false); try { xhr.abort(); } catch (error) {} }, REQUEST_TIMEOUT);
        xhr.send(null);
      } catch (error) { finish(false); }
    };
    pollers.push(poller);
    if (initialDelay) { poller.timer = setTimeout(poller.run, initialDelay); }
    else { poller.run(); }
  }
  function refreshContent() {
    var now = new Date().getTime();
    for (var i = 0; i < pollers.length; i++) {
      var poller = pollers[i];
      var expired = poller.pending && now - poller.lastStarted >= REQUEST_TIMEOUT;
      if (expired) { poller.cancel(); }
      if (expired || (/^(board|schedule|breakfasts)$/.test(poller.key) && (poller.lastStarted === null || now - poller.lastStarted >= 1000))) { poller.run(); }
    }
  }
  el('home').onclick = function () { plannerScript.retryAt = 0; select(english() ? 'family_en' : 'family'); };
  el('tasks').onclick = function () { select(english() ? 'tasks_en' : 'tasks'); };
  el('child').onclick = function () {
    currentDay = today(); selectedDay = defaultChildDate(); defaultDay = selectedDay;
    select(english() ? 'child_en' : 'child');
  };
  el('zh').onclick = function () { select(isChild(views[current].page) ? 'child' : isTasks(views[current].page) ? 'tasks' : 'family', views[current].chunk); };
  el('en').onclick = function () { select(isChild(views[current].page) ? 'child_en' : isTasks(views[current].page) ? 'tasks_en' : 'family_en', views[current].chunk); };
  el('play').onclick = function () {
    playing = !playing;
    if (playing) {
      var old = views[current]; currentDay = today(); selectedDay = defaultChildDate(); defaultDay = selectedDay; rebuild(old.page.id, 0);
    }
    render(); schedule();
  };
  el('more-items').onclick = function () {
    pause();
    var old = views[current];
    if (!isChild(old.page) && !isTasks(old.page)) { rebuild(english() ? 'tasks_en' : 'tasks', 0); }
    else { rebuild(old.page.id, (old.chunk + 1) % old.count); }
    render();
  };
  function chooseDate(offset, reset) {
    syncClock(false);
    pause(); selectedDay = reset ? defaultChildDate() : shiftDate(selectedDay, offset);
    rebuild(views[current].page.id, 0); render();
    if (reset) { refreshContent(); resumeWeather(); }
  }
  el('day-prev').onclick = function () { chooseDate(-1, false); };
  el('day-next').onclick = function () { chooseDate(1, false); };
  el('day-today').onclick = function () { chooseDate(0, true); };
  function syncClock(reset) {
    var now = today(), nextDefault = defaultChildDate(), boundary = now !== currentDay || nextDefault !== defaultDay;
    var period = contentPeriod(), contentBoundary = period !== lastContentPeriod;
    lastContentPeriod = period;
    currentDay = now; defaultDay = nextDefault;
    if (boundary || reset) {
      var old = views[current]; selectedDay = nextDefault;
      rebuild(old.page.id, 0); render();
    } else {
      topLine();
      if (!isChild(views[current].page) && !isTasks(views[current].page)) { breakfast(english()); }
    }
    if (boundary || contentBoundary) {
      refreshContent(); refreshMissingCalendars();
      if (kindleSite) {
        if (weather.refreshMode !== 'twice-daily' || !dailyWeatherValid(weather)) { resumeWeather(); }
        loadOptionalScript(plannerScript, true);
      }
    }
  }
  function scheduleClock() {
    if (clockTimer !== null) { clearTimeout(clockTimer); }
    var now = shanghaiNow(), elapsed = ((now.getUTCHours() * 60 + now.getUTCMinutes()) * 60 + now.getUTCSeconds()) * 1000 + now.getUTCMilliseconds();
    var boundaries = [21600000, 36000000, 43200000, 64800000, 86400000], delay = 86400000 - elapsed;
    for (var i = 0; i < boundaries.length; i++) { if (boundaries[i] > elapsed) { delay = boundaries[i] - elapsed; break; } }
    clockTimer = setTimeout(function () { clockTimer = null; syncClock(false); scheduleClock(); }, Math.max(1, delay));
  }
  function resumePage(reset) {
    if (!kindleSite && scriptNeeded(plannerScript)) { plannerScript.retryAt = 0; }
    syncClock(reset);
    if (!kindleSite) { refreshContent(); refreshMissingCalendars(); resumeWeather(); }
    scheduleClock();
  }
  window.onpageshow = function (event) {
    resumePage(!!(event && event.persisted));
  };
  window.onresize = function () { fitChild(); };
  window.onload = function () { resumePage(false); fitChild(); };
  window.onfocus = function () { resumePage(false); };
  if (!kindleSite) { window.ononline = function () { resumePage(false); }; }
  if (document.addEventListener) { document.addEventListener('visibilitychange', function () { if (!document.hidden) { resumePage(false); } }, false); }
  function payloadSignature(value) {
    var content = {};
    for (var key in value) { if (Object.prototype.hasOwnProperty.call(value, key) && key !== 'updatedAt') { content[key] = value[key]; } }
    return JSON.stringify(content);
  }
  if (applyBoard(data, true)) { payloads.board = payloadSignature(data); }
  if (validSchedule(course)) { payloads.schedule = payloadSignature(course); }
  if (validMenus(menus)) { payloads.breakfasts = payloadSignature(menus); }
  pollJson('board.json', contentPollDelay, 'board', function (next) { var ok = applyBoard(next, false); if (ok) { checkClientVersion(next); } return ok; });
  pollJson('schedule.json', contentPollDelay, 'schedule', function (next) {
    if (!validSchedule(next)) { return false; }
    var old = views[current]; course = next; rebuild(old.page.id, old.chunk); render(); return true;
  });
  pollWeather();
  pollJson('breakfasts.json', contentPollDelay, 'breakfasts', function (next) {
    if (!validMenus(next)) { return false; }
    menus = next; render(); return true;
  });
  pollJson('calendar.json', 86400000, 'calendar', function (next) {
    if (!next || !next.dates || !next.validFrom || !next.validThrough) { return false; }
    calendar = next; topLine(); return true;
  }, calendarReady('calendar', calendar) ? 86400000 : 0);
  pollJson('almanac.json', 86400000, 'almanac', function (next) {
    if (!next || !next.dates || !next.validFrom || !next.validThrough) { return false; }
    almanac = next; topLine(); return true;
  }, calendarReady('almanac', almanac) ? 86400000 : 0);
  pollJson('festivals.json', 86400000, 'festivals', function (next) {
    if (!validFestivals(next)) { return false; }
    festivals = next; topLine(); return true;
  }, calendarReady('festivals', festivals) ? 86400000 : 0);
  loadOptionalScript(weatherScript, false);
  scheduleClock();
}());
