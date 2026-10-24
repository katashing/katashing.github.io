(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  function text(target, value) {
    if ('textContent' in target) { target.textContent = value; }
    else { target.innerText = value; }
  }
  function node(tag, className, value) {
    var target = document.createElement(tag);
    if (className) { target.className = className; }
    if (typeof value !== 'undefined') { text(target, value); }
    return target;
  }
  function clear(target) { while (target.firstChild) { target.removeChild(target.firstChild); } }
  function array(value) { return Object.prototype.toString.call(value) === '[object Array]'; }
  function parameter(name) {
    var parts = (location.search || '').replace(/^\?/, '').split('&');
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split('=');
      if (pair[0] === name) {
        try { return decodeURIComponent((pair[1] || '').replace(/\+/g, ' ')); }
        catch (error) { return ''; }
      }
    }
    return '';
  }
  function pad(value) { return ('0' + value).slice(-2); }
  function today() {
    var now = new Date(new Date().getTime() + 8 * 3600000);
    return now.getUTCFullYear() + '-' + pad(now.getUTCMonth() + 1) + '-' + pad(now.getUTCDate());
  }
  function shiftDate(date, offset) {
    var bits = date.split('-'), shifted = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2] + offset));
    return shifted.getUTCFullYear() + '-' + pad(shifted.getUTCMonth() + 1) + '-' + pad(shifted.getUTCDate());
  }
  function weekday(date) {
    var bits = date.split('-');
    return new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2])).getUTCDay();
  }
  function dateLabel(date) {
    var bits = date.split('-');
    var day = new Date(Date.UTC(+bits[0], +bits[1] - 1, +bits[2])).getUTCDay();
    return date + ' ' + (en ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] : '周' + '日一二三四五六'.charAt(day));
  }
  function localized(item, detail) {
    var key = detail ? 'detail' : 'text';
    return en ? item[key + 'En'] || item[key] || '' : item[key] || '';
  }
  var en = parameter('lang') === 'en';
  var section = parameter('section'), selectedDate = parameter('date'), mealPage = Number(parameter('page')) || 0;
  if (section !== 'schedule' && section !== 'household') { section = 'breakfasts'; }
  mealPage = Math.max(0, Math.floor(mealPage));
  var data = { breakfasts: null, schedule: null, household: null, reference: null }, errors = {}, pending = {}, openReference = {};
  var files = { breakfasts: 'breakfasts.json', schedule: 'schedule.json', household: 'board.json', reference: 'household-reference.json' };
  function label(key) {
    var labels = { breakfasts: en ? 'Breakfasts' : '早餐列表', schedule: en ? 'Weekly schedule' : '本周课表', household: en ? 'Household tasks' : '家务日程' };
    return labels[key];
  }
  function languageLink(language) {
    return 'all.html?lang=' + language + '&section=' + section + (selectedDate ? '&date=' + encodeURIComponent(selectedDate) : '') + (mealPage ? '&page=' + mealPage : '');
  }
  function shell() {
    document.documentElement.lang = en ? 'en' : 'zh-CN';
    var title = section === 'breakfasts' ? (en ? 'Breakfast menu' : '早餐菜单') : label(section);
    document.title = title;
    el('all-board').className = 'all-board' + (section === 'breakfasts' ? ' menu-view' : '');
    text(el('back-board'), en ? 'Back to board' : '返回看板');
    var back = section === 'schedule' ? 'child' : section === 'household' ? 'tasks' : 'family';
    el('back-board').href = 'index.html#' + back + (en ? '_en' : '');
    el('language-zh').href = languageLink('zh');
    el('language-en').href = languageLink('en');
    el('language-zh').className = en ? '' : 'selected';
    el('language-en').className = en ? 'selected' : '';
    el('language-zh').setAttribute('aria-current', en ? 'false' : 'true');
    el('language-en').setAttribute('aria-current', en ? 'true' : 'false');
    el('sections').setAttribute('aria-label', en ? 'Information categories' : '资料栏目');
    var keys = ['breakfasts', 'schedule', 'household'], failures = [];
    for (var i = 0; i < keys.length; i++) {
      var button = el('section-' + keys[i]);
      text(button, label(keys[i]));
      button.className = section === keys[i] ? 'selected' : '';
      button.setAttribute('aria-pressed', section === keys[i] ? 'true' : 'false');
      if (errors[keys[i]]) { failures.push(label(keys[i])); }
    }
    if (errors.reference && section === 'household') { failures.push(en ? 'Routine information' : '常规资料'); }
    text(el('sync-error'), failures.length ? failures.join(en ? ', ' : '、') + (en ? ' could not be loaded.' : '读取失败。') : '');
    el('sync-error').className = failures.length ? 'sync-error' : 'sync-error hidden';
    text(el('retry'), en ? 'Try again' : '重新读取');
    el('retry').className = failures.length ? 'retry' : 'retry hidden';
  }
  function empty(target, message) { target.appendChild(node('p', 'empty', message)); }
  function appendPhoto(target, meal) {
    if (!meal.image) { return; }
    var photoBox = node('div', 'meal-photo'), frame = node('div', 'meal-frame'), image = node('img'), crop = meal.crop;
    image.alt = localized(meal, false);
    image.onerror = function () { photoBox.style.display = 'none'; };
    var sourceWidth = crop ? Number(crop.sourceWidth) : 0, sourceHeight = crop ? Number(crop.sourceHeight) : 0;
    var x = crop ? Number(crop.x) : 0, y = crop ? Number(crop.y) : 0;
    var width = crop ? Number(crop.width) : 0, height = crop ? Number(crop.height) : 0;
    function fitCrop(sw, cx, cy, cw, ch) {
      var cropWindow = node('div', 'meal-crop'), scale = Math.min(1 / cw, 0.5 / ch);
      cropWindow.style.width = (cw * scale * 100) + '%';
      cropWindow.style.paddingBottom = (ch * scale * 100) + '%';
      cropWindow.style.left = ((1 - cw * scale) * 50) + '%';
      cropWindow.style.marginTop = ((0.5 - ch * scale) * 50) + '%';
      image.style.width = (sw / cw * 100) + '%';
      image.style.left = (-cx / cw * 100) + '%';
      image.style.marginTop = (-cy / cw * 100) + '%';
      image.style.top = '0';
      clear(frame); cropWindow.appendChild(image); frame.appendChild(cropWindow);
    }
    if (sourceWidth > 0 && sourceHeight > 0 && width > 0 && height > 0 && x >= 0 && y >= 0 && x + width <= sourceWidth && y + height <= sourceHeight) {
      fitCrop(sourceWidth, x, y, width, height);
    } else {
      frame.appendChild(image);
      image.onload = function () {
        var sw = image.naturalWidth || image.width, sh = image.naturalHeight || image.height;
        if (sw > 0 && sh > 0) { fitCrop(sw, 0, 0, sw, sh); }
      };
    }
    image.src = meal.image;
    var imageBox = node('div', 'meal-image-box'); imageBox.appendChild(frame);
    photoBox.appendChild(imageBox); target.appendChild(photoBox);
  }
  function breakfastList(target) {
    var meals = data.breakfasts.items, size = 4, count = Math.max(1, Math.ceil(meals.length / size));
    mealPage = Math.min(mealPage, count - 1);
    target.appendChild(node('p', 'meal-drinks', en ? 'With light tea · light lemon water' : '搭配：清淡的茶 · 淡柠檬水'));
    var menu = node('div', 'meal-menu'), pair;
    for (var i = mealPage * size; i < Math.min(meals.length, (mealPage + 1) * size); i++) {
      if ((i - mealPage * size) % 2 === 0) { pair = node('div', 'meal-pair'); menu.appendChild(pair); }
      var meal = meals[i], row = node('div', 'meal-row' + (meal.image ? '' : ' no-photo')), content = node('div', 'meal-description');
      content.appendChild(node('div', 'meal-name', localized(meal, false)));
      if (localized(meal, true)) { content.appendChild(node('div', 'detail', (en ? 'With ' : '搭配：') + localized(meal, true))); }
      row.appendChild(content); appendPhoto(row, meal); pair.appendChild(row);
    }
    if (meals.length) { target.appendChild(menu); }
    if (!meals.length) { empty(target, en ? 'No breakfasts added yet.' : '尚未添加早餐。'); }
    var pager = node('nav', 'menu-pager'), pagerRow = node('div', 'menu-pager-row');
    pager.setAttribute('aria-label', en ? 'Breakfast menu pages' : '早餐菜单翻页');
    var previousCell = node('div', 'menu-page-control'), previous = node('button', 'menu-prev', en ? 'Previous' : '上一页');
    previous.type = 'button'; previous.disabled = mealPage === 0;
    previous.onclick = function () { if (mealPage > 0) { mealPage--; render(); } };
    previousCell.appendChild(previous); pagerRow.appendChild(previousCell);
    pagerRow.appendChild(node('div', 'menu-page-count', (mealPage + 1) + ' / ' + count));
    var nextCell = node('div', 'menu-page-control'), next = node('button', 'menu-next', en ? 'Next' : '下一页');
    next.type = 'button'; next.disabled = mealPage >= count - 1;
    next.onclick = function () { if (mealPage < count - 1) { mealPage++; render(); } };
    nextCell.appendChild(next); pagerRow.appendChild(nextCell);
    pager.appendChild(pagerRow); target.appendChild(pager);
  }
  function dates() {
    var course = data.schedule, result = [], seen = {};
    for (var i = 0; i < course.days.length; i++) {
      var day = course.days[i];
      if ((!course.validFrom || day.date >= course.validFrom) && (!course.validThrough || day.date <= course.validThrough) && !seen[day.date]) {
        result.push({ date: day.date, noteZh: day.noteZh, noteEn: day.noteEn, items: day.items, hasDated: true }); seen[day.date] = true;
      }
    }
    if (array(course.weeklyItems) && course.weeklyItems.length) {
      var currentDay = today(), monday = shiftDate(currentDay, -((weekday(currentDay) + 6) % 7));
      for (i = 0; i < 7; i++) {
        var date = shiftDate(monday, i);
        if (!seen[date]) { result.push({ date: date, items: [], hasDated: false }); seen[date] = true; }
      }
    }
    result.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    return result;
  }
  function mergedSchedule(day) {
    var result = day.items.slice(0), recurring = data.schedule.weeklyItems || [], dayNumber = weekday(day.date);
    for (var i = 0; i < recurring.length; i++) {
      var item = recurring[i];
      if ((item.startDate && day.date < item.startDate) || (item.endDate && day.date > item.endDate)) { continue; }
      for (var j = 0; j < item.weekdays.length; j++) {
        if (Number(item.weekdays[j]) === dayNumber) { result.push(item); break; }
      }
    }
    var periods = { morning: '00:00', afternoon: '12:00', evening: '18:00' };
    result.sort(function (a, b) { var first = a.start || periods[a.period] || '', second = b.start || periods[b.period] || ''; return first < second ? -1 : first > second ? 1 : 0; });
    return result;
  }
  function itemRow(target, rawItem, timed, viewDate) {
    var item = typeof rawItem === 'string' ? { text: rawItem } : rawItem;
    if (!item || !localized(item, false)) { return; }
    var recurring = !timed && array(item.weekdays), done = recurring ? item.done === true && item.doneDate === (viewDate || today()) : item.done;
    var row = node('div', 'row' + (done ? ' done' : '')), content = node('div', 'entry');
    var time = item.start ? item.start + (item.end ? ' – ' + item.end : '') : '';
    if (timed && item.period) { time = en ? { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }[item.period] : { morning: '上午', afternoon: '下午', evening: '晚上' }[item.period]; }
    var lead = node('span', timed ? 'time' : 'mark', timed ? time : done ? '✓' : '□');
    if (!timed) { lead.setAttribute('aria-label', done ? (en ? 'Done' : '已完成') : (en ? 'To do' : '待办')); }
    row.appendChild(lead);
    var fullText = !timed && (en ? item.fullTextEn : item.fullText);
    var title = node('div', 'entry-title', fullText || localized(item, false));
    if (item.example) { title.appendChild(node('span', 'sample', en ? 'Sample' : '示例')); }
    content.appendChild(title);
    if (!fullText && localized(item, true)) { content.appendChild(node('div', 'detail', localized(item, true))); }
    if (!timed) {
      var note = en ? item.noteEn || item.note : item.note;
      if (note) { content.appendChild(node('div', 'detail', note)); }
    }
    row.appendChild(content); target.appendChild(row);
  }
  function weekSchedule(target) {
    var course = data.schedule, days = dates(), chosen = null, i, weeks = [], seenWeeks = {};

    if (course.validFrom && course.validThrough) { target.appendChild(node('p', 'scope', (en ? 'Tutoring timetable: ' : '辅导课表：') + course.validFrom + ' — ' + course.validThrough)); }
    if (!days.length) { empty(target, en ? 'No schedule added yet.' : '尚未添加课表。'); return; }
    for (i = 0; i < days.length; i++) {
      var monday = shiftDate(days[i].date, -((weekday(days[i].date) + 6) % 7));
      if (!seenWeeks[monday]) { weeks.push(monday); seenWeeks[monday] = true; }
    }
    var validDate = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate) && shiftDate(selectedDate, 0) === selectedDate;
    var selectedMonday = validDate ? shiftDate(selectedDate, -((weekday(selectedDate) + 6) % 7)) : '';
    if (!seenWeeks[selectedMonday]) {
      var currentDate = today(), currentMonday = shiftDate(currentDate, -((weekday(currentDate) + 6) % 7));
      selectedDate = seenWeeks[currentMonday] ? currentDate : days[0].date;
      selectedMonday = shiftDate(selectedDate, -((weekday(selectedDate) + 6) % 7));
    }
    for (i = 0; i < days.length; i++) { if (days[i].date === selectedDate) { chosen = days[i]; } }
    chosen = chosen || { date: selectedDate, items: [], hasDated: false };
    function selectDay(date) { return function () { selectedDate = date; render(); }; }
    if (weeks.length > 1) {
      var weekNav = node('div', 'week-nav'), weekIndex = 0, dayOffset = (weekday(selectedDate) + 6) % 7;
      for (i = 0; i < weeks.length; i++) { if (weeks[i] === selectedMonday) { weekIndex = i; break; } }
      if (weekIndex > 0) {
        var previous = node('button', 'week-prev', en ? 'Previous week' : '前一周'); previous.type = 'button';
        previous.onclick = selectDay(shiftDate(weeks[weekIndex - 1], dayOffset)); weekNav.appendChild(previous);
      }
      if (weekIndex < weeks.length - 1) {
        var next = node('button', 'week-next', en ? 'Next week' : '后一周'); next.type = 'button';
        next.onclick = selectDay(shiftDate(weeks[weekIndex + 1], dayOffset)); weekNav.appendChild(next);
      }
      target.appendChild(weekNav);
    }
    var dayNav = node('div', 'week-days'); dayNav.setAttribute('role', 'group');
    dayNav.setAttribute('aria-label', en ? 'Monday to Sunday' : '周一至周日');
    for (i = 0; i < 7; i++) {
      var date = shiftDate(selectedMonday, i), cell = node('div'), button = node('button', date === selectedDate ? 'selected' : '', String(i + 1));
      button.type = 'button'; button.setAttribute('aria-label', dateLabel(date));
      button.setAttribute('aria-pressed', date === selectedDate ? 'true' : 'false');
      button.onclick = selectDay(date); cell.appendChild(button); dayNav.appendChild(cell);
    }
    target.appendChild(dayNav); target.appendChild(node('p', 'selected-date', dateLabel(selectedDate)));
    var note = en ? chosen.noteEn || chosen.noteZh : chosen.noteZh;
    if (note) { target.appendChild(node('p', 'day-note', note)); }
    if (!chosen.hasDated) { target.appendChild(node('p', 'scope', en ? 'Tutoring timetable not provided yet.' : '辅导课表待提供。')); }
    var items = mergedSchedule(chosen);
    var list = node('div', 'list');
    for (i = 0; i < items.length; i++) { itemRow(list, items[i], true); }
    if (!items.length && chosen.hasDated) { empty(list, en ? 'No activities for this date.' : '这一天尚未添加安排。'); }
    target.appendChild(list);
  }
  function homeSource() {
    var board = data.household;
    if (board.family && typeof board.family === 'object') { return board.family; }
    for (var i = 0; i < (board.pages || []).length; i++) { if (board.pages[i].id === 'family') { return board.pages[i]; } }
    return { reminders: [], items: [] };
  }
  function householdList(target) {
    var source = homeSource(), groups = [
      { title: en ? 'Reminders' : '备忘', items: source.reminders || [] },
      { title: en ? 'Cleaning' : '清洁', items: [] },
      { title: en ? 'Bed linen' : '换床单', items: [] },
      { title: en ? 'Other' : '其他', items: [] }
    ];
    for (var t = 0; t < (source.items || []).length; t++) {
      var task = source.items[t], slot = task.group === 'cleaning' ? 1 : task.group === 'linen' ? 2 : 3;
      groups[slot].items.push(task);
    }

    var currentDate = today(), monday = shiftDate(currentDate, -((weekday(currentDate) + 6) % 7)), sunday = shiftDate(monday, 6);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) || shiftDate(selectedDate, 0) !== selectedDate || selectedDate < monday || selectedDate > sunday) { selectedDate = currentDate; }
    function selectDay(date) { return function () { selectedDate = date; render(); }; }
    var dayNav = node('div', 'week-days'); dayNav.setAttribute('role', 'group'); dayNav.setAttribute('aria-label', en ? 'Monday to Sunday' : '周一至周日');
    for (var d = 0; d < 7; d++) {
      var date = shiftDate(monday, d), cell = node('div'), button = node('button', date === selectedDate ? 'selected' : '', String(d + 1));
      button.type = 'button'; button.setAttribute('aria-label', dateLabel(date)); button.setAttribute('aria-pressed', date === selectedDate ? 'true' : 'false');
      button.onclick = selectDay(date); cell.appendChild(button); dayNav.appendChild(cell);
    }
    target.appendChild(dayNav); target.appendChild(node('p', 'selected-date', dateLabel(selectedDate)));
    var total = 0, dayContent = node('div', 'household-day');
    for (var i = 0; i < groups.length; i++) {
      var list = node('div', 'list');
      for (var j = 0; j < groups[i].items.length; j++) {
        var item = groups[i].items[j];
        if ((item.date && item.date !== selectedDate) || (item.startDate && selectedDate < item.startDate) || (item.endDate && selectedDate > item.endDate)) { continue; }
        if (array(item.weekdays)) {
          var matches = false;
          for (var w = 0; w < item.weekdays.length; w++) { if (item.weekdays[w] === weekday(selectedDate)) { matches = true; break; } }
          if (!matches) { continue; }
        }
        itemRow(list, item, false, selectedDate);
      }
      if (list.firstChild) { dayContent.appendChild(node('h3', '', groups[i].title)); dayContent.appendChild(list); total++; }
    }
    if (!total) { empty(dayContent, en ? 'No tasks for this day' : '没有待办事项'); }
    target.appendChild(dayContent);
    householdReference(target);
  }
  function householdReference(target) {
    var reference = node('div', 'household-reference');
    if (!data.reference) {
      if (errors.reference) { empty(reference, en ? 'Routine information could not be loaded.' : '常规资料读取失败。'); }
      target.appendChild(reference); return;
    }
    var sections = data.reference.sections;
    for (var i = 0; i < sections.length; i++) {
      var group = sections[i], matches = !array(group.weekdays);
      for (var w = 0; w < (group.weekdays || []).length; w++) { if (group.weekdays[w] === weekday(selectedDate)) { matches = true; } }
      if (!matches) { continue; }
      var box = node('section', 'reference-group'), button = node('button', 'reference-toggle', (en ? group.titleEn : group.title) + (openReference[group.id] ? ' −' : ' +'));
      button.type = 'button'; button.setAttribute('aria-expanded', openReference[group.id] ? 'true' : 'false');
      button.onclick = (function (id) { return function () { openReference[id] = !openReference[id]; render(); }; }(group.id));
      box.appendChild(button);
      if (openReference[group.id]) {
        var list = node('div', 'list');
        for (var j = 0; j < group.items.length; j++) { itemRow(list, group.items[j], false, selectedDate); }
        box.appendChild(list);
      }
      reference.appendChild(box);
    }
    target.appendChild(reference);
  }
  function render() {
    var target = el('content'); clear(target);
    if (!data[section]) { empty(target, errors[section] ? (en ? 'Could not load this information.' : '资料读取失败。') : (en ? 'Loading information…' : '正在读取资料…')); }
    else if (section === 'breakfasts') { breakfastList(target); }
    else if (section === 'schedule') { weekSchedule(target); }
    else { householdList(target); }
    shell();
  }
  function valid(key, value) {
    if (!value || typeof value !== 'object') { return false; }
    var entries, i, j;
    if (key === 'reference') {
      if (!array(value.sections)) { return false; }
      for (i = 0; i < value.sections.length; i++) {
        var group = value.sections[i]; if (!group || typeof group.id !== 'string' || typeof group.title !== 'string' || !array(group.items)) { return false; }
        for (j = 0; j < group.items.length; j++) { if (!group.items[j] || typeof group.items[j].text !== 'string') { return false; } }
      }
      return true;
    }
    if (key === 'breakfasts') {
      if (!array(value.items)) { return false; }
      for (i = 0; i < value.items.length; i++) { if (!value.items[i] || typeof value.items[i].text !== 'string') { return false; } }
      if (typeof value.drinks !== 'undefined') {
        if (!array(value.drinks)) { return false; }
        for (i = 0; i < value.drinks.length; i++) {
          var drink = value.drinks[i];
          if (!drink || typeof drink.text !== 'string' || !array(drink.weekdays) || !drink.weekdays.length) { return false; }
          for (j = 0; j < drink.weekdays.length; j++) {
            var day = drink.weekdays[j];
            if (typeof day !== 'number' || day < 0 || day > 6 || day % 1 !== 0) { return false; }
          }
        }
      }
      return true;
    }
    if (key === 'schedule') {
      if (!array(value.days)) { return false; }
      for (i = 0; i < value.days.length; i++) {
        if (!value.days[i] || !/^\d{4}-\d{2}-\d{2}$/.test(value.days[i].date) || !array(value.days[i].items)) { return false; }
        entries = value.days[i].items;
        for (j = 0; j < entries.length; j++) { if (!entries[j] || typeof entries[j].text !== 'string') { return false; } }
      }
      if (typeof value.weeklyItems !== 'undefined') {
        if (!array(value.weeklyItems)) { return false; }
        for (i = 0; i < value.weeklyItems.length; i++) {
          if (!value.weeklyItems[i] || typeof value.weeklyItems[i].text !== 'string' || !array(value.weeklyItems[i].weekdays)) { return false; }
        }
      }
      return true;
    }
    entries = value.family ? [value.family] : value.pages;
    if (!array(entries)) { return false; }
    for (i = 0; i < entries.length; i++) {
      if (!entries[i] || (entries[i].items && !array(entries[i].items)) || (entries[i].reminders && !array(entries[i].reminders))) { return false; }
      var tasks = (entries[i].items || []).concat(entries[i].reminders || []);
      for (j = 0; j < tasks.length; j++) {
        var task = tasks[j];
        if (!task || typeof task.text !== 'string') { return false; }
        if (typeof task.weekdays !== 'undefined') {
          if (!array(task.weekdays) || !task.weekdays.length) { return false; }
          for (var d = 0; d < task.weekdays.length; d++) { if (typeof task.weekdays[d] !== 'number' || task.weekdays[d] < 0 || task.weekdays[d] > 6 || task.weekdays[d] % 1 !== 0) { return false; } }
        }
      }
    }
    return true;
  }
  function request(key) {
    if (pending[key]) { return; }
    pending[key] = true;
    var xhr = new XMLHttpRequest(), finished = false, timeout = null;
    function finish(ok) {
      if (finished) { return; }
      finished = true; clearTimeout(timeout); pending[key] = false; errors[key] = !ok;
      if (section === key || (key === 'reference' && section === 'household')) { render(); } else { shell(); }
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || finished) { return; }
      if (xhr.status === 200) {
        try {
          var value = JSON.parse(xhr.responseText);
          if (!valid(key, value)) { finish(false); return; }
          data[key] = value; finish(true);
        } catch (error) { finish(false); }
      } else { finish(false); }
    };
    try {
      xhr.open('GET', files[key] + '?_=' + new Date().getTime(), true);
      timeout = setTimeout(function () { finish(false); try { xhr.abort(); } catch (error) {} }, 12000);
      xhr.send(null);
    } catch (error) { finish(false); }
  }
  function selectSection(key) { section = key; selectedDate = today(); mealPage = 0; render(); }
  el('section-breakfasts').onclick = function () { selectSection('breakfasts'); };
  el('section-schedule').onclick = function () { selectSection('schedule'); };
  el('section-household').onclick = function () { selectSection('household'); };
  el('retry').onclick = function () {
    for (var key in files) { if (Object.prototype.hasOwnProperty.call(files, key) && errors[key]) { request(key); } }
  };
  window.onpageshow = function (event) {
    if (event && event.persisted) { selectedDate = today(); mealPage = 0; render(); }
  };
  render();
  request('breakfasts'); request('schedule'); request('household'); request('reference');
}());
