'use strict';
(() => {
  const DATA = window.SCHOOL_DATA;
  const STORAGE_KEY = 'school-notebook-progress-v1';
  const STATUSES = ['备选', '待确认', '准备材料', '已提交', '获邀笔试', '已笔试', '面试中', '录取', '候补', '未录取', '不再申请'];
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const dateText = date => date ? date.replace(/-/g, '.') : '';
  const diffDays = date => Math.round((new Date(date+'T00:00:00') - new Date(today()+'T00:00:00')) / 86400000);
  const reminder = date => { const n=diffDays(date); return n < 0 ? `已过 ${-n} 天` : n===0 ? '今天' : `还有 ${n} 天`; };
  let state = {records:{}, currentSchool:{name:'深圳公立小学',notes:''}, travelSettings:{queueMin:30,queueMax:60,trafficBuffer:15}};
  let storageAvailable = true, scope = 'selected', editingId = null, pendingImport = null, toastTimer;
  function validDate(value) { if(value==='') return true; if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const d=new Date(value+'T00:00:00Z'); return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===value; }
  function validateState(raw) {
    if(!raw || typeof raw!=='object' || !raw.records || Array.isArray(raw.records) || typeof raw.records!=='object') throw new Error('备份结构不正确');
    const records = {};
    for(const [id,record] of Object.entries(raw.records)) {
      if(!DATA.some(s=>s.id===id)) throw new Error('备份含未知学校，尚未导入');
      if(!record || typeof record!=='object' || typeof record.selected!=='boolean' || !STATUSES.includes(record.status)) throw new Error('学校记录格式不正确');
      for(const key of ['deadline','assessment','followup']) if(!validDate(record[key]??'')) throw new Error('备份中有无效日期');
      if(!['普通','重点关注'].includes(record.priority??'普通')) throw new Error('关注程度无效');
      const cleaned={selected:record.selected,status:record.status,priority:record.priority??'普通',sourceConfirmed:record.sourceConfirmed===true};
      for(const key of ['deadline','assessment','followup','contact','website','notes','updatedAt']) {
        if(record[key]!=null && typeof record[key]!=='string') throw new Error('备份字段格式不正确');
        if((record[key]??'').length > (key==='notes'?5000:500)) throw new Error('备份字段过长');
        cleaned[key]=record[key]??'';
      }
      if(cleaned.website && !/^https?:\/\//i.test(cleaned.website)) throw new Error('官网链接须为 http 或 https');
      records[id]=cleaned;
    }
    const current=raw.currentSchool??{name:'深圳公立小学',notes:''};
    if(typeof current.name!=='string'||typeof current.notes!=='string'||current.name.length>150||current.notes.length>1000) throw new Error('就读信息格式不正确');
    const settings={queueMin:30,queueMax:60,trafficBuffer:15,...raw.travelSettings};
    if(!Number.isInteger(settings.queueMin)||!Number.isInteger(settings.queueMax)||settings.queueMin<0||settings.queueMax>240||settings.queueMin>settings.queueMax) throw new Error('通关预留格式不正确');
    if(!Number.isInteger(settings.trafficBuffer)||settings.trafficBuffer<0||settings.trafficBuffer>120) throw new Error('路况预留无效');
    return {records,currentSchool:current,travelSettings:settings};
  }
  try { const saved=localStorage.getItem(STORAGE_KEY); if(saved) state=validateState(JSON.parse(saved)); } catch(error) { storageAvailable=false; $('save-state').textContent='本机存储不可用 / 请导出备份'; $('save-state').classList.add('overdue'); }
  const baseRecord = school => ({selected:school.selected,status:school.selected?'待确认':'备选',priority:'普通',deadline:school.plan?.deadlineDate??'',assessment:school.plan?.assessmentDate??'',followup:'',contact:window.TRAVEL_DATA?.schools?.[school.id]?.phone??'',website:window.TRAVEL_DATA?.schools?.[school.id]?.website??'',notes:'',sourceConfirmed:false,updatedAt:''});
  const recordFor = school => ({...baseRecord(school),...state.records[school.id],...(school.source==='selected'?{selected:true}:{})});
  const needConfirm = (school,record) => !!(school.plan && !record.sourceConfirmed && (school.plan.actionText || school.plan.deadlineText==='待开放' || (school.plan.assessmentText && !record.assessment)));
  const notify = message => { $('toast').textContent=message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),4200); };
  function persist() {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); storageAvailable=true; $('save-state').textContent='已在本机保存'; $('save-state').classList.remove('overdue'); }
    catch { storageAvailable=false; $('save-state').textContent='保存不可用 / 请导出备份'; $('save-state').classList.add('overdue'); notify('浏览器保存不可用，请导出备份保留修改。'); return false; }
    return true;
  }
  function getRows() {
    const query=$('search').value.trim().toLocaleLowerCase();
    const rows=DATA.filter(s=>{const r=recordFor(s); return (scope==='selected'?r.selected:s.source!=='selected')&&(!$('region').value||s.region===$('region').value)&&(!$('tier').value||($('tier').value==='none'?!s.tier:s.tier===$('tier').value))&&(!$('status').value||r.status===$('status').value)&&(!query||[s.name,s.highlight,s.plan?.alias,r.notes].join(' ').toLocaleLowerCase().includes(query));});
    const sort=$('sort').value;
    if(sort==='followup'||sort==='deadline') rows.sort((a,b)=>(recordFor(a)[sort==='followup'?'followup':'deadline']||'9999').localeCompare(recordFor(b)[sort==='followup'?'followup':'deadline']||'9999'));
    if(sort==='commute') rows.sort((a,b)=>(window.schoolTravelSortMinutes?.(a,state.travelSettings)??a.commuteMinutes??999)-(window.schoolTravelSortMinutes?.(b,state.travelSettings)??b.commuteMinutes??999));
    if(scope==='selected' && sort==='default') { const order=['north06','north08','north07','hk-extra01','sz01','sz02','sz03']; rows.sort((a,b)=>{const ai=order.indexOf(a.id),bi=order.indexOf(b.id);return (ai<0?999:ai)-(bi<0?999:bi);}); }
    return rows;
  }
  const introduction = school => school.source==='selected'
    ? [school.plan?.type,school.plan?.language,school.plan?.religion==='无'?'':school.plan?.religion].filter(Boolean).join(' · ')
    : school.highlight;
  function scheduleIssue(s) {
    const check=window.SCHEDULE_CHECK_DATA?.schools?.[s.id];
    if(!check || check.status==='confirmed') return '';
    const source=check.sources?.[0];
    return `<div class="schedule-issue"><strong>${esc(check.issueLabel??(check.status==='conflict'?'日期有冲突':'未核实'))}</strong><span>${esc(check.message)}</span>${source?`<a href="${esc(source.url)}" target="_blank" rel="noopener">官方资料 ↗</a>`:''}</div>`;
  }
  function dateCell(s,r) {
    const p=s.plan, pieces=[];
    if(r.deadline) pieces.push(`<span class="date-main ${diffDays(r.deadline)<0?'overdue':''}">截止 ${dateText(r.deadline)}</span>`);
    else if(p?.deadlineText) pieces.push(`<span class="date-main">${esc(p.deadlineText)}</span>`);
    if(r.assessment) pieces.push(`<small>笔试 ${dateText(r.assessment)}</small>`);
    else if(p?.assessmentText) pieces.push(`<small>${p.assessmentYear??p.year}年${esc(p.assessmentText.replace(/^入选者/,''))} · 日期待定</small>`);
    if(p?.actionText) pieces.push('<small>电话确认</small>');
    return (pieces.join('')||'<span class="muted">—</span>')+scheduleIssue(s);
  }
  function renderTravel(s) { return window.renderSchoolTravel ? window.renderSchoolTravel(s,state.travelSettings) : '<span class="muted">正在补充出行查询</span>'; }
  function render() {
    const selected=DATA.filter(s=>recordFor(s).selected);
    $('tab-selected-count').textContent=selected.length;
    $('tab-candidate-count').textContent=DATA.filter(s=>s.source!=='selected').length;
    document.querySelectorAll('.tabs [data-scope]').forEach(b=>{b.classList.toggle('active',b.dataset.scope===scope);b.setAttribute('aria-pressed',String(b.dataset.scope===scope));});
    const rows=getRows(); $('result-count').textContent=`显示 ${rows.length} 所学校`; $('empty-state').hidden=rows.length!==0;
    $('school-list').innerHTML=rows.map(s=>{
      const r=recordFor(s);
      const travel=window.renderSchoolTravelCells?window.renderSchoolTravelCells(s,state.travelSettings):'<td class="travel-cell" data-label="地铁 / 公交">查询中</td><td class="travel-cell" data-label="皇岗驾车">查询中</td><td class="travel-cell" data-label="莲塘驾车">查询中</td>';
      return `<tr>
        <td data-label="学校"><button class="school-name" data-edit="${s.id}">${esc(s.name)}</button><div class="school-meta">${r.selected?'<span class="selected-tag">✓ 已选报名</span>':''}${r.priority==='重点关注'?'<span class="priority-tag">重点关注</span>':''}</div>${r.notes?`<p class="notes-preview">${esc(r.notes.slice(0,75))}${r.notes.length>75?'…':''}</p>`:''}</td>
        <td data-label="地区"><strong>${esc(s.region)}</strong><span class="muted">${s.net?'校网 '+esc(s.net):''}</span></td>
        <td data-label="梯队">${s.tier?`<span class="pill tier tier-${s.tier.slice(-1)}">${esc(s.tier)}</span>`:'<span class="muted">—</span>'}</td>
        <td data-label="学校介绍" class="school-intro">${esc(introduction(s))||'<span class="muted">—</span>'}</td>
        <td data-label="重要日期" class="source-date">${dateCell(s,r)}</td>
        <td data-label="报名进度"><span class="status-pill" data-status="${esc(r.status)}">${esc(r.status)}</span>${r.website?`<a href="${esc(r.website)}" class="route-link" target="_blank" rel="noopener">官网 ↗</a>`:''}</td>
        <td data-label="下次跟进">${r.followup?`<strong class="${diffDays(r.followup)<0?'overdue':''}">${dateText(r.followup)}</strong><span class="muted">${reminder(r.followup)}</span>`:'<span class="muted">待安排</span>'}</td>
        ${travel}
        <td data-label="操作" class="row-actions"><button class="button small" data-edit="${s.id}">记录</button>${s.source!=='selected'?`<button class="text-button" data-toggle="${s.id}">${r.selected?'取消已选':'选中报名'}</button>`:''}</td>
      </tr>`;
    }).join('');
    renderCurrent(); if(window.renderTravelSettings)window.renderTravelSettings(state.travelSettings);
  }
  function setScope(next) { scope=next; render(); document.querySelector('.table-wrap').scrollLeft=0; }
  function openDetail(id) {
    const s=DATA.find(s=>s.id===id); if(!s)return; editingId=id; const r=recordFor(s),p=s.plan;
    $('detail-title').textContent=s.name; $('detail-subtitle').textContent=[s.region,s.net?'校网 '+s.net:'',s.tier?s.tier:''].filter(Boolean).join(' · ');
    const facts=[['学校介绍',introduction(s)||'—'],...(p?[['办学信息',[p.type,p.gender,p.language,p.religion==='无'?'':p.religion].filter(Boolean).join(' · ')],...(p.assessmentText&&!r.assessment?[['笔试安排',`${p.assessmentYear??p.year}年${p.assessmentText.replace(/^入选者/,'')}，具体日期待确认`]]:[]),...(p.alias?[['其他名称',p.alias]]:[])]:[])];
    const check=window.SCHEDULE_CHECK_DATA?.schools?.[s.id];
    const checked=check?`<div class="schedule-check ${check.status==='confirmed'?'':'schedule-issue'}"><strong>日期核查 · ${window.SCHEDULE_CHECK_DATA.checkedAt}</strong><p>${esc(check.details??check.message)}</p>${(check.sources??[]).map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)} ↗</a>`).join('')}</div>`:'';
    $('detail-facts').innerHTML=facts.map(([label,value])=>`<p><strong>${esc(label)}</strong><span>${esc(value)}</span></p>`).join('')+checked+(window.renderSchoolTravel?`<p><strong>翰岭院出发</strong><span>${renderTravel(s)}</span></p>`:'');
    $('edit-selected').checked=r.selected; $('edit-selected').disabled=s.source==='selected'; $('edit-selected-help').hidden=s.source!=='selected'; $('edit-status').value=r.status; $('edit-priority').value=r.priority;
    for(const key of ['deadline','assessment','followup','contact','website','notes']) $('edit-'+key).value=r[key];
    $('edit-confirmed').checked=r.sourceConfirmed; $('record-updated').textContent=r.updatedAt?'上次更新：'+new Date(r.updatedAt).toLocaleString('zh-CN'):'';
    $('detail-dialog').showModal();
  }
  for(const id of ['status','edit-status']) for(const status of STATUSES) { const option=document.createElement('option'); option.textContent=status; $(id).append(option); }
  document.addEventListener('click',event=>{const edit=event.target.closest('[data-edit]'); if(edit)openDetail(edit.dataset.edit); const group=event.target.closest('[data-scope]');if(group){setScope(group.dataset.scope);if(group.classList.contains('stat'))$('list-title').scrollIntoView({behavior:'smooth',block:'start'});} const close=event.target.closest('[data-close]');if(close)$(close.dataset.close).close(); const toggle=event.target.closest('[data-toggle]');if(toggle){const s=DATA.find(s=>s.id===toggle.dataset.toggle);const r=recordFor(s);r.selected=!r.selected;if(r.selected&&r.status==='备选')r.status='待确认';r.updatedAt=new Date().toISOString();state.records[s.id]=r;persist();render();notify(r.selected?'已加入我们的已选学校':'已移出已选，历史记录仍保留');}});
  for(const id of ['search','region','tier','status','sort']) $(id).addEventListener(id==='search'?'input':'change',render);
  $('clear-filters').addEventListener('click',()=>{for(const id of ['search','region','tier','status'])$(id).value='';render();});
  $('detail-form').addEventListener('submit',event=>{event.preventDefault();const s=DATA.find(s=>s.id===editingId);const r=recordFor(s);r.selected=s.source==='selected'||$('edit-selected').checked;r.status=$('edit-status').value;r.priority=$('edit-priority').value;r.sourceConfirmed=$('edit-confirmed').checked;for(const key of ['deadline','assessment','followup','contact','website','notes'])r[key]=$('edit-'+key).value.trim();if(r.website&&!/^https?:\/\//i.test(r.website)){notify('官网链接请以 https:// 或 http:// 开头');return;}r.updatedAt=new Date().toISOString();state.records[s.id]=r;const saved=persist();$('detail-dialog').close();render();if(saved)notify('学校记录已保存');});
  function download(name,text,type) { const url=URL.createObjectURL(new Blob([text],{type})); const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500); }
  $('backup-button').addEventListener('click',()=>{download(`择校跟踪备份-${today()}.json`,JSON.stringify({format:'school-notebook',version:1,exportedAt:new Date().toISOString(),...state},null,2),'application/json');notify('备份已导出，请保存在自己的文件夹');});
  $('import-button').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',async()=>{const file=$('import-file').files[0];if(!file)return;try{if(file.size>1000000)throw new Error('备份文件过大');const raw=JSON.parse(await file.text());if(raw.format!=='school-notebook'||raw.version!==1)throw new Error('请选择此网页导出的备份文件');pendingImport=validateState(raw);$('import-description').textContent=`备份包含 ${Object.keys(pendingImport.records).length} 所学校的修改记录，导出于 ${raw.exportedAt?new Date(raw.exportedAt).toLocaleString('zh-CN'):'未知时间'}。`;$('import-dialog').showModal();}catch(error){notify(error.message||'读取备份失败');}$('import-file').value='';});
  $('confirm-import').addEventListener('click',()=>{if(!pendingImport)return;state=pendingImport;pendingImport=null;const saved=persist();$('import-dialog').close();render();if(saved)notify('备份已导入');});
  const csvValue=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
  $('csv-button').addEventListener('click',()=>{
    const head=['学校','地区','梯队','校网','学校介绍','已选报名','报名进度','申请截止','笔试/面试日期','笔试安排','下次跟进','联系电话','官网','备注','日期核查'];
    const rows=DATA.map(s=>{const r=recordFor(s),check=window.SCHEDULE_CHECK_DATA?.schools?.[s.id];return [s.name,s.region,s.tier,s.net,introduction(s),r.selected?'是':'否',r.status,r.deadline,r.assessment,s.plan?.assessmentText?`${s.plan.assessmentYear??s.plan.year}年 · ${s.plan.assessmentText.replace(/^入选者/,'')}`:'',r.followup,r.contact,r.website,r.notes,check?.message??''];});
    if(window.schoolTravelCSV){head.push(...window.schoolTravelCSV.headers);rows.forEach((row,i)=>row.push(...window.schoolTravelCSV.values(DATA[i],state.travelSettings)));}
    download(`学校跟踪表-${today()}.csv`,'\uFEFF'+[head,...rows].map(row=>row.map(csvValue).join(',')).join('\r\n'),'text/csv;charset=utf-8');
  });
  function renderCurrent() { const box=document.querySelector('.intro-note');box.querySelector('strong').textContent=state.currentSchool.name||'深圳公立小学';box.querySelectorAll('span')[1].textContent=state.currentSchool.notes||'校名待补充'; }
  $('current-button').addEventListener('click',()=>{$('current-name').value=state.currentSchool.name;$('current-notes').value=state.currentSchool.notes;$('current-dialog').showModal();});
  $('current-form').addEventListener('submit',event=>{event.preventDefault();state.currentSchool={name:$('current-name').value.trim()||'深圳公立小学',notes:$('current-notes').value.trim()};const saved=persist();renderCurrent();$('current-dialog').close();if(saved)notify('就读信息已保存');});
  $('print-button').addEventListener('click',()=>window.print());
  window.schoolNotebook={render,updateTravelSettings(settings){state.travelSettings=settings;persist();render();},getTravelSettings(){return {...state.travelSettings};}};
  render();
})();
