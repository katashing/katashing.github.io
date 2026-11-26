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
      label: '已笔试', kind: 'exam', certainty: 'personal', source: '家长确认完成；日期时间保留老师原通知',
      completed: true,
      completionConfirmedOn: plan('north05').assessmentCompletionConfirmedOn,
      summary: '家长确认完成 · 日期为原排期',
      note: `11月23日家长确认已考完，日历保留原笔试排期。${plan('north05').resultText}` },
    { id: 'hk-extra02-invitation-notice', schoolId: 'hk-extra02', date: plan('hk-extra02').interviewNoticeDeadline, time: '12月2日或之前',
      label: '获邀联络', displayTime: '2日或之前', kind: 'notice', certainty: 'schedule', source: '2026/27学年下学期插班申请表',
      summary: '校方联络获邀家长', note: '校方会在12月2日（周三）或之前联络获邀家长。' },
    { id: 'hk-extra02-interview', schoolId: 'hk-extra02', date: plan('hk-extra02').interviewDate, time: '时段待通知',
      label: '插班面试', kind: 'interview', certainty: 'schedule', source: '2026/27学年下学期插班申请表',
      summary: '仅限获邀者', note: '12月5日（周六）插班面试，仅限获邀者，具体时段待校方通知。' },
    { id: 'sz01-assessment', schoolId: 'sz01', date: plan('sz01').assessmentDate, time: plan('sz01').assessmentTime,
      label: '获邀笔试', kind: 'exam', certainty: 'personal', source: plan('sz01').assessmentSource,
      summary: `报到 ${plan('sz01').assessmentCheckIn}`,
      note: '同日培侨09:30–12:15、大埔旧墟14:00–17:00，笔试时段错开。两场笔试之间有1小时45分，需核对跨境转场、大埔报到及培侨家长面谈时间。' },
    { id: 'tp04-assessment', schoolId: 'tp04', date: plan('tp04').assessmentDate, time: '14:00–17:00',
      label: '笔试', kind: 'exam', certainty: 'registered', source: '已报名；学校统一安排（老师确认递交，官方流程复核）',
      summary: '已报名 · 与培侨错开',
      note: '已报名，按学校统一安排参加笔试；准考证及报到方式待确认。同日培侨09:30–12:15、大埔旧墟14:00–17:00，笔试时段错开。两场笔试之间有1小时45分，需核对跨境转场、大埔报到及培侨家长面谈时间。' },
    { id: 'tp04-result-deadline', schoolId: 'tp04', date: plan('tp04').resultDate, time: '1月16日或之前',
      label: '书面结果', displayTime: '16日或之前', kind: 'notice', certainty: 'schedule', source: '官方通告；老师补充',
      summary: '取录与否均通知',
      note: '无论取录与否；可能提前通知。如有需要，笔试后面试，具体安排待通知。' },
    { id: 'north03-assessment', schoolId: 'north03', date: plan('north03').assessmentDate, time: '具体时间待校方电邮',
      label: '笔试', displayTime: '等电邮定时', kind: 'exam', certainty: 'schedule', source: '学校公布笔试日期；家长确认已报名',
      summary: '已报名 · 个人通知待收',
      note: '具体时间及报到安排待校方电邮，个人考试通知待收。' },
    { id: 'sz02-assessment', schoolId: 'sz02', date: plan('sz02').assessmentDate, time: '时间待通知',
      label: '笔试', displayTime: '等邮件定时', kind: 'exam', certainty: 'teacher_notice', source: '老师确认可参加及笔试日期；中数由家长确认',
      summary: '老师确认可笔试 · 英文/中数/语文',
      note: '已报名，老师确认可以参加笔试；具体考试时间等学校邮件通知，地点及面试安排待确认。' },
    { id: 'north06-selection-notice', schoolId: 'north06', date: '2026-12-28', time: '12月28日前',
      label: '入选通知', displayTime: '28日前', kind: 'notice', certainty: 'schedule', source: '老师告知',
      summary: '通知方式待确认',
      note: '不是确定当天通知；老师称电话，既存官网称短信，通知方式待确认。' }
  ];
  const pending = [
    { schoolId: 'sz01', summary: '家长面谈 · 时间待核对', text: '校方通知提及家长面谈，现有截图未列面谈日期及时间。' },
    { schoolId: 'north05', summary: `已笔试 · ${plan('north05').resultText.replace(/。$/, '')}`, text: `${plan('north05').resultText} 来源：${plan('north05').resultSource}。` },
    { schoolId: 'tp04', summary: '笔试后按需面试 · 日期、资格待通知', text: '如有需要，笔试后安排面试；日期、时间及个人资格待通知（老师补充；官方通告列按需要约见）。' },
    { schoolId: 'north06', summary: '2027年1月笔试 · 仅入选者，日期待定', text: '2027年1月笔试，具体日期待定；仅入选者。' },
    { schoolId: 'north04', summary: '测试待电话通知', text: '测试日期待电话通知（老师告知）。' },
    { schoolId: 'sz02', summary: '英文＋小组面试 · 日期待通知', text: '英文面试＋小组面试，日期、时间待通知。' },
    { schoolId: 'north07', summary: '已报名 · 等学校通知', text: '家长确认已报名；小三学位及笔试安排待学校通知。' }
  ];
  window.SCHOOL_CALENDAR_DATA = {
    events: events.filter(event => active(event.schoolId) && event.date).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
    pending: pending.filter(item => active(item.schoolId))
  };
})();
