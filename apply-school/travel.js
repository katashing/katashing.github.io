'use strict';
(() => {
  const TRAVEL=window.TRAVEL_DATA;
  const huanggangPlanningNote=[TRAVEL.huanggangChange?.routeNote,TRAVEL.homeToHuanggangEstimate?.note].filter(Boolean).join(' ');
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const minutes=range=>range?`${range[0]===range[1]?range[0]:range.join('–')} 分`:'待核对';
  const timeMarkup=(range,tag='strong')=>`<${tag}${range?.[1]>50?' class="travel-over-limit" title="单程时间上限超过50分钟"':''}>${minutes(range)}</${tag}>`;
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
  function cell(label,range,note,link) { return `<td data-label="${esc(label)}" class="travel-cell">${timeMarkup(range)}${note?`<small class="travel-note">${esc(note)}</small>`:''}${link?`<a href="${esc(link)}" class="route-link" target="_blank" rel="noopener">导航 ↗</a>`:''}</td>`; }
  window.renderSchoolTravelCells=(s,settings)=>{
    const rec=TRAVEL.schools[s.id], pt=window.TRANSIT_DATA?.schools?.[s.id];
    const publicLink=rec?.mapLinks?.directPublicTransport??(rec?.coordinates?`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('深圳翰岭院')}&destination=${encodeURIComponent(rec.officialName+' '+rec.address)}&travelmode=transit`:null);
    const publicCell=cell('地铁 / 公交',transit(s,settings),'',publicLink);
    if(s.region==='深圳')return publicCell+cell('直接驾车',drive(s,'huanggang',settings),'深圳直达',rec?.mapLinks?.direct)+cell('莲塘驾车',null,'不经口岸',null).replace('<strong>待核对</strong>','<strong>—</strong>');
    return publicCell+cell('新皇岗驾车',drive(s,'huanggang',settings),'',rec?.mapLinks?.huanggang)+cell('莲塘驾车',drive(s,'liantang',settings),'',rec?.mapLinks?.liantang);
  };
  window.renderSchoolTravel=(s,settings)=>{
    const rec=TRAVEL.schools[s.id], pt=window.TRANSIT_DATA?.schools?.[s.id];
    const rows=[['地铁 / 公交',transit(s,settings)],...(s.region==='深圳'?[['直接驾车',drive(s,'huanggang',settings)]]:[['新皇岗驾车',drive(s,'huanggang',settings)],['莲塘驾车',drive(s,'liantang',settings)]])];
    let html=rows.map(([label,range])=>`<span class="route-summary"><b>${label}</b>　${timeMarkup(range,'span')}</span>`).join('');
    html+=`<details class="route-details"><summary>地址与路线</summary>`;
    if(rec?.officialName) html+=`<div>${esc(rec.officialName)}</div>`;
    if(rec?.address) html+=`<div>${esc(rec.address)} <a href="${esc(rec.addressSourceUrl??rec.sourceUrl)}" target="_blank" rel="noopener">校址 ↗</a></div>`;
    if(pt) html+=`<div>地铁／公交：${esc(pt.route??pt.shortRoute??'路线待确认')}</div>`;
    if(s.region!=='深圳') {
      html+='<div>驾车按跨境车直达估算；换乘车辆需另留候车时间。</div>';
      if(TRAVEL.huanggangChange) html+=`<div>${esc(huanggangPlanningNote||'皇岗按2026年10月12日新口岸规划估算。')} <a href="${esc(TRAVEL.huanggangChange.sourceUrl)}" target="_blank" rel="noopener">口岸安排 ↗</a></div>`;
    } else html+='<div>深圳学校直接到校，不经口岸；报名时请确认校区。</div>';
    if(rec?.updateNote) html+=`<div>${esc(rec.updateNote)}</div>`;
    return html+'</details>';
  };
  window.schoolTravelSortMinutes=(s,settings)=>transit(s,settings)?.[0]??9999;
  window.schoolTravelCSV={headers:['出发地','公共交通总时间（规划）','新皇岗驾车总时间（规划，深圳为直达）','莲塘驾车总时间（规划）','通关预留（分钟）','驾车路况预留（分钟）','学校地址','时间说明'],values(s,settings){const rec=TRAVEL.schools[s.id];return ['翰岭院',minutes(transit(s,settings)),minutes(drive(s,'huanggang',settings)),s.region==='深圳'?'不经口岸':minutes(drive(s,'liantang',settings)),s.region==='深圳'?'不经口岸':`${settings.queueMin}–${settings.queueMax}`,settings.trafficBuffer,rec?.address??'',s.region==='深圳'?'深圳直达，学校简称匹配校区待确认':(huanggangPlanningNote||'新皇岗规划估算，非实时路况或排队。')];}};
  window.renderTravelSettings=settings=>{
    const holder=document.getElementById('travel-settings');holder.hidden=false;
    holder.innerHTML=`<strong>翰岭院出发</strong><span>单程估算 · 香港含通关预留 ${settings.queueMin}–${settings.queueMax} 分</span><span>驾车路况预留 ${settings.trafficBuffer} 分</span><span>皇岗按10/12新口岸估算</span>`;
  };
  const notes=document.getElementById('travel-source-notes');
  if(notes){notes.innerHTML=`<p>翰岭院出发，公共交通经福田口岸；香港驾车分别经新皇岗、莲塘。时间为规划估算，含通关和路况预留。</p><p>${esc(huanggangPlanningNote)}</p><p><a href="https://data.gov.hk/tc-data/dataset/hk-edb-schinfo-school-location-and-information" target="_blank" rel="noopener">官方校址</a> · <a href="https://www.mtr.com.hk/ch/customer/services/train_service_index.html" target="_blank" rel="noopener">港铁资料</a> · <a href="https://www.td.gov.hk/tc/transport_in_hong_kong/land_based_cross_boundary_transport/athp/index.html" target="_blank" rel="noopener">口岸安排</a></p>`;}
})();
