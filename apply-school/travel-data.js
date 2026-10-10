// Sources and routing were checked on 2026-10-10. Durations exclude border clearance and traffic.
window.TRAVEL_DATA = {
  "checkedAt": "2026-10-10",
  "method": "OSRM 汽车路网分段估算；使用香港教育局学校坐标及香港入境处口岸坐标；不含实时路况、排队、边检检查、步行、停车、上下客与口岸内部接驳时间。",
  "rounding": "路线秒数换算为分钟后，向上取整至5分钟。",
  "hasLiveTraffic": false,
  "hasBorderQueueData": false,
  "originHanlingyuan": {
    "name": "翰岭院",
    "address": "深圳市福田区梅东二路2号",
    "coordinates": [
      114.06369389,
      22.57485284
    ],
    "longitude": 114.06369389,
    "latitude": 22.57485284,
    "coordinateSystem": "WGS84",
    "sourceCoordinateSystem": "GCJ-02",
    "sourceCoordinates": [
      114.068816,
      22.572148
    ],
    "sourceUrl": "https://www.amap.com/place/B02F37VNB9"
  },
  "origins": {
    "huanggangShenzhen": {
      "name": "皇岗口岸（深圳侧）",
      "address": "深圳市福田区福田南路与百合路交叉口南420米",
      "coordinates": [
        114.07232911,
        22.52234021
      ],
      "longitude": 114.07232911,
      "latitude": 22.52234021,
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "GCJ-02",
      "sourceCoordinates": [
        114.077454,
        22.519643
      ],
      "sourceUrl": "https://www.amap.com/place/B0I32HLGAJ"
    },
    "liantangShenzhen": {
      "name": "莲塘口岸（深圳侧旅检楼抵达点）",
      "address": "莲塘口岸公交首末站：旅检楼负一层附近",
      "coordinates": [
        114.15320256,
        22.55589916
      ],
      "longitude": 114.15320256,
      "latitude": 22.55589916,
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "GCJ-02",
      "sourceCoordinates": [
        114.158228,
        22.553163
      ],
      "sourceUrl": "https://www.amap.com/place/BV11444126",
      "coordinateNote": "用口岸负一层公交首末站POI作为深圳侧抵达规划点，非指定跨境私家车车道。位置与抵达方式应在导航复核。"
    },
    "huanggangHongKong": {
      "name": "落马洲管制站（皇岗港方）",
      "address": "落马洲管制站",
      "coordinates": [
        114.07404556,
        22.50937751
      ],
      "longitude": 114.07404556,
      "latitude": 22.50937751,
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "WGS84",
      "sourceCoordinates": [
        114.07404556,
        22.50937751
      ],
      "sourceUrl": "https://portal.csdi.gov.hk/server/rest/services/common/immd_rcd_1633320081376_19895/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
    },
    "liantangHongKong": {
      "name": "香园围管制站（莲塘港方）",
      "address": "新界香园围管制站",
      "coordinates": [
        114.15385221,
        22.55278148
      ],
      "longitude": 114.15385221,
      "latitude": 22.55278148,
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "WGS84",
      "sourceCoordinates": [
        114.15385221,
        22.55278148
      ],
      "sourceUrl": "https://portal.csdi.gov.hk/server/rest/services/common/immd_rcd_1633320081376_19895/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
    }
  },
  "driveMinutes": {
    "homeToHuanggang": 10,
    "homeToLiantang": 15
  },
  "driveSeconds": {
    "homeToHuanggang": 515.5,
    "homeToLiantang": 732.8
  },
  "driveDistanceMeters": {
    "homeToHuanggang": 7696.6,
    "homeToLiantang": 14556.1
  },
  "schools": {
    "tp01": {
      "officialName": "大埔舊墟公立學校(寶湖道)",
      "englishName": "TAI PO OLD MARKET PUBLIC SCHOOL (PLOVER COVE)",
      "address": "新界大埔寶湖道7號",
      "website": "http://www.tpompspc.edu.hk",
      "phone": "26652333",
      "coordinates": [
        114.17036538,
        22.44877997
      ],
      "longitude": 114.17036538,
      "latitude": 22.44877997,
      "coordinateSystem": "WGS84",
      "schoolNo": "543225000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 959.9,
        "liantang": 1032.4
      },
      "driveDistanceMeters": {
        "huanggang": 15703,
        "liantang": 15956.2
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.44877997%2C114.17036538&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E8%88%8A%E5%A2%9F%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1%28%E5%AF%B6%E6%B9%96%E9%81%93%29+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AF%B6%E6%B9%96%E9%81%937%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.44877997%2C114.17036538&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E8%88%8A%E5%A2%9F%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1%28%E5%AF%B6%E6%B9%96%E9%81%93%29+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AF%B6%E6%B9%96%E9%81%937%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 36.1
    },
    "tp02": {
      "officialName": "香港教育大學賽馬會小學",
      "englishName": "THE EDUCATION UNIVERSITY OF HONG KONG JOCKEY CLUB PRIMARY SCHOOL",
      "address": "新界大埔露屏路10號香港教育大學",
      "website": "http://www.edujcps.edu.hk",
      "phone": "29481122",
      "coordinates": [
        114.19449024,
        22.46965751
      ],
      "longitude": 114.19449024,
      "latitude": 22.46965751,
      "coordinateSystem": "WGS84",
      "schoolNo": "542580000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 25,
      "liantang": 25,
      "driveSeconds": {
        "huanggang": 1320.7,
        "liantang": 1393.2
      },
      "driveDistanceMeters": {
        "huanggang": 19345.3,
        "liantang": 19598.5
      },
      "travelNote": "学校位于香港教育大学露屏路校区，老师图中太和站+15分钟步行路线与官方地址不吻合，应重新导航，勿直接采用老师步行时间。",
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.46965751%2C114.19449024&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E5%A4%A7%E5%AD%B8%E8%B3%BD%E9%A6%AC%E6%9C%83%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E9%9C%B2%E5%B1%8F%E8%B7%AF10%E8%99%9F%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E5%A4%A7%E5%AD%B8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.46965751%2C114.19449024&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E5%A4%A7%E5%AD%B8%E8%B3%BD%E9%A6%AC%E6%9C%83%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E9%9C%B2%E5%B1%8F%E8%B7%AF10%E8%99%9F%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E5%A4%A7%E5%AD%B8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 31.8
    },
    "tp03": {
      "officialName": "保良局田家炳千禧小學",
      "englishName": "PO LEUNG KUK TIN KA PING MILLENNIUM PRIMARY SCHOOL",
      "address": "新界大埔大埔公路大埔滘段4641號",
      "website": "http://www.plktkpmps.edu.hk",
      "phone": "26505551",
      "coordinates": [
        114.19602979,
        22.43075416
      ],
      "longitude": 114.19602979,
      "latitude": 22.43075416,
      "coordinateSystem": "WGS84",
      "schoolNo": "543284000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 25,
      "liantang": 25,
      "driveSeconds": {
        "huanggang": 1272.4,
        "liantang": 1344.9
      },
      "driveDistanceMeters": {
        "huanggang": 21073.8,
        "liantang": 21327
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.43075416%2C114.19602979&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%BF%9D%E8%89%AF%E5%B1%80%E7%94%B0%E5%AE%B6%E7%82%B3%E5%8D%83%E7%A6%A7%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%A4%A7%E5%9F%94%E5%85%AC%E8%B7%AF%E5%A4%A7%E5%9F%94%E6%BB%98%E6%AE%B54641%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.43075416%2C114.19602979&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%BF%9D%E8%89%AF%E5%B1%80%E7%94%B0%E5%AE%B6%E7%82%B3%E5%8D%83%E7%A6%A7%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%A4%A7%E5%9F%94%E5%85%AC%E8%B7%AF%E5%A4%A7%E5%9F%94%E6%BB%98%E6%AE%B54641%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 47.8
    },
    "tp04": {
      "officialName": "大埔舊墟公立學校",
      "englishName": "TAI PO OLD MARKET PUBLIC SCHOOL",
      "address": "新界大埔安祥路10號",
      "website": "http://www.tpomps.edu.hk",
      "phone": "26654610",
      "coordinates": [
        114.1669455,
        22.45175984
      ],
      "longitude": 114.1669455,
      "latitude": 22.45175984,
      "coordinateSystem": "WGS84",
      "schoolNo": "113328000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 941.9,
        "liantang": 1014.4
      },
      "driveDistanceMeters": {
        "huanggang": 15329.3,
        "liantang": 15582.5
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.45175984%2C114.1669455&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E8%88%8A%E5%A2%9F%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AE%89%E7%A5%A5%E8%B7%AF10%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.45175984%2C114.1669455&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E8%88%8A%E5%A2%9F%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AE%89%E7%A5%A5%E8%B7%AF10%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 14.3
    },
    "tp05": {
      "officialName": "聖公會阮鄭夢芹小學",
      "englishName": "S.K.H. YUEN CHEN MAUN CHEN PRIMARY SCHOOL",
      "address": "新界大埔廣福邨",
      "website": "http://www.skhycmcps.edu.hk",
      "phone": "26589222",
      "coordinates": [
        114.17314389,
        22.44736227
      ],
      "longitude": 114.17314389,
      "latitude": 22.44736227,
      "coordinateSystem": "WGS84",
      "schoolNo": "114995000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 983.7,
        "liantang": 1056.2
      },
      "driveDistanceMeters": {
        "huanggang": 16116.8,
        "liantang": 16370
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.44736227%2C114.17314389&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%81%96%E5%85%AC%E6%9C%83%E9%98%AE%E9%84%AD%E5%A4%A2%E8%8A%B9%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%BB%A3%E7%A6%8F%E9%82%A8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.44736227%2C114.17314389&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%81%96%E5%85%AC%E6%9C%83%E9%98%AE%E9%84%AD%E5%A4%A2%E8%8A%B9%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%BB%A3%E7%A6%8F%E9%82%A8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 89.1
    },
    "tp06": {
      "officialName": "港九街坊婦女會孫方中小學",
      "englishName": "HONG KONG AND KOWLOON KAIFONG WOMEN'S ASSOCIATION SUN FONG CHUNG PRIMARY SCHOOL",
      "address": "新界大埔第十七區富善邨屋邨小學第三校舍",
      "website": "http://www.sfc.edu.hk",
      "phone": "26618896",
      "coordinates": [
        114.17746703,
        22.45385521
      ],
      "longitude": 114.17746703,
      "latitude": 22.45385521,
      "coordinateSystem": "WGS84",
      "schoolNo": "115290000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 996.1,
        "liantang": 1068.6
      },
      "driveDistanceMeters": {
        "huanggang": 16469.6,
        "liantang": 16722.8
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.45385521%2C114.17746703&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%B8%AF%E4%B9%9D%E8%A1%97%E5%9D%8A%E5%A9%A6%E5%A5%B3%E6%9C%83%E5%AD%AB%E6%96%B9%E4%B8%AD%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E7%AC%AC%E5%8D%81%E4%B8%83%E5%8D%80%E5%AF%8C%E5%96%84%E9%82%A8%E5%B1%8B%E9%82%A8%E5%B0%8F%E5%AD%B8%E7%AC%AC%E4%B8%89%E6%A0%A1%E8%88%8D&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.45385521%2C114.17746703&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%B8%AF%E4%B9%9D%E8%A1%97%E5%9D%8A%E5%A9%A6%E5%A5%B3%E6%9C%83%E5%AD%AB%E6%96%B9%E4%B8%AD%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E7%AC%AC%E5%8D%81%E4%B8%83%E5%8D%80%E5%AF%8C%E5%96%84%E9%82%A8%E5%B1%8B%E9%82%A8%E5%B0%8F%E5%AD%B8%E7%AC%AC%E4%B8%89%E6%A0%A1%E8%88%8D&travelmode=transit"
      },
      "roadSnapDistanceMeters": 47.3
    },
    "tp07": {
      "officialName": "大埔循道衛理小學",
      "englishName": "TAI PO METHODIST SCHOOL",
      "address": "新界大埔棟樑路10號",
      "website": "http://www.tpms.edu.hk",
      "phone": "26622011",
      "coordinates": [
        114.17519361,
        22.45659143
      ],
      "longitude": 114.17519361,
      "latitude": 22.45659143,
      "coordinateSystem": "WGS84",
      "schoolNo": "115703000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 1030.3,
        "liantang": 1102.8
      },
      "driveDistanceMeters": {
        "huanggang": 16276.3,
        "liantang": 16529.5
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.45659143%2C114.17519361&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E5%BE%AA%E9%81%93%E8%A1%9B%E7%90%86%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E6%A3%9F%E6%A8%91%E8%B7%AF10%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.45659143%2C114.17519361&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E5%BE%AA%E9%81%93%E8%A1%9B%E7%90%86%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E6%A3%9F%E6%A8%91%E8%B7%AF10%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 30.3
    },
    "tp08": {
      "officialName": "大埔崇德黃建常紀念學校",
      "englishName": "SUNG TAK WONG KIN SHEUNG MEMORIAL SCHOOL",
      "address": "新界大埔東昌街",
      "website": "http://www.wks.edu.hk",
      "phone": "26535565",
      "coordinates": [
        114.16937444,
        22.44892441
      ],
      "longitude": 114.16937444,
      "latitude": 22.44892441,
      "coordinateSystem": "WGS84",
      "schoolNo": "115126000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 946.8,
        "liantang": 1019.3
      },
      "driveDistanceMeters": {
        "huanggang": 15577.7,
        "liantang": 15830.9
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.44892441%2C114.16937444&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E5%B4%87%E5%BE%B7%E9%BB%83%E5%BB%BA%E5%B8%B8%E7%B4%80%E5%BF%B5%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E6%9D%B1%E6%98%8C%E8%A1%97&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.44892441%2C114.16937444&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E5%B4%87%E5%BE%B7%E9%BB%83%E5%BB%BA%E5%B8%B8%E7%B4%80%E5%BF%B5%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E6%9D%B1%E6%98%8C%E8%A1%97&travelmode=transit"
      },
      "roadSnapDistanceMeters": 44.0
    },
    "tp09": {
      "officialName": "聖公會阮鄭夢芹銀禧小學",
      "englishName": "S.K.H. YUEN CHEN MAUN CHEN JUBILEE PRIMARY SCHOOL",
      "address": "新界大埔富亨邨第四期第八區屋邨小學",
      "website": "http://www.skhycmcj.edu.hk",
      "phone": "26660606",
      "coordinates": [
        114.1723566,
        22.45945402
      ],
      "longitude": 114.1723566,
      "latitude": 22.45945402,
      "coordinateSystem": "WGS84",
      "schoolNo": "575844000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 1042.8,
        "liantang": 1115.3
      },
      "driveDistanceMeters": {
        "huanggang": 16308.9,
        "liantang": 16562.1
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.45945402%2C114.1723566&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%81%96%E5%85%AC%E6%9C%83%E9%98%AE%E9%84%AD%E5%A4%A2%E8%8A%B9%E9%8A%80%E7%A6%A7%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AF%8C%E4%BA%A8%E9%82%A8%E7%AC%AC%E5%9B%9B%E6%9C%9F%E7%AC%AC%E5%85%AB%E5%8D%80%E5%B1%8B%E9%82%A8%E5%B0%8F%E5%AD%B8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.45945402%2C114.1723566&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%81%96%E5%85%AC%E6%9C%83%E9%98%AE%E9%84%AD%E5%A4%A2%E8%8A%B9%E9%8A%80%E7%A6%A7%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AF%8C%E4%BA%A8%E9%82%A8%E7%AC%AC%E5%9B%9B%E6%9C%9F%E7%AC%AC%E5%85%AB%E5%8D%80%E5%B1%8B%E9%82%A8%E5%B0%8F%E5%AD%B8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 28.8
    },
    "tp10": {
      "officialName": "大埔浸信會公立學校",
      "englishName": "TAI PO BAPTIST PUBLIC SCHOOL",
      "address": "新界大埔富善邨第二期屋邨小学第二校舍",
      "website": "https://www.tpbps.edu.hk/",
      "phone": "26563933",
      "coordinates": [
        114.17678289,
        22.4553534
      ],
      "longitude": 114.17678289,
      "latitude": 22.4553534,
      "coordinateSystem": "WGS84",
      "schoolNo": "114855000423",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 20,
      "liantang": 25,
      "driveSeconds": {
        "huanggang": 1161.7,
        "liantang": 1234.2
      },
      "driveDistanceMeters": {
        "huanggang": 16666.7,
        "liantang": 16919.9
      },
      "addressNote": "2026/27学年已迁入富善邨新校舍；不采用旧广福邨及已到期临时校址。",
      "additionalSources": [
        "https://www.info.gov.hk/gia/general/202608/29/P2026082800375.htm",
        "https://www.tpbps.edu.hk/"
      ],
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.4553534%2C114.17678289&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E6%B5%B8%E4%BF%A1%E6%9C%83%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AF%8C%E5%96%84%E9%82%A8%E7%AC%AC%E4%BA%8C%E6%9C%9F%E5%B1%8B%E9%82%A8%E5%B0%8F%E5%AD%A6%E7%AC%AC%E4%BA%8C%E6%A0%A1%E8%88%8D&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.4553534%2C114.17678289&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E5%A4%A7%E5%9F%94%E6%B5%B8%E4%BF%A1%E6%9C%83%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%AF%8C%E5%96%84%E9%82%A8%E7%AC%AC%E4%BA%8C%E6%9C%9F%E5%B1%8B%E9%82%A8%E5%B0%8F%E5%AD%A6%E7%AC%AC%E4%BA%8C%E6%A0%A1%E8%88%8D&travelmode=transit"
      },
      "roadSnapDistanceMeters": 27.1
    },
    "tp11": {
      "officialName": "林村公立黃福鑾紀念學校",
      "englishName": "LAM TSUEN PUBLIC WONG FOOK LUEN MEMORIAL SCHOOL",
      "address": "新界大埔太和邨第一期屋邨第一小學",
      "website": "http://www.wfl.edu.hk",
      "phone": "26503355",
      "coordinates": [
        114.16339959,
        22.45056757
      ],
      "longitude": 114.16339959,
      "latitude": 22.45056757,
      "coordinateSystem": "WGS84",
      "schoolNo": "115401000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 15,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 893.8,
        "liantang": 966.3
      },
      "driveDistanceMeters": {
        "huanggang": 14826.1,
        "liantang": 15079.3
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.45056757%2C114.16339959&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%9E%97%E6%9D%91%E5%85%AC%E7%AB%8B%E9%BB%83%E7%A6%8F%E9%91%BE%E7%B4%80%E5%BF%B5%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%A4%AA%E5%92%8C%E9%82%A8%E7%AC%AC%E4%B8%80%E6%9C%9F%E5%B1%8B%E9%82%A8%E7%AC%AC%E4%B8%80%E5%B0%8F%E5%AD%B8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.45056757%2C114.16339959&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%9E%97%E6%9D%91%E5%85%AC%E7%AB%8B%E9%BB%83%E7%A6%8F%E9%91%BE%E7%B4%80%E5%BF%B5%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E5%A4%A7%E5%9F%94%E5%A4%AA%E5%92%8C%E9%82%A8%E7%AC%AC%E4%B8%80%E6%9C%9F%E5%B1%8B%E9%82%A8%E7%AC%AC%E4%B8%80%E5%B0%8F%E5%AD%B8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 17.7
    },
    "north01": {
      "officialName": "李志達紀念學校",
      "englishName": "LEE CHI TAT MEMORIAL SCHOOL",
      "address": "新界上水石湖墟天平路30號",
      "website": "http://www.lctms.edu.hk",
      "phone": "26738581",
      "coordinates": [
        114.13110754,
        22.50714623
      ],
      "longitude": 114.13110754,
      "latitude": 22.50714623,
      "coordinateSystem": "WGS84",
      "schoolNo": "115681000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 557.6,
        "liantang": 737.1
      },
      "driveDistanceMeters": {
        "huanggang": 8279.1,
        "liantang": 7691.2
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.50714623%2C114.13110754&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%9D%8E%E5%BF%97%E9%81%94%E7%B4%80%E5%BF%B5%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E7%9F%B3%E6%B9%96%E5%A2%9F%E5%A4%A9%E5%B9%B3%E8%B7%AF30%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.50714623%2C114.13110754&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%9D%8E%E5%BF%97%E9%81%94%E7%B4%80%E5%BF%B5%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E7%9F%B3%E6%B9%96%E5%A2%9F%E5%A4%A9%E5%B9%B3%E8%B7%AF30%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 39.7
    },
    "north02": {
      "officialName": "香海正覺蓮社佛教正慧小學",
      "englishName": "HHCKLA BUDDHIST WISDOM PRIMARY SCHOOL",
      "address": "新界上水清城路6號",
      "website": "http://www.wisdom.edu.hk",
      "phone": "26689088",
      "coordinates": [
        114.12410522,
        22.49372493
      ],
      "longitude": 114.12410522,
      "latitude": 22.49372493,
      "coordinateSystem": "WGS84",
      "schoolNo": "550450000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 509.6,
        "liantang": 845.5
      },
      "driveDistanceMeters": {
        "huanggang": 7348.3,
        "liantang": 9238.8
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.49372493%2C114.12410522&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%A6%99%E6%B5%B7%E6%AD%A3%E8%A6%BA%E8%93%AE%E7%A4%BE%E4%BD%9B%E6%95%99%E6%AD%A3%E6%85%A7%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E6%B8%85%E5%9F%8E%E8%B7%AF6%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.49372493%2C114.12410522&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%A6%99%E6%B5%B7%E6%AD%A3%E8%A6%BA%E8%93%AE%E7%A4%BE%E4%BD%9B%E6%95%99%E6%AD%A3%E6%85%A7%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E6%B8%85%E5%9F%8E%E8%B7%AF6%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 47.5
    },
    "north03": {
      "officialName": "聖公會嘉福榮真小學",
      "englishName": "S.K.H. KA FUK WING CHUN PRIMARY SCHOOL",
      "address": "新界粉嶺嘉福邨小學校舍",
      "website": "http://www.skhkfwc.edu.hk",
      "phone": "29476888",
      "coordinates": [
        114.1349507,
        22.49338496
      ],
      "longitude": 114.1349507,
      "latitude": 22.49338496,
      "coordinateSystem": "WGS84",
      "schoolNo": "535680000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 15,
      "liantang": 20,
      "driveSeconds": {
        "huanggang": 611.4,
        "liantang": 957.2
      },
      "driveDistanceMeters": {
        "huanggang": 8670.5,
        "liantang": 10361.8
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.49338496%2C114.1349507&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%81%96%E5%85%AC%E6%9C%83%E5%98%89%E7%A6%8F%E6%A6%AE%E7%9C%9F%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E5%98%89%E7%A6%8F%E9%82%A8%E5%B0%8F%E5%AD%B8%E6%A0%A1%E8%88%8D&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.49338496%2C114.1349507&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%81%96%E5%85%AC%E6%9C%83%E5%98%89%E7%A6%8F%E6%A6%AE%E7%9C%9F%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E5%98%89%E7%A6%8F%E9%82%A8%E5%B0%8F%E5%AD%B8%E6%A0%A1%E8%88%8D&travelmode=transit"
      },
      "roadSnapDistanceMeters": 76.7
    },
    "north04": {
      "officialName": "五旬節靳茂生小學",
      "englishName": "PENTECOSTAL GIN MAO SHENG PRIMARY SCHOOL",
      "address": "新界粉嶺璧峰路四號",
      "website": "http://www.pgms.edu.hk",
      "phone": "26700103",
      "coordinates": [
        114.13845811,
        22.49632071
      ],
      "longitude": 114.13845811,
      "latitude": 22.49632071,
      "coordinateSystem": "WGS84",
      "schoolNo": "115169000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 15,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 610.3,
        "liantang": 749
      },
      "driveDistanceMeters": {
        "huanggang": 8521.3,
        "liantang": 10579.3
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.49632071%2C114.13845811&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%BA%94%E6%97%AC%E7%AF%80%E9%9D%B3%E8%8C%82%E7%94%9F%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E7%92%A7%E5%B3%B0%E8%B7%AF%E5%9B%9B%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.49632071%2C114.13845811&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%BA%94%E6%97%AC%E7%AF%80%E9%9D%B3%E8%8C%82%E7%94%9F%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E7%92%A7%E5%B3%B0%E8%B7%AF%E5%9B%9B%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 39.2
    },
    "north05": {
      "officialName": "五旬節于良發小學",
      "englishName": "PENTECOSTAL YU LEUNG FAT PRIMARY SCHOOL",
      "address": "新界粉嶺暉明路16號",
      "website": "http://www.pylfps.edu.hk",
      "phone": "26795626",
      "coordinates": [
        114.13864674,
        22.48179083
      ],
      "longitude": 114.13864674,
      "latitude": 22.48179083,
      "coordinateSystem": "WGS84",
      "schoolNo": "529540000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 15,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 690.4,
        "liantang": 882.4
      },
      "driveDistanceMeters": {
        "huanggang": 10103.1,
        "liantang": 13524.9
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.48179083%2C114.13864674&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%BA%94%E6%97%AC%E7%AF%80%E4%BA%8E%E8%89%AF%E7%99%BC%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E6%9A%89%E6%98%8E%E8%B7%AF16%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.48179083%2C114.13864674&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%BA%94%E6%97%AC%E7%AF%80%E4%BA%8E%E8%89%AF%E7%99%BC%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E6%9A%89%E6%98%8E%E8%B7%AF16%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 41.1
    },
    "north06": {
      "officialName": "東華三院馬錦燦紀念小學",
      "englishName": "TUNG WAH GROUP OF HOSPITALS MA KAM CHAN MEMORIAL PRIMARY SCHOOL",
      "address": "新界上水清城路2號",
      "website": "http://www.twghmkc.edu.hk",
      "phone": "26711071",
      "coordinates": [
        114.12403697,
        22.49430285
      ],
      "longitude": 114.12403697,
      "latitude": 22.49430285,
      "coordinateSystem": "WGS84",
      "schoolNo": "578320000223",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 530.5,
        "liantang": 866.4
      },
      "driveDistanceMeters": {
        "huanggang": 7303.5,
        "liantang": 9194
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.49430285%2C114.12403697&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%9D%B1%E8%8F%AF%E4%B8%89%E9%99%A2%E9%A6%AC%E9%8C%A6%E7%87%A6%E7%B4%80%E5%BF%B5%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E6%B8%85%E5%9F%8E%E8%B7%AF2%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.49430285%2C114.12403697&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E6%9D%B1%E8%8F%AF%E4%B8%89%E9%99%A2%E9%A6%AC%E9%8C%A6%E7%87%A6%E7%B4%80%E5%BF%B5%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E6%B8%85%E5%9F%8E%E8%B7%AF2%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 53.6
    },
    "north07": {
      "officialName": "上水惠州公立學校",
      "englishName": "WAI CHOW PUBLIC SCHOOL (SHEUNG SHUI)",
      "address": "新界上水天平路51號",
      "website": "http://www.waichow.edu.hk",
      "phone": "26731183",
      "coordinates": [
        114.13499627,
        22.50342676
      ],
      "longitude": 114.13499627,
      "latitude": 22.50342676,
      "coordinateSystem": "WGS84",
      "schoolNo": "114979000223",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 519.6,
        "liantang": 790.3
      },
      "driveDistanceMeters": {
        "huanggang": 8012.9,
        "liantang": 10917.9
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.50342676%2C114.13499627&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%B8%8A%E6%B0%B4%E6%83%A0%E5%B7%9E%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E5%A4%A9%E5%B9%B3%E8%B7%AF51%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.50342676%2C114.13499627&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E4%B8%8A%E6%B0%B4%E6%83%A0%E5%B7%9E%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E5%A4%A9%E5%B9%B3%E8%B7%AF51%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 46.6
    },
    "north08": {
      "officialName": "鳳溪第一小學",
      "englishName": "FUNG KAI NO.1 PRIMARY SCHOOL",
      "address": "新界上水馬會道15號及19號",
      "website": "http://www.fk1ps.edu.hk",
      "phone": "26709353",
      "coordinates": [
        114.12760744,
        22.5106851
      ],
      "longitude": 114.12760744,
      "latitude": 22.5106851,
      "coordinateSystem": "WGS84",
      "schoolNo": "114405000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 582.6,
        "liantang": 727.5
      },
      "driveDistanceMeters": {
        "huanggang": 8357.8,
        "liantang": 7181.9
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.5106851%2C114.12760744&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%B3%B3%E6%BA%AA%E7%AC%AC%E4%B8%80%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%A6%AC%E6%9C%83%E9%81%9315%E8%99%9F%E5%8F%8A19%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.5106851%2C114.12760744&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%B3%B3%E6%BA%AA%E7%AC%AC%E4%B8%80%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%A6%AC%E6%9C%83%E9%81%9315%E8%99%9F%E5%8F%8A19%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 14.3
    },
    "north09": {
      "officialName": "石湖墟公立學校",
      "englishName": "SHEK WU HUI PUBLIC SCHOOL",
      "address": "新界上水天平邨",
      "website": "http://www.swhps.edu.hk",
      "phone": "26721225",
      "coordinates": [
        114.13245938,
        22.50435621
      ],
      "longitude": 114.13245938,
      "latitude": 22.50435621,
      "coordinateSystem": "WGS84",
      "schoolNo": "115266000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 543.7,
        "liantang": 767.6
      },
      "driveDistanceMeters": {
        "huanggang": 8282.3,
        "liantang": 8030.1
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.50435621%2C114.13245938&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E7%9F%B3%E6%B9%96%E5%A2%9F%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E5%A4%A9%E5%B9%B3%E9%82%A8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.50435621%2C114.13245938&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E7%9F%B3%E6%B9%96%E5%A2%9F%E5%85%AC%E7%AB%8B%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E5%A4%A9%E5%B9%B3%E9%82%A8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 39.5
    },
    "north10": {
      "officialName": "粉嶺官立小學",
      "englishName": "FANLING GOVERNMENT PRIMARY SCHOOL",
      "address": "新界粉嶺祥華邨",
      "website": "https://www.fgps.edu.hk",
      "phone": "26695890",
      "coordinates": [
        114.14302642,
        22.49331461
      ],
      "longitude": 114.14302642,
      "latitude": 22.49331461,
      "coordinateSystem": "WGS84",
      "schoolNo": "510785000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 15,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 665.6,
        "liantang": 767.6
      },
      "driveDistanceMeters": {
        "huanggang": 9633.5,
        "liantang": 10819.2
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.49331461%2C114.14302642&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E7%B2%89%E5%B6%BA%E5%AE%98%E7%AB%8B%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E7%A5%A5%E8%8F%AF%E9%82%A8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.49331461%2C114.14302642&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E7%B2%89%E5%B6%BA%E5%AE%98%E7%AB%8B%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E7%B2%89%E5%B6%BA%E7%A5%A5%E8%8F%AF%E9%82%A8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 33.4
    },
    "north11": {
      "officialName": "育賢學校",
      "englishName": "YUK YIN SCHOOL",
      "address": "新界上水馬會道",
      "website": "http://www.yukyinschool.edu.hk",
      "phone": "26729917",
      "coordinates": [
        114.13150746,
        22.50272145
      ],
      "longitude": 114.13150746,
      "latitude": 22.50272145,
      "coordinateSystem": "WGS84",
      "schoolNo": "515086000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 561.6,
        "liantang": 787.9
      },
      "driveDistanceMeters": {
        "huanggang": 8261.1,
        "liantang": 8241.7
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.50272145%2C114.13150746&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%82%B2%E8%B3%A2%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%A6%AC%E6%9C%83%E9%81%93&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.50272145%2C114.13150746&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E8%82%B2%E8%B3%A2%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%A6%AC%E6%9C%83%E9%81%93&travelmode=transit"
      },
      "roadSnapDistanceMeters": 30.6
    },
    "north12": {
      "officialName": "鳳溪創新小學",
      "englishName": "FUNG KAI INNOVATIVE SCHOOL",
      "address": "新界上水馬會道19A號",
      "website": "http://www.fkis.edu.hk",
      "phone": "26392201",
      "coordinates": [
        114.12815164,
        22.51091103
      ],
      "longitude": 114.12815164,
      "latitude": 22.51091103,
      "coordinateSystem": "WGS84",
      "schoolNo": "566462000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 588.7,
        "liantang": 733.6
      },
      "driveDistanceMeters": {
        "huanggang": 8383.2,
        "liantang": 7207.3
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.51091103%2C114.12815164&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%B3%B3%E6%BA%AA%E5%89%B5%E6%96%B0%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%A6%AC%E6%9C%83%E9%81%9319A%E8%99%9F&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.51091103%2C114.12815164&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%B3%B3%E6%BA%AA%E5%89%B5%E6%96%B0%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%A6%AC%E6%9C%83%E9%81%9319A%E8%99%9F&travelmode=transit"
      },
      "roadSnapDistanceMeters": 19.7
    },
    "north13": {
      "officialName": "金錢村何東學校",
      "englishName": "KAM TSIN VILLAGE HO TUNG SCHOOL",
      "address": "新界上水金錢村",
      "website": "http://www.ktvhts.edu.hk",
      "phone": "26703849",
      "coordinates": [
        114.11147762,
        22.50183862
      ],
      "longitude": 114.11147762,
      "latitude": 22.50183862,
      "coordinateSystem": "WGS84",
      "schoolNo": "512257000123",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 10,
      "liantang": 15,
      "driveSeconds": {
        "huanggang": 515.7,
        "liantang": 887.6
      },
      "driveDistanceMeters": {
        "huanggang": 5975.6,
        "liantang": 9881.9
      },
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.50183862%2C114.11147762&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%87%91%E9%8C%A2%E6%9D%91%E4%BD%95%E6%9D%B1%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%87%91%E9%8C%A2%E6%9D%91&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.50183862%2C114.11147762&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%87%91%E9%8C%A2%E6%9D%91%E4%BD%95%E6%9D%B1%E5%AD%B8%E6%A0%A1+%E6%96%B0%E7%95%8C%E4%B8%8A%E6%B0%B4%E9%87%91%E9%8C%A2%E6%9D%91&travelmode=transit"
      },
      "roadSnapDistanceMeters": 13.2
    },
    "hk-extra01": {
      "officialName": "香港九龍塘基督教中華宣道會陳元喜小學",
      "englishName": "CHRISTIAN ALLIANCE H.C. CHAN PRIMARY SCHOOL OF THE KOWLOON TONG CHURCH OF THE CHINESE CHRISTIAN AND MISSIONARY ALLIANCE, HONG KONG",
      "address": "新界沙田美林邨第三小學",
      "website": "https://www.cahcc.edu.hk",
      "phone": "26998030",
      "coordinates": [
        114.17527219,
        22.38015741
      ],
      "longitude": 114.17527219,
      "latitude": 22.38015741,
      "coordinateSystem": "WGS84",
      "schoolNo": "115002000223",
      "sourceUrl": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv",
      "huanggang": 30,
      "liantang": 30,
      "driveSeconds": {
        "huanggang": 1700.6,
        "liantang": 1773.1
      },
      "driveDistanceMeters": {
        "huanggang": 30491,
        "liantang": 30744.2
      },
      "nameNote": "根据老师简称“陈元喜小学”匹配美林邨陈元喜小学；另有“台山陈元喜小学”（马鞍山），需与老师核对全名。",
      "mapLinks": {
        "huanggang": "https://www.google.com/maps/dir/?api=1&origin=22.50937751%2C114.07404556&destination=22.38015741%2C114.17527219&travelmode=driving",
        "huanggangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E8%90%BD%E9%A9%AC%E6%B4%B2%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E7%9A%87%E5%B2%97%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%A6%99%E6%B8%AF%E4%B9%9D%E9%BE%8D%E5%A1%98%E5%9F%BA%E7%9D%A3%E6%95%99%E4%B8%AD%E8%8F%AF%E5%AE%A3%E9%81%93%E6%9C%83%E9%99%B3%E5%85%83%E5%96%9C%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E6%B2%99%E7%94%B0%E7%BE%8E%E6%9E%97%E9%82%A8%E7%AC%AC%E4%B8%89%E5%B0%8F%E5%AD%B8&travelmode=transit",
        "liantang": "https://www.google.com/maps/dir/?api=1&origin=22.55278148%2C114.15385221&destination=22.38015741%2C114.17527219&travelmode=driving",
        "liantangPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E9%A6%99%E5%9B%AD%E5%9B%B4%E7%AE%A1%E5%88%B6%E7%AB%99%EF%BC%88%E8%8E%B2%E5%A1%98%E6%B8%AF%E6%96%B9%EF%BC%89&destination=%E9%A6%99%E6%B8%AF%E4%B9%9D%E9%BE%8D%E5%A1%98%E5%9F%BA%E7%9D%A3%E6%95%99%E4%B8%AD%E8%8F%AF%E5%AE%A3%E9%81%93%E6%9C%83%E9%99%B3%E5%85%83%E5%96%9C%E5%B0%8F%E5%AD%B8+%E6%96%B0%E7%95%8C%E6%B2%99%E7%94%B0%E7%BE%8E%E6%9E%97%E9%82%A8%E7%AC%AC%E4%B8%89%E5%B0%8F%E5%AD%B8&travelmode=transit"
      },
      "roadSnapDistanceMeters": 38.7
    },
    "sz01": {
      "officialName": "深圳香港培侨书院龙华信义学校",
      "address": "深圳市龙华区致远北路1号",
      "addressSourceUrl": "https://www.puikiuxinyi.com/contact/",
      "sourceUrl": "https://www.puikiuxinyi.com/contact/",
      "website": "https://www.puikiuxinyi.com/",
      "phone": null,
      "nameNote": "按老师简称“深圳培侨书院”暂匹配龙华信义学校；需核对意向校区。",
      "huanggang": null,
      "liantang": null,
      "direct": 10,
      "mapLinks": {
        "direct": "https://www.google.com/maps/dir/?api=1&origin=22.57485284%2C114.06369389&destination=22.613424%2C114.01644971&travelmode=driving",
        "directPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E7%BF%B0%E5%B2%AD%E9%99%A2+%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%A6%8F%E7%94%B0%E5%8C%BA%E6%A2%85%E4%B8%9C%E4%BA%8C%E8%B7%AF2%E5%8F%B7&destination=%E6%B7%B1%E5%9C%B3%E9%A6%99%E6%B8%AF%E5%9F%B9%E4%BE%A8%E4%B9%A6%E9%99%A2%E9%BE%99%E5%8D%8E%E4%BF%A1%E4%B9%89%E5%AD%A6%E6%A0%A1+%E6%B7%B1%E5%9C%B3%E5%B8%82%E9%BE%99%E5%8D%8E%E5%8C%BA%E8%87%B4%E8%BF%9C%E5%8C%97%E8%B7%AF1%E5%8F%B7&travelmode=transit"
      },
      "coordinates": [
        114.01644971,
        22.613424
      ],
      "longitude": 114.01644971,
      "latitude": 22.613424,
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "GCJ-02",
      "sourceCoordinates": [
        114.02149,
        22.610614
      ],
      "coordinateSourceUrl": "https://ditu.amap.com/place/B0HUNSBFBU",
      "driveSeconds": {
        "direct": 504.4
      },
      "driveDistanceMeters": {
        "direct": 7088.9
      },
      "roadSnapDistanceMeters": 104.3,
      "routingStatus": "success"
    },
    "sz02": {
      "officialName": "深圳市南山中英文学校（赤湾校区）",
      "address": "深圳市南山区赤湾五路55号",
      "addressSourceUrl": "https://www.sz.gov.cn/school/ns/mbxx/content/post_11281737.html",
      "sourceUrl": "https://www.sz.gov.cn/school/ns/mbxx/content/post_11281737.html",
      "website": "https://www.concordiaacademy.cn/",
      "phone": "0755-26939877",
      "nameNote": "按老师简称匹配已于2023年整体搬迁的赤湾校区；导航可能显示赤湾六路与赤湾七路交界，学校官方地址为赤湾五路55号。",
      "huanggang": null,
      "liantang": null,
      "direct": 25,
      "mapLinks": {
        "direct": "https://www.google.com/maps/dir/?api=1&origin=22.57485284%2C114.06369389&destination=22.4821629%2C113.88487914&travelmode=driving",
        "directPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E7%BF%B0%E5%B2%AD%E9%99%A2+%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%A6%8F%E7%94%B0%E5%8C%BA%E6%A2%85%E4%B8%9C%E4%BA%8C%E8%B7%AF2%E5%8F%B7&destination=%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%8D%97%E5%B1%B1%E4%B8%AD%E8%8B%B1%E6%96%87%E5%AD%A6%E6%A0%A1%EF%BC%88%E8%B5%A4%E6%B9%BE%E6%A0%A1%E5%8C%BA%EF%BC%89+%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%8D%97%E5%B1%B1%E5%8C%BA%E8%B5%A4%E6%B9%BE%E4%BA%94%E8%B7%AF55%E5%8F%B7&travelmode=transit"
      },
      "coordinates": [
        113.88487914,
        22.4821629
      ],
      "longitude": 113.88487914,
      "latitude": 22.4821629,
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "GCJ-02",
      "sourceCoordinates": [
        113.889759,
        22.479114
      ],
      "coordinateSourceUrl": "https://www.amap.com/place/B0JRXH4099",
      "driveSeconds": {
        "direct": 1454
      },
      "driveDistanceMeters": {
        "direct": 26681.5
      },
      "roadSnapDistanceMeters": 78.7,
      "routingStatus": "success",
      "websiteNote": "南山中英文学校协同港籍学生部官网。"
    },
    "sz03": {
      "officialName": "深圳市普林云海港人子弟学校",
      "address": "深圳市福田区北环大道7010号",
      "addressSourceUrl": "https://www.psis.cn/contact",
      "sourceUrl": "https://www.psis.cn/contact",
      "website": "https://www.psis.cn/",
      "phone": "0755-83696333 / 19129358999",
      "nameNote": "按老师简称匹配官网福田教学点（北环大道7010号）；不采用集团其他罗湖、盐田等地址。",
      "huanggang": null,
      "liantang": null,
      "direct": 5,
      "mapLinks": {
        "direct": "https://www.google.com/maps/dir/?api=1&origin=22.57485284%2C114.06369389&destination=22.56273%2C114.03048&travelmode=driving",
        "directPublicTransport": "https://www.google.com/maps/dir/?api=1&origin=%E7%BF%B0%E5%B2%AD%E9%99%A2+%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%A6%8F%E7%94%B0%E5%8C%BA%E6%A2%85%E4%B8%9C%E4%BA%8C%E8%B7%AF2%E5%8F%B7&destination=%E6%B7%B1%E5%9C%B3%E5%B8%82%E6%99%AE%E6%9E%97%E4%BA%91%E6%B5%B7%E6%B8%AF%E4%BA%BA%E5%AD%90%E5%BC%9F%E5%AD%A6%E6%A0%A1+%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%A6%8F%E7%94%B0%E5%8C%BA%E5%8C%97%E7%8E%AF%E5%A4%A7%E9%81%937010%E5%8F%B7&travelmode=transit"
      },
      "coordinates": [
        114.03048,
        22.56273
      ],
      "longitude": 114.03048,
      "latitude": 22.56273,
      "driveSeconds": {
        "direct": 272
      },
      "driveDistanceMeters": {
        "direct": 4287.3
      },
      "routingStatus": "success",
      "travelNote": "福田教学点在梅景地铁站西侧，轨道路线可考虑9号线；地图直线距离约270米，不等于步行路程。纯驾车路网估算不含路况、等车、停车和上下客时间。",
      "coordinateSystem": "WGS84",
      "sourceCoordinateSystem": "WGS84",
      "sourceCoordinates": [
        114.03048,
        22.56273
      ],
      "coordinateSourceUrl": "https://mapcarta.com/W1243990465",
      "osmUrl": "https://www.openstreetmap.org/way/1243990465",
      "coordinateNote": "学校校园位置来自Mapcarta所引用的OpenStreetMap学校地块（way1243990465），地址与学校官网核对一致；取校园位置与最近道路，非实测校门或停车位。",
      "roadSnapDistanceMeters": 44.4,
      "routingRequestUrl": "https://router.project-osrm.org/route/v1/driving/114.06369389,22.57485284;114.03048,22.56273?overview=false"
    }
  },
  "sources": [
    {
      "title": "香港教育局学校位置及资料（每月更新）",
      "url": "https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv"
    },
    {
      "title": "香港入境处出入境管制站开放数据",
      "url": "https://data.gov.hk/tc-data/dataset/hk-immd-set9-immdcp"
    },
    {
      "title": "OSRM 路由 API 文档",
      "url": "https://project-osrm.org/docs/v5.24.0/api/"
    },
    {
      "title": "OSRM 全球汽车 demo 用量说明",
      "url": "https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server"
    },
    {
      "title": "翰岭院高德 POI",
      "url": "https://www.amap.com/place/B02F37VNB9"
    },
    {
      "title": "深圳口岸办莲塘口岸说明",
      "url": "https://ka.sz.gov.cn/bmfw/katgfw/liantang/"
    },
    {
      "title": "高德 GCJ-02 坐标说明",
      "url": "https://developer.amap.com/api/javascript-api-v2/guide/transform/convertfrom"
    },
    {
      "title": "深圳培侨龙华信义学校官方地址",
      "url": "https://www.puikiuxinyi.com/contact/"
    },
    {
      "title": "深圳政府南山中英文学校赤湾校区资料",
      "url": "https://www.sz.gov.cn/school/ns/mbxx/content/post_11281737.html"
    },
    {
      "title": "普林云海港人子弟学校官方地址",
      "url": "https://www.psis.cn/contact"
    },
    {
      "title": "普林云海学校地块位置（Mapcarta/OpenStreetMap）",
      "url": "https://mapcarta.com/W1243990465"
    }
  ],
  "coordinateConversion": {
    "method": "高德POI的GCJ-02坐标通过通用偏移模型迭代反解至近似WGS84，未使用官方反向转换服务。",
    "source": "https://github.com/wandergis/coordtransform",
    "accuracyNote": "转换模型、POI中心与道路匹配均可能有位置误差，不能视为实测车道或家庭出口。"
  },
  "notes": [
    "香港驾车路线起点为过关后港方口岸，深圳侧段到口岸单独计算，通关和口岸内部接驳需另加。",
    "两口岸路线为皇岗↔落马洲管制站、莲塘↔香园围管制站；皇岗不是福田口岸落马洲支线地铁站。",
    "这份路线估算不提供真实排队等待。界面通关预留分钟为用户可调整的计划参数。",
    "从深圳连续驾车过境需使用具备相应资格的车辆或跨境车辆服务；普通深圳网约车与香港的士为两段。"
  ],
  "routingStatus": "success",
  "routingRequestUrl": "https://router.project-osrm.org/table/v1/driving/114.06369389,22.57485284;114.07232911,22.52234021;114.15320256,22.55589916;114.07404556,22.50937751;114.15385221,22.55278148;114.17036538,22.44877997;114.19449024,22.46965751;114.19602979,22.43075416;114.1669455,22.45175984;114.17314389,22.44736227;114.17746703,22.45385521;114.17519361,22.45659143;114.16937444,22.44892441;114.1723566,22.45945402;114.17678289,22.4553534;114.16339959,22.45056757;114.13110754,22.50714623;114.12410522,22.49372493;114.1349507,22.49338496;114.13845811,22.49632071;114.13864674,22.48179083;114.12403697,22.49430285;114.13499627,22.50342676;114.12760744,22.5106851;114.13245938,22.50435621;114.14302642,22.49331461;114.13150746,22.50272145;114.12815164,22.51091103;114.11147762,22.50183862;114.17527219,22.38015741?sources=0;3;4&destinations=1;2;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29&annotations=duration,distance",
  "roadSnapDistanceMeters": {
    "home": 91.0,
    "huanggangHongKong": 4.0,
    "liantangHongKong": 60.8,
    "huanggangShenzhen": 52.2,
    "liantangShenzhen": 9.8
  },
  "shenzhenRoutingRequestUrl": "https://router.project-osrm.org/table/v1/driving/114.06369389,22.57485284;114.01644971,22.613424;113.88487914,22.4821629?sources=0&destinations=1;2&annotations=duration,distance",
  "huanggangChange": {
    "effectiveDate": "2026-10-12",
    "note": "2026年10月12日6:30旧落马洲／皇岗口岸交接至重建皇岗口岸；本页皇岗车程仍使用既有落马洲道路点估算，新口岸路线与上下客点需出发前导航复核。",
    "sourceUrl": "https://www.td.gov.hk/tc/transport_in_hong_kong/land_based_cross_boundary_transport/athp/index.html"
  }
};
