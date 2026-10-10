'use strict';
(() => {
  const TRAVEL=window.TRAVEL_DATA;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const minutes=range=>range?`${range[0]===range[1]?range[0]:range.join('–')} 分`:'待核对';
  function transit(s,settings) {
    const record=window.TRANSIT_DATA?.schools?.[s.id];
    if(!record)return null;
    const range=record.minutes??record.range;
    if(!range)return null;
    if(s.region==='深圳')return range;
    const home=window.TRANSIT_DATA.homeToFutian?.minutes??window.TRANSIT_DATA.homeToFutian?.range??window.TRANSIT_DATA.homeToFutian??[29,48];
    return [home[0]+range[0]+settings.queueMin,home[1]+range[1]+settings.queueMax].map(n=>Math.ceil(n/5)*5);
  }
  function drive(s,port,settings) {
    const record=TRAVEL.schools[s.id];
    if(s.region==='深圳')return record?.direct==null?null:[record.direct+settings.trafficBuffer,record.direct+settings.trafficBuffer];
    const home=TRAVEL.driveMinutes[port==='huanggang'?'homeToHuanggang':'homeToLiantang'];
    const school=record?.[port];
    if(home==null||school==null)return null;
    return [home+school+settings.queueMin+settings.trafficBuffer,home+school+settings.queueMax+settings.trafficBuffer];
  }
  function cell(label,range,note,link) { return `<td data-label="${esc(label)}" class="travel-cell"><strong>${minutes(range)}</strong>${note?`<small class="travel-note">${esc(note)}</small>`:''}${link?`<a href="${esc(link)}" class="route-link" target="_blank" rel="noopener">导航 ↗</a>`:''}</td>`; }
  window.renderSchoolTravelCells=(s,settings)=>{
    const rec=TRAVEL.schools[s.id], pt=window.TRANSIT_DATA?.schools?.[s.id];
    const publicLink=rec?.mapLinks?.directPublicTransport??(rec?.coordinates?`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('深圳翰岭院')}&destination=${encodeURIComponent(rec.officialName+' '+rec.address)}&travelmode=transit`:null);
    const publicCell=cell('地铁 / 公交',transit(s,settings),s.region==='深圳'?(pt?.shortRoute??'深圳境内直达'):'经福田口岸',publicLink);
    if(s.region==='深圳')return publicCell+cell('直接驾车',drive(s,'huanggang',settings),'深圳直达 · 不经口岸',rec?.mapLinks?.direct)+cell('莲塘驾车',null,'不经口岸',null).replace('<strong>待核对</strong>','<strong>—</strong>');
    return publicCell+cell('皇岗驾车',drive(s,'huanggang',settings),TRAVEL.huanggangChange?'旧路网参考＊':'含通关 / 路况预留',rec?.mapLinks?.huanggang)+cell('莲塘驾车',drive(s,'liantang',settings),'含通关 / 路况预留',rec?.mapLinks?.liantang);
  };
  window.renderSchoolTravel=(s,settings)=>{
    const rec=TRAVEL.schools[s.id], pt=window.TRANSIT_DATA?.schools?.[s.id];
    const rows=[['地铁 / 公交',transit(s,settings)],...(s.region==='深圳'?[['直接驾车',drive(s,'huanggang',settings)]]:[['皇岗驾车',drive(s,'huanggang',settings)],['莲塘驾车',drive(s,'liantang',settings)]])];
    let html=rows.map(([label,range])=>`<span class="route-summary"><b>${label}</b>　${minutes(range)}</span>`).join('');
    html+=`<details class="route-details"><summary>路线 / 估算依据</summary>`;
    if(rec?.officialName)html+=`<div>${esc(rec.officialName)}</div>`;
    if(rec?.address)html+=`<div>${esc(rec.address)} <a href="${esc(rec.addressSourceUrl??rec.sourceUrl)}" target="_blank" rel="noopener">地址来源 ↗</a></div>`;
    if(rec?.nameNote)html+=`<div>${esc(rec.nameNote)}</div>`;
    if(pt)html+=`<div>公共交通：${esc(pt.route??pt.shortRoute??'地铁 / 公交分段规划')}</div>`;
    if(s.region!=='深圳') {
      const hg=TRAVEL.driveMinutes.homeToHuanggang,lt=TRAVEL.driveMinutes.homeToLiantang;
      html+=`<div>皇岗：家→口岸 ${hg} 分＋港段 ${rec?.huanggang??'待核对'} 分＋通关 ${settings.queueMin}–${settings.queueMax} 分＋路况预留 ${settings.trafficBuffer} 分。</div><div>莲塘：家→口岸 ${lt} 分＋港段 ${rec?.liantang??'待核对'} 分＋通关 ${settings.queueMin}–${settings.queueMax} 分＋路况预留 ${settings.trafficBuffer} 分。</div><div>驾车按跨境车直达计算；港段导航链接从港方口岸出发。普通网约车换乘的上下客、候车须另留时间。</div>`;
      if(TRAVEL.huanggangChange)html+=`<div>＊${esc(TRAVEL.huanggangChange.note)} <a href="${esc(TRAVEL.huanggangChange.sourceUrl)}" target="_blank" rel="noopener">运输署 ↗</a></div>`;
      if(rec?.mapLinks?.huanggangPublicTransport)html+=`<a class="route-link" href="${esc(rec.mapLinks.huanggangPublicTransport)}" target="_blank" rel="noopener">皇岗港段公共交通 ↗</a>　`;
      if(rec?.mapLinks?.liantangPublicTransport)html+=`<a class="route-link" href="${esc(rec.mapLinks.liantangPublicTransport)}" target="_blank" rel="noopener">莲塘港段公共交通 ↗</a>`;
    } else html+=`<div>直接驾车：路网估算 ${rec?.direct??'待核对'} 分＋路况预留 ${settings.trafficBuffer} 分；不含停车。原表简称暂按此校区查询，报名时请确认校区。</div>`;
    if(rec?.updateNote)html+=`<div>${esc(rec.updateNote)}</div>`;
    if(pt?.note)html+=`<div>${esc(pt.note)}</div>`;
    return html+'<div>查询于2026.10.10；路网与分段规划估算，非实时路况或实测排队。</div></details>';
  };
  window.schoolTravelSortMinutes=(s,settings)=>transit(s,settings)?.[0]??9999;
  window.schoolTravelCSV={headers:['出发地','公共交通总时间（规划）','皇岗驾车总时间（规划）','莲塘驾车总时间（规划）','通关预留（分钟）','驾车路况预留（分钟）','学校地址','时间说明'],values(s,settings){const rec=TRAVEL.schools[s.id];return ['翰岭院',minutes(transit(s,settings)),minutes(drive(s,'huanggang',settings)),s.region==='深圳'?'不经口岸':minutes(drive(s,'liantang',settings)),s.region==='深圳'?'不经口岸':`${settings.queueMin}–${settings.queueMax}`,settings.trafficBuffer,rec?.address??'',s.region==='深圳'?'深圳直达，学校简称匹配校区待确认':'规划估算，非实时排队。皇岗口岸交接后须重新导航。'];}};
  window.renderTravelSettings=settings=>{
    const holder=document.getElementById('travel-settings');holder.hidden=false;
    holder.innerHTML=`<strong>翰岭院出发</strong><span>总时间为估算</span><label>通关预留 <input id="queue-min" type="number" min="0" max="240" value="${settings.queueMin}" aria-label="通关预留下限">–<input id="queue-max" type="number" min="0" max="240" value="${settings.queueMax}" aria-label="通关预留上限"> 分</label><label>驾车路况预留 <input id="traffic-buffer" type="number" min="0" max="120" value="${settings.trafficBuffer}" aria-label="驾车路况预留"> 分</label><button id="update-travel" class="button small" type="button">更新</button>${TRAVEL.huanggangChange?'<span class="travel-warning">＊皇岗10/12换新口岸，旧路网时间待复核</span>':''}`;
  };
  document.addEventListener('click',event=>{if(event.target.id!=='update-travel')return;const value=id=>Number(document.getElementById(id).value), settings={queueMin:value('queue-min'),queueMax:value('queue-max'),trafficBuffer:value('traffic-buffer')};if(!Object.values(settings).every(Number.isInteger)||settings.queueMin<0||settings.queueMax>240||settings.queueMin>settings.queueMax||settings.trafficBuffer<0||settings.trafficBuffer>120){document.getElementById('queue-min').setCustomValidity('通关下限须小于上限；请输入合理的非负分钟数');document.getElementById('queue-min').reportValidity();return;}window.schoolNotebook.updateTravelSettings(settings);});
  const notes=document.getElementById('travel-source-notes');
  if(notes){notes.innerHTML=`<p>出行查询：2026.10.10。驾车为道路模型估算；默认通关30–60分钟、路况15分钟都是可调整的规划预留。公共交通按翰岭院→孖岭10号线→福田口岸→落马洲东铁线→到校分段估算，含步行、候车与通关。深圳学校直接从家到校，不绕口岸。</p><p>来源：<a href="https://data.gov.hk/tc-data/dataset/hk-edb-schinfo-school-location-and-information" target="_blank" rel="noopener">香港教育局校址</a> · <a href="https://data.gov.hk/tc-data/dataset/hk-immd-set9-immdcp" target="_blank" rel="noopener">入境处口岸位置</a> · <a href="https://project-osrm.org/docs/v5.24.0/api/" target="_blank" rel="noopener">OSRM路网模型</a> · <a href="https://www.mtr.com.hk/ch/customer/services/train_service_index.html" target="_blank" rel="noopener">港铁班距</a></p>${TRAVEL.huanggangChange?`<p>＊${esc(TRAVEL.huanggangChange.note)} <a href="${esc(TRAVEL.huanggangChange.sourceUrl)}" target="_blank" rel="noopener">运输署口岸安排 ↗</a></p>`:''}`;}
})();
