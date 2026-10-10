/*
 * 香港 schools.minutes 是港方规划用时：落马洲港铁进站、候车、
 * 乘车及学校末段；不含 homeToFutian 和排队通关。
 * 深圳 schools.minutes 是从翰岭院出发的整程规划用时。
 * 各范围均为分段规划估算，不是实时导航或实际通勤记录。
 */
window.TRANSIT_DATA = {
  checkedAt: "2026-10-10",
  homeToFutian: {
    minutes: [29, 48],
    route: "翰岭院步行至孖岭站 → 深圳地铁10号线往福田口岸 → 步行至口岸查验大堂。含步行、进站候车、地铁及到查验大堂的步行；不含排队通关。"
  },
  schools: {
    tp01: {
      minutes: [34, 58],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至大埔旧墟公立学校（宝湖道）。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：港铁进站3–5分、候车0–14分、车内19–22分；末段按老师约12分步行估算并留5分弹性，需实测。"
    },
    tp02: {
      minutes: [47, 106],
      route: "落马洲站东铁线 → 大埔墟站 → 转九巴74K至香港教育大学 → 校园内步行至赛马会小学。上课日早繁另可查询75F特快班次。",
      shortRoute: "福田口岸 · 大埔墟 · 74K接驳",
      note: "规划估算。学校在大埔露屏路10号香港教育大学校园内；原表“太和站步行15分”不适用。东铁车内19–22分，另计进站候车；大埔墟后的换车、候车、车内及校园步行合计预留25–65分。74K上午先到教大，下午绕行次序不同；校车或75F班次需按上课日核对。"
    },
    tp03: {
      minutes: [32, 56],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至保良局田家炳小学（千禧）。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段沿用老师约10分步行并留5分弹性，未导航实测。"
    },
    tp04: {
      minutes: [30, 54],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至大埔旧墟公立学校。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段沿用老师约8分步行并留5分弹性，需核对校门与步行路线。"
    },
    tp05: {
      minutes: [32, 56],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至圣公会阮郑梦芹小学。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段按老师约10分步行并留5分弹性，待实测。"
    },
    tp06: {
      minutes: [37, 61],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至港九街坊妇女会孙方中小学。也可查询富善方向接驳巴士。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段按老师约15分步行并留5分弹性，待实测。改坐巴士需另计候车。"
    },
    tp07: {
      minutes: [30, 54],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至大埔循道卫理小学。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段按老师约8分步行并留5分弹性，待实测。"
    },
    tp08: {
      minutes: [30, 54],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至大埔崇德黄建常纪念学校。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段按老师约8分步行并留5分弹性，待实测。"
    },
    tp09: {
      minutes: [34, 58],
      route: "落马洲站东铁线 → 大埔墟站 → 步行至圣公会阮郑梦芹银禧小学。",
      shortRoute: "福田口岸 · 东铁至大埔墟 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁19–22分；末段按老师约12分步行并留5分弹性，待实测。"
    },
    tp10: {
      minutes: [38, 83],
      route: "落马洲站东铁线 → 大埔墟站 → 港铁接驳巴士K17至富善 → 步行至富善邨第二期第二校舍。",
      shortRoute: "福田口岸 · 大埔墟 · K17至富善",
      note: "规划估算，按2026/27学年富善邨新校舍，不用宏福苑旧址。东铁19–22分，进站与东铁候车另计；末段预留换车3–5分、巴士候车0–12分、车内8–15分、步行5–10分。新校舍校门步行与K17当天班次需实测核对。"
    },
    tp11: {
      minutes: [30, 54],
      route: "落马洲站东铁线 → 太和站 → 步行至林村公立黄福銮纪念学校。",
      shortRoute: "福田口岸 · 东铁至太和 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁17–20分；末段按老师约10分步行并留5分弹性，待实测。"
    },
    north01: {
      minutes: [21, 44],
      route: "落马洲站东铁线 → 上水站 → 步行至李志达纪念学校。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约10分步行并留5分弹性，待实测。原表上水车内5分偏短。"
    },
    north02: {
      minutes: [21, 44],
      route: "落马洲站东铁线 → 上水站 → 步行至香海正觉莲社佛教正慧小学。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约10分步行并留5分弹性，待实测。"
    },
    north03: {
      minutes: [24, 47],
      route: "落马洲站东铁线 → 粉岭站 → 步行至圣公会嘉福荣真小学。",
      shortRoute: "福田口岸 · 东铁至粉岭 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁11–13分；末段按老师约10分步行并留5分弹性，待实测。原表粉岭车内7分偏短。"
    },
    north04: {
      minutes: [22, 45],
      route: "落马洲站东铁线 → 粉岭站 → 步行至五旬节靳茂生小学。",
      shortRoute: "福田口岸 · 东铁至粉岭 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁11–13分；末段按老师约8分步行并留5分弹性，待实测。"
    },
    north05: {
      minutes: [24, 47],
      route: "落马洲站东铁线 → 粉岭站 → 步行至五旬节于良发小学。",
      shortRoute: "福田口岸 · 东铁至粉岭 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁11–13分；末段按老师约10分步行并留5分弹性，待实测。"
    },
    north06: {
      minutes: [21, 44],
      route: "落马洲站东铁线 → 上水站 → 步行至东华三院马锦灿纪念小学。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约10分步行并留5分弹性，待实测及核对已选原名对应校舍。"
    },
    north07: {
      minutes: [21, 44],
      route: "落马洲站东铁线 → 上水站 → 步行至上水惠州公立学校。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约10分步行并留5分弹性，待实测及核对已选原名对应校舍。"
    },
    north08: {
      minutes: [23, 46],
      route: "落马洲站东铁线 → 上水站 → 步行至凤溪第一小学。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约12分步行并留5分弹性，待实测。"
    },
    north09: {
      minutes: [21, 44],
      route: "落马洲站东铁线 → 上水站 → 步行至石湖墟公立学校。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约10分步行并留5分弹性，待实测。"
    },
    north10: {
      minutes: [22, 45],
      route: "落马洲站东铁线 → 粉岭站 → 步行至粉岭官立小学。",
      shortRoute: "福田口岸 · 东铁至粉岭 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁11–13分；末段按老师约8分步行并留5分弹性，待实测。"
    },
    north11: {
      minutes: [23, 46],
      route: "落马洲站东铁线 → 上水站 → 步行至育贤学校。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约12分步行并留5分弹性，待实测。"
    },
    north12: {
      minutes: [23, 46],
      route: "落马洲站东铁线 → 上水站 → 步行至凤溪创新小学。",
      shortRoute: "福田口岸 · 东铁至上水 · 步行",
      note: "规划估算：进站3–5分、候车0–14分、东铁8–10分；末段按老师约12分步行并留5分弹性，待实测。"
    },
    north13: {
      minutes: [26, 64],
      route: "落马洲站东铁线 → 上水站 → 转巴士或校车往金钱村何东学校。具体线路及校车站需向学校核对。",
      shortRoute: "福田口岸 · 上水 · 巴士/校车接驳",
      note: "规划估算：进站3–5分、东铁候车0–14分、东铁8–10分；原表校端巴士/校车约10–15分，另外预留换车及步行5–10分、候车0–10分。学校班车不能视为随到随走，需核对班次。"
    },
    "hk-extra01": {
      minutes: [43, 77],
      route: "落马洲站东铁线 → 大围站 → 步行至新界沙田美林邨第三小学的宣道会陈元喜小学。",
      shortRoute: "福田口岸 · 东铁至大围 · 美林邨步行",
      note: "规划估算，按现美林邨校舍。进站3–5分、候车0–14分、东铁车内预留30–38分、校端步行10–20分；末段未经现场实测。原表仅写陈元喜小学，仍需核对全名与校舍。"
    },
    sz01: {
      minutes: [25, 50],
      route: "翰岭院步行至翰岭站 → 深圳地铁6号线往松岗至深圳北站 → 出站步行至龙华区致远北路1号培侨信义学校。",
      shortRoute: "翰岭 · 6号线至深圳北 · 步行",
      note: "深圳整程规划估算，不加口岸或通关。按官网龙华信义学校校址暂匹配原表简称；步行5–10分、进站候车3–8分、地铁车内7–12分、深圳北站到校步行10–20分，范围取整。具体出入口与校门需导航核对，未实测。"
    },
    sz02: {
      minutes: [75, 120],
      route: "翰岭院步行至翰岭站 → 深圳地铁6号线至深圳北站 → 换5号线往赤湾至赤湾站 → 步行至赤湾五路55号南山中英文学校。",
      shortRoute: "翰岭 · 6号线转5号线至赤湾",
      note: "深圳整程规划估算，不加口岸或通关。按政府公布的赤湾新校址；步行与进站候车约8–18分、6号线车内7–12分、换乘与候车5–12分、5号线长距离车内约45–55分、校端步行10–20分，范围取整。不是实时导航或实测时间，需核对赤湾出入口和校门。"
    },
    sz03: {
      minutes: [24, 42],
      route: "翰岭院步行至孖岭站 → 深圳地铁9号线往前湾至梅景站 → 步行至北环大道7010号普林云海港人子弟学校。",
      shortRoute: "孖岭 · 9号线至梅景 · 步行",
      note: "深圳整程规划估算，不加口岸或通关。按官网福田教学点，未采用集团其他校区；步行至孖岭8–12分、进站候车3–8分、地铁车内8–12分、校端步行5–10分。官方校址已核对，时间未实测。"
    }
  },
  sources: [
    { title: "深圳交通运输局：现行地铁线路与换乘站", url: "https://jtys.sz.gov.cn/jtzx/wycx/dtcx/dtxl/content/post_12601089.html" },
    { title: "深圳地铁10号线公开时刻表（旧版，仅辅助估算车内时间；以当前行程查询为准）", url: "https://www.szmc.net/szmc_enm/Time_Table/Line10/202008/83392.html" },
    { title: "深圳地铁：路线、时间与票价查询", url: "https://www.szmc.net/shentieyunying/yunyingfuwu/chengchezhiyin/" },
    { title: "港铁：列车班次与服务时间（落马洲支线早繁9–14分钟一班；清晨可达21分钟）", url: "https://www.mtr.com.hk/ch/customer/services/train_service_index.html" },
    { title: "港铁：铁路行程指南", url: "https://www.mtr.com.hk/ch/customer/jp/index.php" },
    { title: "港铁：网络与车站街道图", url: "https://www.mtr.com.hk/ch/customer/services/system_map.html" },
    { title: "香港运输署：福田对应落马洲支线管制站交通", url: "https://www.td.gov.hk/tc/transport_in_hong_kong/land_based_cross_boundary_transport/access_to_lok_ma_chau_spur_line_control_point/" },
    { title: "Rome2Rio：落马洲至上水车内约8分钟（辅助来源，不含通关）", url: "https://www.rome2rio.com/s/Futian-Checkpoint/Sheung-Shui" },
    { title: "Rome2Rio：粉岭至落马洲车内约11分钟（辅助来源）", url: "https://www.rome2rio.com/s/Fanling/Futian-Checkpoint" },
    { title: "Rome2Rio：页面实际铁路终点为太和，车内约17分钟（只采用此分段）", url: "https://www.rome2rio.com/s/Futian-Checkpoint/Tai-Po-Market-Station" },
    { title: "Rome2Rio：落马洲至大埔墟车内约19分钟（辅助来源）", url: "https://www.rome2rio.com/s/Shenzhen/Fu-Shin-Estate" },
    { title: "香港教育大学：交通地图与74K接驳", url: "https://www.eduhk.hk/zht/page/detail/2795" },
    { title: "香港教育大学：校园地址及74K上午、下午行车次序", url: "https://www.eduhk.hk/re/student_handbook/tc/Maps-Of-The-University-Campuses.html" },
    { title: "香港教育大学赛马会小学：官方地址大埔露屏路10号", url: "https://www.edujcps.edu.hk/CustomPage/58/JCPS_57.pdf" },
    { title: "九巴：2026年9月开办75F教大早繁特快", url: "https://e.kmb.hk/news_detail.html?id=1377&year=2026" },
    { title: "大埔浸信会公立学校：富善邨新校舍", url: "https://www.tpbps.edu.hk/node/2176" },
    { title: "香港政府：2026/27学年使用富善邨校舍", url: "https://www.info.gov.hk/gia/general/202512/20/P2025122000246.htm" },
    { title: "香港政府：2026年8月富善邨新校舍开幕", url: "https://www.info.gov.hk/gia/general/202608/29/P2026082800384p.htm" },
    { title: "港铁：K17大埔墟至富善接驳巴士", url: "https://www.mtr.com.hk/ch/customer/services/searchBusRouteDetails.php?routeID=K17" },
    { title: "康文署富亨体育馆交通：K17约5–12分钟一班", url: "https://www.lcsd.gov.hk/clpss/sc/webApp/Facility/Details.do?did=12&fcid=9&ftid=0" },
    { title: "宣道会陈元喜小学官网（原表简称暂对应美林邨校舍）", url: "https://www.cahcc.edu.hk" },
    { title: "培侨信义学校：龙华区致远北路1号", url: "https://www.puikiuxinyi.com/contact/" },
    { title: "深圳政府：南山中英文学校赤湾五路55号", url: "https://www.sz.gov.cn/school/ns/mbxx/content/post_11281737.html" },
    { title: "普林云海港人子弟学校：福田区北环大道7010号", url: "https://www.psis.cn/contact" },
    { title: "普林云海地图位置与梅景站（辅助来源）", url: "https://mapcarta.com/W1243990465" },
    { title: "皇岗备选交通查询：2026年10月12日06:30起新旧口岸交接，应使用新口岸资料", url: "https://www.td.gov.hk/tc/transport_in_hong_kong/land_based_cross_boundary_transport/athp/index.html" },
    { title: "新皇岗B12接驳：经新田、广福邨，未将其当作上水日间直达", url: "https://nlb.com.hk/route/detail/118" },
    { title: "莲塘／香园围备选交通查询：07:00–22:00，B7与59S接驳北区", url: "https://www.td.gov.hk/tc/transport_in_hong_kong/land_based_cross_boundary_transport/access_to_heung_yuen_wai_control_point/" },
    { title: "香港运输署：B7现行加强班次（含上课日）", url: "https://www.td.gov.hk/filemanager/tc/content_13/Traffic%20Advice_CTB%20B7_2025.04.29%201655_Chi.pdf" }
  ]
};
