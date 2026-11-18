'use strict';
(() => {
  // Only active family applications are shown; all original records remain in the school tables.
  const schools = window.SCHOOL_DATA;
  const active = id => {
    const school = schools.find(item => item.id === id), plan = school?.plan;
    const conflict = plan?.assessmentConflict;
    return Boolean(school?.selected && !['不再申请', '本轮暂不推进', '本次不参加笔试', '暂缓报名'].includes(plan?.status)
      && !(conflict?.decisionResolved && conflict.selectedSchoolId && conflict.selectedSchoolId !== id));
  };
  const plan = id => schools.find(item => item.id === id)?.plan ?? {};
  const events = [
    { id: 'north05-assessment', schoolId: 'north05', date: plan('north05').assessmentDate, time: plan('north05').assessmentTime,
      label: '获邀笔试', kind: 'exam', certainty: 'personal', source: '老师转述个人通知',
      summary: '中英数（中数）· 2小时',
      note: '已确认参加；中英数（中数），共2小时。粉岭晖明路16号。' },
    { id: 'sz01-query-start', schoolId: 'sz01', date: '2026-11-26', time: '16:00',
      label: '查询开始', kind: 'notice', certainty: 'schedule', source: '官方安排',
      summary: '评估资格及场次 · 至12/4 23:59',
      note: '查询窗口至12月4日23:59；确认个人资格及场次。' },
    { id: 'sz01-query-end', schoolId: 'sz01', date: '2026-12-04', time: '23:59',
      label: '查询截止', kind: 'notice', certainty: 'schedule', source: '官方安排',
      summary: '评估资格及场次',
      note: '11月26日16:00起可查；当天不是考试。' },
    { id: 'sz01-assessment', schoolId: 'sz01', date: '2026-12-05', time: '全天预留',
      label: '评估', kind: 'exam', certainty: 'schedule', source: '官方安排',
      summary: '仅获邀 · 场次待定 · 重叠待核',
      note: '仅获邀者参加，个人场次待通知；与大埔旧墟同日，时段是否重叠待确认。' },
    { id: 'tp04-assessment', schoolId: 'tp04', date: plan('tp04').assessmentDate, time: '14:00–17:00',
      label: '笔试', kind: 'exam', certainty: 'schedule', source: '官方通告',
      summary: '资格待确认 · 同日重叠待核',
      note: '个人考试资格待确认；与深圳培侨同日，时段是否重叠待确认。' },
    { id: 'tp04-result-deadline', schoolId: 'tp04', date: plan('tp04').resultDate, time: '1月16日或之前',
      label: '书面结果', displayTime: '16日或之前', kind: 'notice', certainty: 'schedule', source: '官方通告；老师补充',
      summary: '取录与否均通知',
      note: '无论取录与否；可能提前通知。如有需要，笔试后面试，具体安排待通知。' },
    { id: 'north03-assessment', schoolId: 'north03', date: plan('north03').assessmentDate, time: '上午（老师告知）',
      label: '笔试', displayTime: '上午', kind: 'exam', certainty: 'schedule', source: '日期官方；时段老师告知',
      summary: '资格、时刻待通知',
      note: '准确时间待电邮通知；个人考试资格待确认。' },
    { id: 'sz02-assessment', schoolId: 'sz02', date: plan('sz02').assessmentDate, time: '时间待通知',
      label: '笔试', displayTime: '时间待定', kind: 'exam', certainty: 'schedule', source: '老师排期；中数由家长确认',
      summary: '英文/中数/语文 · 资格待确认',
      note: '英文、中数、语文；个人资格及地点待通知。面试日期另待通知。' },
    { id: 'north06-selection-notice', schoolId: 'north06', date: '2026-12-28', time: '12月28日前',
      label: '入选通知', displayTime: '28日前', kind: 'notice', certainty: 'schedule', source: '老师告知',
      summary: '通知方式待确认',
      note: '不是确定当天通知；老师称电话，既存官网称短信，通知方式待确认。' }
  ];
  const pending = [
    { schoolId: 'tp04', summary: '笔试后按需面试 · 日期、资格待通知', text: '如有需要，笔试后安排面试；日期、时间及个人资格待通知（老师补充；官方通告列按需要约见）。' },
    { schoolId: 'north06', summary: '2027年1月笔试 · 仅入选者，日期待定', text: '2027年1月笔试，具体日期待定；仅入选者。' },
    { schoolId: 'north04', summary: '测试待电话通知', text: '测试日期待电话通知（老师告知）。' },
    { schoolId: 'sz02', summary: '英文＋小组面试 · 日期待通知', text: '英文面试＋小组面试，日期、时间待通知。' },
    { schoolId: 'north07', summary: '待开放 · 暂无考试安排', text: '申请待开放，尚无本轮考试安排。' },
    { schoolId: 'hk-extra02', summary: '待开放 · 暂无考试安排', text: '申请待开放，尚无本轮考试安排。' }
  ];
  window.SCHOOL_CALENDAR_DATA = {
    events: events.filter(event => active(event.schoolId) && event.date).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
    pending: pending.filter(item => active(item.schoolId))
  };
})();
