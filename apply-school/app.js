'use strict';
(() => {
  const DATA=window.SCHOOL_DATA;
  const TRAVEL_SETTINGS={queueMin:30,queueMax:60,trafficBuffer:15};
  const STATUSES=['备选','待确认','准备材料','待递交','已提交','获邀笔试','已笔试','面试中','录取','候补','未录取','不再申请'];
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const dateText=date=>date?date.replace(/-/g,'.'):'';
  const diffDays=date=>Math.round((new Date(date+'T00:00:00')-new Date(today()+'T00:00:00'))/86400000);
  const reminder=date=>{const n=diffDays(date);return n<0?`已过 ${-n} 天`:n===0?'今天':`还有 ${n} 天`;};
  let scope='selected';
  const recordFor=s=>({selected:s.selected,status:s.plan?.status??(s.selected?'待确认':'备选'),applicationStart:s.plan?.applicationStartDate??'',deadline:s.plan?.deadlineDate??'',assessment:s.plan?.assessmentDate??'',openDay:s.plan?.openDayDate??'',followup:s.plan?.followupDate??'',followupText:s.plan?.followupText??'',teacherNote:s.plan?.teacherNote??'',contact:window.TRAVEL_DATA?.schools?.[s.id]?.phone??'',website:window.TRAVEL_DATA?.schools?.[s.id]?.website??'',notes:s.plan?.notes??''});
  const assessmentText=p=>{const text=p?.assessmentText?.replace(/^入选者/,'')??'';return text&&/[0-9]月/.test(text)?`${p.assessmentYear??p.year}年${text}`:text;};
  const introduction=s=>s.source==='selected'?[s.plan?.type,s.plan?.language,s.plan?.religion==='无'?'':s.plan?.religion].filter(Boolean).join(' · '):s.highlight;
  function getRows(){
    const query=$('search').value.trim().toLocaleLowerCase();
    const rows=DATA.filter(s=>{const r=recordFor(s);return (scope==='selected'?r.selected:s.source!=='selected')&&(!$('region').value||s.region===$('region').value)&&(!$('tier').value||($('tier').value==='none'?!s.tier:s.tier===$('tier').value))&&(!$('status').value||r.status===$('status').value)&&(!query||[s.name,s.highlight,s.commute,s.plan?.alias,r.notes].join(' ').toLocaleLowerCase().includes(query));});
    const sort=$('sort').value;
    if(sort==='followup'||sort==='deadline')rows.sort((a,b)=>(recordFor(a)[sort==='followup'?'followup':'deadline']||'9999').localeCompare(recordFor(b)[sort==='followup'?'followup':'deadline']||'9999'));
    if(sort==='commute')rows.sort((a,b)=>(window.schoolTravelSortMinutes?.(a,TRAVEL_SETTINGS)??a.commuteMinutes??999)-(window.schoolTravelSortMinutes?.(b,TRAVEL_SETTINGS)??b.commuteMinutes??999));
    if(scope==='selected'&&sort==='default'){const order=['north06','north08','north04','north05','north03','tp04','tp01','sz01','sz02','sz03','north07','hk-extra01'];rows.sort((a,b)=>{const ai=order.indexOf(a.id),bi=order.indexOf(b.id);return (ai<0?999:ai)-(bi<0?999:bi);});}
    return rows;
  }
  function scheduleIssue(s){
    const check=window.SCHEDULE_CHECK_DATA?.schools?.[s.id];if(!check||check.status==='confirmed')return '';
    const source=check.sources?.[0];
    return `<div class="schedule-issue"><strong>${esc(check.issueLabel??(check.status==='conflict'?'日期有冲突':'未核实'))}</strong><span>${esc(check.message)}</span>${source?`<a href="${esc(source.url)}" target="_blank" rel="noopener">官方资料 ↗</a>`:''}</div>`;
  }
  function dateCell(s,r){
    const p=s.plan,pieces=[];
    if(r.applicationStart&&r.deadline)pieces.push(`<span class="date-main ${diffDays(r.deadline)<0?'overdue':''}">申请 ${dateText(r.applicationStart)}–${dateText(r.deadline)}</span>`);
    else {
      if(r.applicationStart)pieces.push(`<span class="date-main">申请开放 ${dateText(r.applicationStart)}</span>`);else if(p?.applicationStartText)pieces.push(`<span class="date-main">${esc(p.applicationStartText==='现可申'?p.applicationStartText:`${p.year}年${p.applicationStartText}`)}</span>`);
      if(r.deadline)pieces.push(`<span class="date-main ${diffDays(r.deadline)<0?'overdue':''}">截止 ${dateText(r.deadline)}</span>`);else if(p?.deadlineText)pieces.push(`<span class="date-main">${esc(p.deadlineText)}</span>`);
    }
    if(r.assessment)pieces.push(`<small>笔试 ${dateText(r.assessment)}</small>`);else if(p?.assessmentText)pieces.push(`<small>${esc(assessmentText(p))}${/[0-9]月/.test(p.assessmentText)?' · 日期待定':''}</small>`);
    if(r.openDay)pieces.push(`<span class="date-main">开放日 ${dateText(r.openDay)}</span>`);
    if(p?.actionText&&!r.followupText)pieces.push('<small>电话确认</small>');
    return (pieces.join('')||'<span class="muted">—</span>')+scheduleIssue(s);
  }
  function render(){
    $('tab-selected-count').textContent=DATA.filter(s=>s.selected).length;
    $('tab-candidate-count').textContent=DATA.filter(s=>s.source!=='selected').length;
    document.querySelectorAll('.tabs [data-scope]').forEach(b=>{b.classList.toggle('active',b.dataset.scope===scope);b.setAttribute('aria-pressed',String(b.dataset.scope===scope));});
    const rows=getRows();$('result-count').textContent=`显示 ${rows.length} 所学校`;$('empty-state').hidden=rows.length!==0;
    $('school-list').innerHTML=rows.map(s=>{
      const r=recordFor(s);
      const travel=window.renderSchoolTravelCells?window.renderSchoolTravelCells(s,TRAVEL_SETTINGS):'<td class="travel-cell" data-label="翰岭院出行">查询中</td>';
      const followup=r.followup?`<strong class="${diffDays(r.followup)<0?'overdue':''}">${dateText(r.followup)}</strong><span class="muted">${reminder(r.followup)}</span>`:r.followupText?esc(r.followupText):'<span class="muted">待安排</span>';
      return `<tr>
        <td data-label="学校"><button class="school-name" data-detail="${s.id}">${esc(s.name)}</button><div class="school-meta">${r.selected?'<span class="selected-tag">✓ 已选报名</span>':''}</div></td>
        <td data-label="地区"><strong>${esc(s.region)}</strong><span class="muted">${s.net?'校网 '+esc(s.net):''}</span></td>
        <td data-label="梯队">${s.tier?`<span class="pill tier tier-${s.tier.slice(-1)}">${esc(s.tier)}</span>`:'<span class="muted">—</span>'}</td>
        <td data-label="学校介绍" class="school-intro">${esc(introduction(s))||'<span class="muted">—</span>'}</td>
        <td data-label="重要日期" class="source-date">${dateCell(s,r)}</td>
        <td data-label="报名进度 / 下次跟进" class="progress-cell"><span class="status-pill" data-status="${esc(r.status)}">${esc(r.status)}</span>${r.teacherNote?`<p class="teacher-update">${esc(r.teacherNote)}</p>`:''}<div class="followup"><small>下次跟进</small>${followup}</div>${r.website?`<a href="${esc(r.website)}" class="route-link" target="_blank" rel="noopener">官网 ↗</a>`:''}</td>
        <td data-label="老师路程（原文）" class="teacher-route">${esc(s.commute)||'<span class="muted">—</span>'}</td>
        ${travel}
      </tr>`;
    }).join('');
    if(window.renderTravelSettings)window.renderTravelSettings(TRAVEL_SETTINGS);
  }
  function openDetail(id){
    const s=DATA.find(s=>s.id===id);if(!s)return;const r=recordFor(s),p=s.plan;
    $('detail-title').textContent=s.name;$('detail-subtitle').textContent=[s.region,s.net?'校网 '+s.net:'',s.tier].filter(Boolean).join(' · ');
    const dates=[...(r.applicationStart?[['申请开放',dateText(r.applicationStart)]]:p?.applicationStartText?[['申请开放',p.applicationStartText==='现可申'?p.applicationStartText:`${p.year}年${p.applicationStartText}`]]:[]),...(r.deadline?[['申请截止',dateText(r.deadline)]]:p?.deadlineText?[['申请时间',p.deadlineText]]:[]),...(r.assessment?[['笔试日期',dateText(r.assessment)]]:p?.assessmentText?[['笔试安排',assessmentText(p)+(/[0-9]月/.test(p.assessmentText)?'，具体日期待确认':'')]]:[]),...(r.openDay?[['开放日',dateText(r.openDay)]]:[])];
    const facts=[['学校介绍',introduction(s)||'—'],...(s.commute?[['老师路程（原文）',s.commute]]:[]),['报名进度',r.status],...dates,...(r.teacherNote?[['材料进度',r.teacherNote]]:[]),...(r.followup||r.followupText?[['下次跟进',r.followup?dateText(r.followup):r.followupText]]:[]),...(r.notes?[['老师更新',r.notes],...(p?.updateReceivedAt?[['资料收到日期',dateText(p.updateReceivedAt)]]:[])]:[]),...(p?[['办学信息',[p.type,p.gender,p.language,p.religion==='无'?'':p.religion].filter(Boolean).join(' · ')],...(p.alias?[['其他名称',p.alias]]:[])]:[]),...(r.contact?[['学校电话',r.contact]]:[])];
    const check=window.SCHEDULE_CHECK_DATA?.schools?.[s.id];
    const checked=check?`<div class="schedule-check ${check.status==='confirmed'?'':'schedule-issue'}"><strong>日期核查 · ${esc(check.checkedAt??window.SCHEDULE_CHECK_DATA.checkedAt)}</strong><p>${esc(check.details??check.message)}</p>${(check.sources??[]).map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)} ↗</a>`).join('')}</div>`:'';
    $('detail-facts').innerHTML=facts.map(([label,value])=>`<p><strong>${esc(label)}</strong><span>${esc(value)}</span></p>`).join('')+checked+(window.renderSchoolTravel?`<p><strong>翰岭院出发</strong><span>${window.renderSchoolTravel(s,TRAVEL_SETTINGS)}</span></p>`:'');
    $('detail-dialog').showModal();
  }
  for(const status of STATUSES){const option=document.createElement('option');option.textContent=status;$('status').append(option);}
  document.addEventListener('click',event=>{
    const detail=event.target.closest('[data-detail]');if(detail)openDetail(detail.dataset.detail);
    const group=event.target.closest('[data-scope]');if(group){scope=group.dataset.scope;render();document.querySelector('.table-wrap').scrollLeft=0;}
    const close=event.target.closest('[data-close]');if(close)$(close.dataset.close).close();
  });
  for(const id of ['search','region','tier','status','sort'])$(id).addEventListener(id==='search'?'input':'change',render);
  $('clear-filters').addEventListener('click',()=>{for(const id of ['search','region','tier','status'])$(id).value='';render();});
  function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
  const csvValue=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
  $('csv-button').addEventListener('click',()=>{
    const head=['学校','地区','梯队','校网','学校介绍','老师路程（原文）','已选报名','报名进度','申请开放日期','申请开放安排','申请截止','笔试/面试日期','笔试安排','开放日日期','下次跟进','联系电话','官网','备注','日期核查','老师告知安排','资料收到日期'];
    const rows=DATA.map(s=>{const r=recordFor(s),check=window.SCHEDULE_CHECK_DATA?.schools?.[s.id];return [s.name,s.region,s.tier,s.net,introduction(s),s.commute,r.selected?'是':'否',r.status,r.applicationStart,s.plan?.applicationStartText??'',r.deadline,r.assessment,assessmentText(s.plan),r.openDay,r.followup||r.followupText,r.contact,r.website,r.notes,check?.message??'',r.teacherNote,s.plan?.updateReceivedAt??''];});
    if(window.schoolTravelCSV){head.push(...window.schoolTravelCSV.headers);rows.forEach((row,i)=>row.push(...window.schoolTravelCSV.values(DATA[i],TRAVEL_SETTINGS)));}
    download(`学校跟踪表-${today()}.csv`,'\uFEFF'+[head,...rows].map(row=>row.map(csvValue).join(',')).join('\r\n'),'text/csv;charset=utf-8');
  });
  $('print-button').addEventListener('click',()=>window.print());
  window.schoolNotebook={render,getTravelSettings(){return {...TRAVEL_SETTINGS};}};
  render();
})();
