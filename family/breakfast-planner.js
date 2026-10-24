(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.BreakfastPlanner = factory(); }
}(this, function () {
  'use strict';
  var DAY = 86400000, MAX_DAYS = 36600, cache = null;
  function array(value) { return Object.prototype.toString.call(value) === '[object Array]'; }
  function dayNumber(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) { return null; }
    var parts = value.split('-'), year = +parts[0], month = +parts[1], day = +parts[2];
    if (year < 100) { return null; }
    var date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) { return null; }
    return date.getTime() / DAY;
  }
  function member(values, value) {
    for (var i = 0; i < values.length; i++) { if (values[i] === value) { return true; } }
    return false;
  }
  function normalize(config) {
    if (!config || config.enabled !== true || config.strategy !== 'shuffle-bag') { return null; }
    var seed = config.seed, start = dayNumber(config.startDate), ids = config.mealIds, noodles = config.noodleIds || [];
    if (start === null || typeof seed !== 'number' || !isFinite(seed) || seed % 1 !== 0 || seed < 1 || seed > 4294967295) { return null; }
    if (!array(ids) || !ids.length || !array(noodles)) { return null; }
    var i, meals = [], noodleIds = [];
    for (i = 0; i < ids.length; i++) {
      if (typeof ids[i] !== 'string' || !ids[i] || member(meals, ids[i])) { return null; }
      meals.push(ids[i]);
    }
    for (i = 0; i < noodles.length; i++) {
      if (!member(meals, noodles[i]) || member(noodleIds, noodles[i])) { return null; }
      noodleIds.push(noodles[i]);
    }
    var weekends = config.weekendNoodles === true;
    // An endless weekly noodle requirement needs at least one noodle per seven
    // meals. Reject impossible menus instead of silently breaking the promise.
    if (weekends && (!noodleIds.length || meals.length > noodleIds.length * 7)) { return null; }
    return { start: start, seed: seed, mealIds: meals, noodleIds: noodleIds, weekends: weekends,
      key: JSON.stringify([start, seed, meals, noodleIds, weekends]) };
  }
  function random(state) {
    var value = state.seed;
    value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
    state.seed = value >>> 0;
    return state.seed / 4294967296;
  }
  function weekday(day) { return ((day + 4) % 7 + 7) % 7; }
  function neededNoodles(day, daysLeft, satisfiedSunday) {
    // Each unfinished weekend is a deadline on Sunday. Only deadlines before
    // this bag ends need a noodle reserved from this bag; later bags refill.
    var firstSunday = day + 7 - weekday(day), lastDay = day + daysLeft;
    if (firstSunday > lastDay) { return 0; }
    var count = Math.floor((lastDay - firstSunday) / 7) + 1;
    if (satisfiedSunday !== null && satisfiedSunday >= firstSunday && satisfiedSunday <= lastDay) { count--; }
    return count;
  }
  function draw(state, config, day) {
    if (!state.bag.length) { state.bag = config.mealIds.slice(0); }
    var dayOfWeek = weekday(day), noodlesLeft = 0, choices = [], saturdayNoodles = [], i;
    for (i = 0; i < state.bag.length; i++) { if (member(config.noodleIds, state.bag[i])) { noodlesLeft++; } }
    for (i = 0; i < state.bag.length; i++) {
      var isNoodle = member(config.noodleIds, state.bag[i]), satisfiedSunday = state.satisfiedSunday;
      if (config.weekends) {
        if (dayOfWeek === 0 && satisfiedSunday !== day && !isNoodle) { continue; }
        if (isNoodle && (dayOfWeek === 6 || dayOfWeek === 0)) { satisfiedSunday = dayOfWeek === 6 ? day + 1 : day; }
        if (noodlesLeft - (isNoodle ? 1 : 0) < neededNoodles(day, state.bag.length - 1, satisfiedSunday)) { continue; }
      }
      choices.push(i);
      if (isNoodle) { saturdayNoodles.push(i); }
    }
    if (config.weekends && dayOfWeek === 6 && saturdayNoodles.length) { choices = saturdayNoodles; }
    if (!choices.length) { return null; }
    var index = choices[Math.floor(random(state) * choices.length)], meal = state.bag.splice(index, 1)[0];
    if (config.weekends && member(config.noodleIds, meal) && (dayOfWeek === 6 || dayOfWeek === 0)) {
      state.satisfiedSunday = dayOfWeek === 6 ? day + 1 : day;
    }
    return meal;
  }
  function mealForDate(date, config) {
    var day = dayNumber(date), normalized = normalize(config);
    if (day === null || !normalized || day < normalized.start || day - normalized.start > MAX_DAYS) { return null; }
    if (!cache || cache.key !== normalized.key) {
      cache = { key: normalized.key, seed: normalized.seed, bag: [], meals: [], satisfiedSunday: null };
    }
    var offset = day - normalized.start;
    while (cache.meals.length <= offset) {
      var meal = draw(cache, normalized, normalized.start + cache.meals.length);
      if (meal === null) { cache = null; return null; }
      cache.meals.push(meal);
    }
    return cache.meals[offset];
  }
  return { mealForDate: mealForDate, deterministic: true };
}));
