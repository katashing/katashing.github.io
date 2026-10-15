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
  function publicJourney(s,settings) {
    const range=transit(s,settings), record=window.TRANSIT_DATA?.schools?.[s.id];
    if(!range)return {range:null,segments:[]};
    const local=record.segments?.length?record.segments:[{label:s.region==='深圳'?`翰岭院 → ${s.name}`:`落马洲站 → ${s.name}`,minutes:record.minutes??record.range}];
    const home=window.TRANSIT_DATA.homeToFutian?.minutes??window.TRANSIT_DATA.homeToFutian?.range??[29,48];
    return {range,segments:s.region==='深圳'?local:[
      {label:'翰岭院 → 福田口岸',minutes:home},
      {label:'福田口岸排队、通关',minutes:[settings.queueMin,settings.queueMax]},
      ...local
    ],roundingMinutes:s.region==='深圳'?record.roundingMinutes:5};
  }
  function drivingJourney(s,port,settings) {
    const range=drive(s,port,settings),record=TRAVEL.schools[s.id];
    if(!range)return {range:null,segments:[]};
    if(s.region==='深圳')return {range,segments:[
      {label:'翰岭院 → 学校',minutes:[record.direct,record.direct]},
      {label:'路况预留',minutes:[settings.trafficBuffer,settings.trafficBuffer]}
    ]};
    const portName=port==='huanggang'?'新皇岗口岸':'莲塘口岸';
    const home=TRAVEL.driveMinutes[port==='huanggang'?'homeToHuanggang':'homeToLiantang'];
    return {range,segments:[
      {label:`翰岭院 → ${portName}${port==='huanggang'?'（含接入预留）':''}`,minutes:[home,home]},
      {label:`${portName}排队、通关`,minutes:[settings.queueMin,settings.queueMax]},
      {label:`${portName}港方 → 学校`,minutes:[record[port],record[port]]},
      {label:'路况预留',minutes:[settings.trafficBuffer,settings.trafficBuffer]}
    ]};
  }
  const segmentText=journey=>journey.segments.length?journey.segments.map(part=>`${part.label}：${minutes(part.minutes)}`).join('；'):'待核对';
  function option(label,journey,link,linkLabel='导航 ↗') {
    const breakdown=journey.segments.length?`<dl class="travel-legs">${journey.segments.map(part=>`<div class="travel-leg"><dt>${esc(part.label)}</dt><dd>${minutes(part.minutes)}</dd></div>`).join('')}</dl>`:'';
    const rounding=journey.roundingMinutes?`<div class="travel-rounding">总时间向上取整至${journey.roundingMinutes}分钟</div>`:'';
    return `<div class="travel-option"><div class="travel-heading"><span class="travel-label">${esc(label)}</span>${link?`<a href="${esc(link)}" class="route-link" target="_blank" rel="noopener">${esc(linkLabel)}</a>`:''}</div><div class="travel-time"><span class="travel-total-label">总时间</span>${timeMarkup(journey.range)}</div>${breakdown}${rounding}</div>`;
  }
  function journeyOptions(s,settings) {
    const rec=TRAVEL.schools[s.id];
    const publicLink=rec?.mapLinks?.directPublicTransport??(rec?.coordinates?`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('深圳翰岭院')}&destination=${encodeURIComponent(rec.officialName+' '+rec.address)}&travelmode=transit`:null);
    const publicOption=option('地铁 / 公交',publicJourney(s,settings),publicLink);
    const driveOptions=s.region==='深圳'?option('直接驾车',drivingJourney(s,'huanggang',settings),rec?.mapLinks?.direct):option('新皇岗驾车',drivingJourney(s,'huanggang',settings),rec?.mapLinks?.huanggang,'港段导航 ↗')+option('莲塘驾车',drivingJourney(s,'liantang',settings),rec?.mapLinks?.liantang,'港段导航 ↗');
    return publicOption+driveOptions;
  }
  window.renderSchoolTravelCells=(s,settings)=>`<td data-label="翰岭院出行" class="travel-cell">${journeyOptions(s,settings)}</td>`;
  window.renderSchoolTravel=(s,settings)=>{
    const rec=TRAVEL.schools[s.id],pt=window.TRANSIT_DATA?.schools?.[s.id];
    let html=`<div class="travel-options-detail">${journeyOptions(s,settings)}</div>`;
    html+=`<details class="route-details"><summary>地址与路线依据</summary>`;
    if(rec?.officialName)html+=`<div>${esc(rec.officialName)}</div>`;
    if(rec?.address)html+=`<div>${esc(rec.address)} <a href="${esc(rec.addressSourceUrl??rec.sourceUrl)}" target="_blank" rel="noopener">校址 ↗</a></div>`;
    if(pt){html+=`<div>地铁／公交：${esc(pt.route??pt.shortRoute??'路线待确认')}</div>`;if(pt.note)html+=`<div>${esc(pt.note)}</div>`;}
    if(s.region!=='深圳') {
      html+='<div>驾车按跨境车直达估算；换乘车辆需另留候车时间。港段导航从口岸港方出发。</div>';
      if(TRAVEL.huanggangChange)html+=`<div>${esc(huanggangPlanningNote||'皇岗按2026年10月12日新口岸规划估算。')} <a href="${esc(TRAVEL.huanggangChange.sourceUrl)}" target="_blank" rel="noopener">口岸安排 ↗</a></div>`;
    }else html+='<div>深圳学校直接到校，不经口岸；报名时请确认校区。</div>';
    if(rec?.updateNote)html+=`<div>${esc(rec.updateNote)}</div>`;
    return html+'</details>';
  };
  window.schoolTravelSortMinutes=(s,settings)=>transit(s,settings)?.[0]??9999;
  window.schoolTravelCSV={headers:['出发地','公共交通总时间（规划）','新皇岗驾车总时间（规划，深圳为直达）','莲塘驾车总时间（规划）','通关预留（分钟）','驾车路况预留（分钟）','学校地址','时间说明','公共交通分段（规划）','新皇岗驾车分段（规划，深圳为直达）','莲塘驾车分段（规划）'],values(s,settings){const rec=TRAVEL.schools[s.id];return ['翰岭院',minutes(transit(s,settings)),minutes(drive(s,'huanggang',settings)),s.region==='深圳'?'不经口岸':minutes(drive(s,'liantang',settings)),s.region==='深圳'?'不经口岸':`${settings.queueMin}–${settings.queueMax}`,settings.trafficBuffer,rec?.address??'',s.region==='深圳'?'深圳直达，学校简称匹配校区待确认':(huanggangPlanningNote||'新皇岗规划估算，非实时路况或排队。'),segmentText(publicJourney(s,settings)),segmentText(drivingJourney(s,'huanggang',settings)),s.region==='深圳'?'不经口岸':segmentText(drivingJourney(s,'liantang',settings))];}};
  window.renderTravelSettings=settings=>{
    const holder=document.getElementById('travel-settings');holder.hidden=false;
    holder.innerHTML=`<strong>翰岭院出发</strong><span>单程估算 · 香港含通关预留 ${settings.queueMin}–${settings.queueMax} 分</span><span>驾车路况预留 ${settings.trafficBuffer} 分</span><span>皇岗按10/12新口岸估算</span>`;
  };
  const notes=document.getElementById('travel-source-notes');
  if(notes){notes.innerHTML=`<p>翰岭院出发，右侧依次列总时间与各段用时，均为规划估算，含通关和路况预留。公共交通经福田口岸；香港驾车分别经新皇岗、莲塘，港段导航从口岸港方出发。公共交通明细由既有路线估算拆分，老师原文独立保留。</p><p>${esc(huanggangPlanningNote)}</p><p><a href="https://data.gov.hk/tc-data/dataset/hk-edb-schinfo-school-location-and-information" target="_blank" rel="noopener">官方校址</a> · <a href="https://www.mtr.com.hk/ch/customer/services/train_service_index.html" target="_blank" rel="noopener">港铁资料</a> · <a href="https://www.td.gov.hk/tc/transport_in_hong_kong/land_based_cross_boundary_transport/athp/index.html" target="_blank" rel="noopener">口岸安排</a></p>`;}
})();
