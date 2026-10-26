(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  function text(target, value) {
    var property = 'textContent' in target ? 'textContent' : 'innerText';
    if (target[property] !== value) { target[property] = value; }
  }
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
  function visible(target, show) { target.style.display = show ? '' : 'none'; target.className = target.className.replace(/\s*hidden/g, ''); }
  function clear(target) { while (target.firstChild) { target.removeChild(target.firstChild); } }
  function pad(value) { return ('0' + value).slice(-2); }
  function shanghaiNow() { return new Date(new Date().getTime() + 8 * 3600000); }
  function today() {
    var now = shanghaiNow();
    return now.getUTCFullYear() + '-' + pad(now.getUTCMonth() + 1) + '-' + pad(now.getUTCDate());
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
  var views = [], current = 0, playing = true, timer = null, lastControl = null;
  var touched = false, synced = false, errors = {}, payloads = {}, currentDay = today(), selectedDay = shiftDate(currentDay, 1), followDefault = true;
  var topLineKey = null, photoCropKey = null, photoFailed = false;
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
      var page = data.pages[i], entries = entriesFor(page), size = isChild(page) ? 6 : 4;
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
  function pause() { touched = true; playing = false; stop(); }
  function select(id, chunk) {
    pause(); rebuild(id, chunk || 0); render();
  }
  function selected(button, active) {
    button.className = active ? 'selected' : '';
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
  function weatherTime(value) {
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || '');
    return match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4] - 8, +match[5]) : NaN;
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
    var showWeather = typeof weather.temperatureC === 'number' && isFinite(weather.temperatureC) && isFinite(age) && age <= 3 * 3600000 && age >= -3600000;
    var condition = (weather.condition || '') + ' ' + (weather.conditionEn || ''), icon = 'cloud';
    var weatherLabel = en ? weather.conditionEn || weather.condition : weather.condition;
    if (/雷|Thunder/i.test(condition)) { icon = 'cloud-lightning'; }
    else if (/雪|Snow/i.test(condition)) { icon = 'snowflake'; }
    else if (/雨|Rain|Drizzle/i.test(condition)) { icon = 'cloud-rain'; }
    else if (/多云|Partly/i.test(condition)) { icon = 'cloud-sun'; }
    else if (/晴|Clear/i.test(condition)) { icon = 'sun'; }
    var key = JSON.stringify([value, !!en, lunarLabel, suitable, showWeather ? [icon, weatherLabel, Math.round(weather.temperatureC)] : null]);
    // Polling still checks freshness, but unchanged content should not repaint the e-ink header.
    if (key === topLineKey) { return; }
    topLineKey = key;
    text(el('lunar-text'), lunarLabel);
    text(el('almanac-line'), suitable ? (lunarLabel ? ' · ' : '') + suitable : '');
    el('lunar-line').setAttribute('title', lunarLabel + (suitable ? (lunarLabel ? ' · ' : '') + suitable : ''));
    visible(el('almanac-line'), !!suitable); visible(el('lunar-line'), true);
    text(el('top-line'), value);
    var weatherLine = el('weather-line'); clear(weatherLine); visible(weatherLine, false);
    if (showWeather) {
      var picture = node('img', 'weather-icon'); picture.src = 'images/weather/' + icon + '.svg'; picture.alt = weatherLabel;
      picture.onerror = function () { this.style.display = 'none'; topLineKey = null; };
      visible(weatherLine, true); weatherLine.appendChild(picture);
      weatherLine.appendChild(node('span', '', ' ' + Math.round(weather.temperatureC) + '°C'));
      weatherLine.setAttribute('aria-label', weatherLabel + ' ' + Math.round(weather.temperatureC) + '°C');
    }
  }
  function addRow(target, item, en, timed, concise) {
    var row = node('div', 'row' + (item.done ? ' done' : '')), content = node('div', 'entry');
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
    text(el('breakfast-text'), name || (en ? 'Not planned yet' : '待安排'));
    visible(el('breakfast-visual'), !!(recipe && recipe.image));
    if (recipe && recipe.image) {
      var photo = el('breakfast-photo'), visual = el('breakfast-visual'), cropBox = el('breakfast-crop'), crop = recipe.crop;
      var sourceChanged = photo.getAttribute('src') !== recipe.image;
      var cropKey = JSON.stringify(crop || null);
      photo.alt = name;
      photo.onerror = function () { photoFailed = true; visible(visual, false); };
      var fitCrop = function (sw, x, y, width, height) {
        var scale = Math.min(1 / width, 0.5 / height);
        cropBox.style.width = (width * scale * 100) + '%'; cropBox.style.paddingBottom = (height * scale * 100) + '%';
        cropBox.style.left = ((1 - width * scale) * 50) + '%'; cropBox.style.marginTop = ((0.5 - height * scale) * 50) + '%';
        photo.style.width = (sw / width * 100) + '%'; photo.style.left = (-x / width * 100) + '%'; photo.style.marginTop = (-y / width * 100) + '%'; photo.style.top = '0';
      };
      if (sourceChanged || cropKey !== photoCropKey) {
        photoCropKey = cropKey;
        visual.className = 'breakfast-visual cropped'; visual.style.paddingBottom = '50%';
        photo.onload = null;
        if (crop && crop.sourceWidth > 0 && crop.sourceHeight > 0 && crop.width > 0 && crop.height > 0 && crop.x >= 0 && crop.y >= 0 && crop.x + crop.width <= crop.sourceWidth && crop.y + crop.height <= crop.sourceHeight) {
          fitCrop(crop.sourceWidth, crop.x, crop.y, crop.width, crop.height);
        } else {
          cropBox.style.width = '100%'; cropBox.style.paddingBottom = '50%'; cropBox.style.left = '0'; cropBox.style.marginTop = '0';
          photo.style.width = '100%'; photo.style.left = '0'; photo.style.marginTop = '0'; photo.style.top = '0';
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
  function renderTasks(view, en) {
    var target = el('entries'); target.className = 'task-handwriting';
    for (var i = 0; i < view.entries.length; i++) { addRow(target, view.entries[i].item, en, false, true); }
    if (!view.entries.length) { target.appendChild(node('p', 'empty', en ? 'No tasks for today' : '今天没有待办事项')); }
  }
  function renderChild(view, en) {
    var target = el('entries'), plan = dayPlan(), source = view.page.sourceId ? pageById(view.page.sourceId) : view.page;
    var dateBits = selectedDay.split('-'), dateValue = new Date(Date.UTC(+dateBits[0], +dateBits[1] - 1, +dateBits[2]));
    var label = en ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateValue.getUTCDay()] : '周' + '日一二三四五六'.charAt(dateValue.getUTCDay());
    var context = selectedDay === shiftDate(currentDay, 1) ? (en ? 'Tomorrow’s schedule' : '明日课表') : selectedDay === currentDay ? (en ? 'Today’s schedule' : '今日课表') : (en ? 'Schedule' : '课表');
    text(el('day-context'), context);
    text(el('heading'), label);
    text(el('day-prev'), en ? 'Prev day' : '前一天'); text(el('day-next'), en ? 'Next day' : '后一天');
    el('day-today').setAttribute('aria-label', selectedDay + ' ' + label + (en ? ', back to tomorrow' : '，回到明天'));
    el('day-today').setAttribute('title', en ? 'Back to tomorrow' : '回到明天');
    el('day-nav').setAttribute('aria-label', en ? 'Choose a date' : '查看日期');
    selected(el('day-today'), selectedDay === shiftDate(currentDay, 1));
    visible(el('day-note'), !!(plan && (plan.noteZh || plan.noteEn)));
    if (plan) { text(el('day-note'), en ? plan.noteEn || plan.noteZh : plan.noteZh); }
    visible(el('scope'), false);
    if (!plan) {
      target.appendChild(node('p', 'missing', en ? 'No timetable has been provided for this date.' : '这一天尚未收到课表。'));
    } else {
      target.className = 'list';
      for (var i = 0; i < view.entries.length; i++) { addRow(target, view.entries[i], en, true); }
      if (!plan.items.length) { target.appendChild(node('p', 'empty', en ? 'No activities scheduled' : '没有安排活动')); }
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
  function render() {
    var view = views[current], en = english(), child = isChild(view.page), tasks = isTasks(view.page), target = el('entries');
    el('page').className = child ? '' : tasks ? 'tasks-page' : 'breakfast-page';
    document.documentElement.lang = en ? 'en' : 'zh-CN';
    text(el('home'), en ? 'Breakfast' : '早餐'); text(el('tasks'), en ? 'Tasks' : '待办'); text(el('child'), en ? 'Child' : '孩子');
    selected(el('home'), !child && !tasks); selected(el('tasks'), tasks); selected(el('child'), child); selected(el('zh'), !en); selected(el('en'), en);
    topLine(); text(el('heading'), view.page.title || (en ? 'Home today' : '家庭安排'));
    text(el('part'), view.count > 1 ? (view.chunk + 1) + ' / ' + view.count : '');
    visible(el('day-nav'), child); visible(el('breakfast'), !child && !tasks);
    visible(el('day-note'), false); visible(el('scope'), false); visible(el('bring'), false);
    clear(target); target.className = ''; visible(target, child || tasks);
    visible(el('more-items'), view.count > 1);
    text(el('more-items'), child ? (en ? 'More activities' : '更多安排') : (en ? 'More tasks' : '更多任务'));
    if (child) { renderChild(view, en); } else if (tasks) { renderTasks(view, en); } else { renderFamily(view, en); }
    text(el('all-data'), en ? 'All info' : '全部资料');
    el('all-data').setAttribute('href', 'all.html?lang=' + (en ? 'en' : 'zh') + '&section=' + (child ? 'schedule' : tasks ? 'household' : 'breakfasts'));
    var demo = data.demo || view.page.demo;
    visible(el('demo-note'), !!demo);
    text(el('demo-note'), demo ? (en ? 'Sample content' : '示例内容') : '');
    text(el('play'), en ? (playing ? 'Stop auto switch' : 'Start auto switch') : (playing ? '停止轮播' : '开启轮播'));
    renderErrors();
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
      if (!/^\d{4}-\d{2}-\d{2}$/.test(rotation.startDate || '') || !array(rotation.mealIds) || !rotation.mealIds.length) { return false; }
      if (typeof BreakfastPlanner === 'undefined' || !BreakfastPlanner.mealForDate(rotation.startDate, rotation)) { return false; }
      for (var m = 0; m < rotation.mealIds.length; m++) { if (typeof rotation.mealIds[m] !== 'string') { return false; } }
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
  function applyBoard(next, initialLoad) {
    if (!validBoard(next)) { return false; }
    var old = views[current], previousInterval = interval(), cv = String((next.settings || {}).controlVersion || 0);
    var changeControl = initialLoad || (synced ? cv !== lastControl : !touched);
    data = next; data.settings = data.settings || {};
    rebuild(old ? old.page.id : 'family', old ? old.chunk : 0);
    if (changeControl) {
      currentDay = today(); selectedDay = shiftDate(currentDay, 1); followDefault = true;
      playing = data.settings.autoRotate !== false;
      var id = data.settings.showPage;
      if (id === 'helper') { id = 'family'; } else if (id === 'helper_en') { id = 'family_en'; }
      if (id && pageById(id)) { rebuild(id, 0); } else { rebuild(views[current].page.id, views[current].chunk); }
    }
    lastControl = cv;
    render();
    if (timer === null || changeControl || previousInterval !== interval()) { schedule(); }
    return true;
  }
  function pollJson(path, delay, key, accept) {
    if (location.protocol === 'file:') { return; }
    var xhr = new XMLHttpRequest(), finished = false, timeout;
    function finish(ok) {
      if (finished) { return; }
      finished = true; clearTimeout(timeout); errors[key] = !ok; topLine(); renderErrors();
      setTimeout(function () { pollJson(path, delay, key, accept); }, delay);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || finished) { return; }
      if (xhr.status !== 200) { finish(false); return; }
      try {
        var next = JSON.parse(xhr.responseText), signature = JSON.stringify(next);
        if (payloads[key] === signature) { finish(true); return; }
        var ok = accept(next) !== false;
        if (ok) { payloads[key] = signature; }
        finish(ok);
      } catch (error) { finish(false); }
    };
    try {
      xhr.open('GET', path + '?_=' + new Date().getTime(), true);
      timeout = setTimeout(function () { finish(false); try { xhr.abort(); } catch (error) {} }, 12000);
      xhr.send(null);
    } catch (error) { finish(false); }
  }
  el('home').onclick = function () { select(english() ? 'family_en' : 'family'); };
  el('tasks').onclick = function () { select(english() ? 'tasks_en' : 'tasks'); };
  el('child').onclick = function () {
    currentDay = today(); selectedDay = shiftDate(currentDay, 1); followDefault = true;
    select(english() ? 'child_en' : 'child');
  };
  el('zh').onclick = function () { select(isChild(views[current].page) ? 'child' : isTasks(views[current].page) ? 'tasks' : 'family', views[current].chunk); };
  el('en').onclick = function () { select(isChild(views[current].page) ? 'child_en' : isTasks(views[current].page) ? 'tasks_en' : 'family_en', views[current].chunk); };
  el('play').onclick = function () {
    touched = true; playing = !playing;
    if (playing) {
      var old = views[current]; currentDay = today(); selectedDay = shiftDate(currentDay, 1); followDefault = true; rebuild(old.page.id, 0);
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
    pause(); currentDay = today(); selectedDay = reset ? shiftDate(currentDay, 1) : shiftDate(selectedDay, offset); followDefault = selectedDay === shiftDate(currentDay, 1);
    rebuild(views[current].page.id, 0); render();
  }
  el('day-prev').onclick = function () { chooseDate(-1, false); };
  el('day-next').onclick = function () { chooseDate(1, false); };
  el('day-today').onclick = function () { chooseDate(0, true); };
  function tick() {
    var now = today();
    if (now !== currentDay) {
      var old = views[current]; currentDay = now;
      if (followDefault) { selectedDay = shiftDate(currentDay, 1); }
      rebuild(old.page.id, old.chunk); render();
    } else { topLine(); if (!isChild(views[current].page) && !isTasks(views[current].page)) { breakfast(english()); } }
    setTimeout(tick, 60000);
  }
  window.onpageshow = function (event) {
    if (event && event.persisted) {
      currentDay = today(); selectedDay = shiftDate(currentDay, 1); followDefault = true;
      rebuild(views[current].page.id, 0); render();
    }
  };
  applyBoard(data, true);
  var hashPage = (location.hash || '').replace(/^#/, '');
  if (pageById(hashPage)) { select(hashPage); }
  pollJson('board.json', 60000, 'board', function (next) { var ok = applyBoard(next, false); if (ok) { synced = true; } return ok; });
  pollJson('schedule.json', 60000, 'schedule', function (next) {
    if (!validSchedule(next)) { return false; }
    var old = views[current]; course = next; rebuild(old.page.id, old.chunk); render(); return true;
  });
  pollJson('weather.json', 600000, 'weather', function (next) {
    if (!next || typeof next.temperatureC !== 'number' || !isFinite(next.temperatureC) || !next.observedAt) { return false; }
    if (!isFinite(weatherTime(weather.observedAt)) || weatherTime(next.observedAt) >= weatherTime(weather.observedAt)) { weather = next; }
    return true;
  });
  pollJson('breakfasts.json', 60000, 'breakfasts', function (next) {
    if (!next || !array(next.items) || !validDrinks(next.drinks) || (typeof BreakfastPlanner !== 'undefined' && !BreakfastPlanner.validPorridgeRotation(next.porridgeRotation))) { return false; }
    for (var i = 0; i < next.items.length; i++) {
      var meal = next.items[i];
      if (!meal || typeof meal.id !== 'string' || typeof meal.text !== 'string' || (meal.image && !/^images\/breakfast\/[a-zA-Z0-9_.-]+\.(jpg|jpeg|png|webp)$/.test(meal.image))) { return false; }
    }
    menus = next; render(); return true;
  });
  pollJson('calendar.json', 86400000, 'calendar', function (next) {
    if (!next || !next.dates || !next.validFrom || !next.validThrough) { return false; }
    calendar = next; topLine(); return true;
  });
  pollJson('almanac.json', 86400000, 'almanac', function (next) {
    if (!next || !next.dates || !next.validFrom || !next.validThrough) { return false; }
    almanac = next; topLine(); return true;
  });
  pollJson('festivals.json', 86400000, 'festivals', function (next) {
    if (!validFestivals(next)) { return false; }
    festivals = next; topLine(); return true;
  });
  if (/(^|\.)github\.io$/.test(location.hostname || '') && typeof WeatherClient !== 'undefined') {
    WeatherClient.start({ onWeather: function (next) {
      if (!isFinite(weatherTime(weather.observedAt)) || weatherTime(next.observedAt) >= weatherTime(weather.observedAt)) { weather = next; topLine(); }
    } });
  }
  setTimeout(tick, 60000);
}());
