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
  function renderActions() {
    const actions=[];
    for(const s of DATA) { const r=recordFor(s); if(!r.selected||['不再申请','未录取','录取'].includes(r.status)) continue;
      if(r.followup) actions.push({s,title:`${dateText(r.followup)} · ${reminder(r.followup)}`,copy:r.notes||'查看记录，完成本次跟进',order:r.followup,cls:diffDays(r.followup)<0?'overdue':''});
      else if(s.plan?.actionText&&!r.sourceConfirmed) actions.push({s,title:'电话确认',copy:`原表：${s.plan.actionText} · 先确认联系日期`,order:'0001',cls:''});
      if(r.deadline&&!['已提交','获邀笔试','已笔试','面试中','候补'].includes(r.status)) actions.push({s,title:`${dateText(r.deadline)} 截止`,copy:`${reminder(r.deadline)} · 当前${r.status}`,order:r.deadline,cls:diffDays(r.deadline)<0?'overdue':''});
      if(r.assessment&&['获邀笔试','已提交','面试中'].includes(r.status)) actions.push({s,title:`${dateText(r.assessment)} 笔试 / 面试`,copy:r.status==='已提交'?'原表安排，先确认是否收到邀请':'查看学校通知和准备事项',order:r.assessment,cls:''});
    }
    actions.sort((a,b)=>a.order.localeCompare(b.order));
    const seen=new Set(); const top=actions.filter(a=>{if(seen.has(a.s.id))return false; seen.add(a.s.id);return true;}).slice(0,3);
    $('next-actions').innerHTML=top.length?top.map((a,i)=>`<button class="action-card" data-edit="${a.s.id}"><span class="action-index">0${i+1}</span><span class="action-copy"><small class="${a.cls}">${esc(a.title)}</small><strong>${esc(a.s.name)}</strong><span>${esc(a.copy)}</span></span><b aria-hidden="true">↗</b></button>`).join(''):'<div class="action-card"><span class="action-copy"><strong>暂无待安排的跟进</strong><span>在学校详情填写下次跟进日期，或更新申请状态。</span></span></div>';
  }
  function dateCell(s,r) {
    if(!s.plan&&!r.deadline&&!r.assessment) return '<span class="muted">尚未记录申请安排</span>';
    const p=s.plan; const pieces=[];
    if(r.deadline) pieces.push(`<span class="date-main ${diffDays(r.deadline)<0?'overdue':''}">${dateText(r.deadline)} 截止</span>`);
    else if(p?.deadlineText) pieces.push(`<span class="date-main">${esc(p.deadlineText)}</span>`);
    if(r.assessment) pieces.push(`<small>笔试 ${dateText(r.assessment)}${p?.assessmentText?' · 获邀者':''}</small>`);
    else if(p?.assessmentText) pieces.push(`<small>${p.assessmentYear??p.year}年${esc(p.assessmentText.replace(/^入选者/,''))} · ${p.assessmentDate?'原表安排':'具体日待定'}</small>`);
    if(p?.actionText) pieces.push(`<small>${esc(p.actionText)}${r.sourceConfirmed?' · 已核对':''}</small>`);
    if(needConfirm(s,r)) pieces.push('<span class="date-note">时间待确认</span>');
    return pieces.join('');
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
        <td data-label="学校"><button class="school-name" data-edit="${s.id}">${esc(s.name)}</button><div class="school-meta">${r.selected?'<span class="selected-tag">✓ 已选报名</span>':''}${r.priority==='重点关注'?'<span class="priority-tag">重点关注</span>':''}</div>${scope==='candidates'&&s.highlight?`<p class="highlight">${esc(s.highlight)}</p>`:''}${r.notes?`<p class="notes-preview">${esc(r.notes.slice(0,75))}${r.notes.length>75?'…':''}</p>`:''}</td>
        <td data-label="地区"><strong>${esc(s.region)}</strong><span class="muted">${s.net?'校网 '+esc(s.net):'—'}</span></td>
        <td data-label="梯队">${s.tier?`<span class="pill tier tier-${s.tier.slice(-1)}">${esc(s.tier)}</span><span class="muted">原表 #${s.rank}</span>`:'<span class="muted">未提供</span>'}</td>
        <td data-label="申请安排" class="source-date">${dateCell(s,r)}</td>
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
    $('detail-title').textContent=s.name; $('detail-subtitle').textContent=[s.region,s.net?'校网 '+s.net:'',s.tier?'老师 '+s.tier:'已选补充'].filter(Boolean).join(' · ');
    const facts=[['老师提到的亮点',s.highlight||'暂无资料'],['原表公共交通',s.commute||'原表未提供'],...(p?[['学校基本信息',[p.type,p.gender,p.language,p.religion==='无'?'无宗教':p.religion].join(' · ')],['原表申请安排',[p.deadlineText,p.actionText].filter(Boolean).join('；')||'未提供'],['原表笔试安排',p.assessmentText?`${p.assessmentYear??p.year}年 · ${p.assessmentText}`:'未提供'],...(p.dateNote?[['时间备注',p.dateNote]]:[]),...(p.alias?[['校名待核对',`已选原表写作“${p.alias}”，备选表写作“${s.name}”；暂合并为一条。`]]:[])]:[])];
    $('detail-facts').innerHTML=facts.map(([label,value])=>`<p><strong>${esc(label)}</strong><span>${esc(value)}</span></p>`).join('')+(window.renderSchoolTravel?`<p><strong>翰岭院出发</strong><span>${renderTravel(s)}</span></p>`:'');
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
  $('csv-button').addEventListener('click',()=>{const head=['学校','地区','原表排名','老师梯队','校网','已选','申请状态','申请截止日期','笔试/面试日期','下次跟进','原表申请时间','原表笔试','原表电话待办','原表公共交通','联系电话','官网','备注'];const rows=DATA.map(s=>{const r=recordFor(s);return [s.name,s.region,s.rank,s.tier,s.net,r.selected?'是':'否',r.status,r.deadline,r.assessment,r.followup,s.plan?.deadlineText?`${s.plan.year}年 · ${s.plan.deadlineText}`:'',s.plan?.assessmentText?`${s.plan.assessmentYear??s.plan.year}年 · ${s.plan.assessmentText}`:'',s.plan?.actionText,s.commute,r.contact,r.website,r.notes];});if(window.schoolTravelCSV){head.push(...window.schoolTravelCSV.headers);rows.forEach((row,i)=>row.push(...window.schoolTravelCSV.values(DATA[i],state.travelSettings)));}download(`学校跟踪表-${today()}.csv`,'\uFEFF'+[head,...rows].map(row=>row.map(csvValue).join(',')).join('\r\n'),'text/csv;charset=utf-8');});
  function renderCurrent() { const box=document.querySelector('.intro-note');box.querySelector('strong').textContent=state.currentSchool.name||'深圳公立小学';box.querySelectorAll('span')[1].textContent=state.currentSchool.notes||'具体校名待补充 · 老师表中记为“在读”'; }
  $('current-button').addEventListener('click',()=>{$('current-name').value=state.currentSchool.name;$('current-notes').value=state.currentSchool.notes;$('current-dialog').showModal();});
  $('current-form').addEventListener('submit',event=>{event.preventDefault();state.currentSchool={name:$('current-name').value.trim()||'深圳公立小学',notes:$('current-notes').value.trim()};const saved=persist();renderCurrent();$('current-dialog').close();if(saved)notify('就读信息已保存');});
  $('print-button').addEventListener('click',()=>window.print());
  window.schoolNotebook={render,updateTravelSettings(settings){state.travelSettings=settings;persist();render();},getTravelSettings(){return {...state.travelSettings};}};
  render();
})();
