'use strict';
(() => {
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=value=>String(value).padStart(2,'0');
  const dayKey=(year,month,day)=>`${year}-${pad(month+1)}-${pad(day)}`;
  const hongKongToday=()=>{
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const value=type=>Number(parts.find(part=>part.type===type)?.value);
    return {year:value('year'),month:value('month')-1,day:value('day')};
  };
  const initial=hongKongToday();
  let viewYear=initial.year,viewMonth=initial.month;
  const wired=new WeakSet();
  const weekdays=['一','二','三','四','五','六','日'];
  const validDate=value=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value??''))return false;
    const [year,month,day]=value.split('-').map(Number);
    const parsed=new Date(Date.UTC(year,month-1,day));
    return parsed.getUTCFullYear()===year&&parsed.getUTCMonth()===month-1&&parsed.getUTCDate()===day;
  };
  const schoolFor=id=>(window.SCHOOL_DATA??[]).find(school=>school.id===id);
  const shortNames={north05:'于良发',sz01:'深圳培侨',tp04:'大埔旧墟',tp01:'宝湖道',north03:'嘉福荣真',sz02:'南山中英文',north06:'马锦灿',north04:'靳茂生',north07:'上水惠州','hk-extra02':'曾梅千禧'};
  const schoolButton=school=>`<button type="button" class="calendar-school" data-detail="${esc(school.id)}" title="${esc(school.name)}" aria-label="查看${esc(school.name)}详情"><span class="calendar-school-number">${pad(school.schoolNumber)}</span>${esc(shortNames[school.id]||school.name)}</button>`;
  function eventCard(event){
    const school=schoolFor(event.schoolId);
    if(!school)return '';
    const notice=event.kind==='notice';
    const schedule=!notice&&event.certainty!=='personal';
    const scheduled=event.kind==='exam'&&['personal','registered','teacher_notice'].includes(event.certainty)&&Boolean(window.schoolNotebook?.hasExamNotice(school));
    const tone=notice?'notice':scheduled?'scheduled':'schedule';
    const note=event.summary??event.note??(schedule?'资格待确认':'');
    const time=event.displayTime??event.time;
    return `<article class="calendar-event calendar-event-${tone}">${schoolButton(school)}<div class="calendar-event-main">${time?`<span class="calendar-event-time">${esc(time)}</span>`:''}<strong>${esc(event.label||(event.kind==='interview'?'面试':notice?'通知':'笔试'))}</strong></div>${note?`<p class="calendar-event-note">${esc(note)}</p>`:''}</article>`;
  }
  function render(){
    const root=document.getElementById('exam-calendar');
    if(!root)return;
    const data=window.SCHOOL_CALENDAR_DATA??{};
    const prefix=`${viewYear}-${pad(viewMonth+1)}-`;
    const events=(Array.isArray(data.events)?data.events:[])
      .filter(event=>validDate(event.date)&&event.date.startsWith(prefix)&&schoolFor(event.schoolId))
      .sort((a,b)=>a.date.localeCompare(b.date)||String(a.time??'').localeCompare(String(b.time??''))||schoolFor(a.schoolId).schoolNumber-schoolFor(b.schoolId).schoolNumber);
    const byDate=new Map();
    for(const event of events){if(!byDate.has(event.date))byDate.set(event.date,[]);byDate.get(event.date).push(event);}
    const today=hongKongToday();
    const todayKey=dayKey(today.year,today.month,today.day);
    const days=new Date(Date.UTC(viewYear,viewMonth+1,0)).getUTCDate();
    const offset=(new Date(Date.UTC(viewYear,viewMonth,1)).getUTCDay()+6)%7;
    const cellCount=Math.ceil((offset+days)/7)*7;
    let grid='';
    for(let week=0;week<cellCount/7;week++){
      let cells='';
      for(let weekday=0;weekday<7;weekday++){
        const day=week*7+weekday-offset+1;
        if(day<1||day>days){cells+='<div class="calendar-day calendar-day-outside" role="cell" aria-hidden="true"></div>';continue;}
        const key=dayKey(viewYear,viewMonth,day),items=byDate.get(key)??[];
        cells+=`<section class="calendar-day${items.length?' calendar-day-has-events':' calendar-day-empty'}${key===todayKey?' calendar-day-today':''}" role="cell" aria-label="${viewMonth+1}月${day}日，星期${weekdays[weekday]}"><h3 class="calendar-date"><time datetime="${key}"${key===todayKey?' aria-current="date"':''}><span class="calendar-date-day">${day}</span><span class="calendar-date-long">${viewMonth+1}月${day}日（周${weekdays[weekday]}）</span></time>${key===todayKey?'<span class="calendar-today-label">今天</span>':''}</h3><div class="calendar-day-events">${items.map(eventCard).join('')}</div></section>`;
      }
      grid+=`<div class="calendar-week" role="row">${cells}</div>`;
    }
    const pending=(Array.isArray(data.pending)?data.pending:[]).filter(item=>schoolFor(item.schoolId)&&item.text);
    root.innerHTML=`<div class="calendar-toolbar"><h2 id="calendar-month-title" aria-live="polite">${viewYear}年${viewMonth+1}月</h2><div class="calendar-controls"><button type="button" data-calendar-action="previous" aria-label="上个月">‹ 上月</button><button type="button" data-calendar-action="today">本月</button><button type="button" data-calendar-action="next" aria-label="下个月">下月 ›</button><button type="button" data-calendar-action="print" class="calendar-print">打印日历</button></div></div><div class="calendar-legend"><span class="calendar-legend-scheduled">已通知 / 可直接参加</span><span class="calendar-legend-schedule">学校排期 · 资格待确认</span><span class="calendar-legend-notice">通知 / 查询</span></div><div class="calendar-grid" role="table" aria-labelledby="calendar-month-title"><div class="calendar-weekdays" role="row">${weekdays.map(day=>`<div role="columnheader">周${day}</div>`).join('')}</div>${grid}</div>${events.length?'':'<p class="calendar-no-events">本月暂无已记录的考试或通知。</p>'}${pending.length?`<details class="calendar-pending"><summary>日期待定 <span>${pending.length}</span></summary><ul>${pending.map(item=>`<li>${schoolButton(schoolFor(item.schoolId))}<span>${esc(item.summary??item.text)}</span></li>`).join('')}</ul></details>`:''}`;
    if(!wired.has(root)){
      wired.add(root);
      root.addEventListener('click',event=>{
        const control=event.target.closest('[data-calendar-action]');
        if(!control||!root.contains(control))return;
        const action=control.dataset.calendarAction;
        if(action==='print'){window.print();return;}
        if(action==='today'){const now=hongKongToday();viewYear=now.year;viewMonth=now.month;}
        else if(action==='previous'||action==='next'){
          const changed=new Date(Date.UTC(viewYear,viewMonth+(action==='next'?1:-1),1));
          viewYear=changed.getUTCFullYear();viewMonth=changed.getUTCMonth();
        }else return;
        render();
        root.querySelector(`[data-calendar-action="${action}"]`)?.focus({preventScroll:true});
      });
    }
  }
  window.schoolCalendar={render};
})();
