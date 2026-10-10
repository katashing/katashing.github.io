#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""按 travel-data.js 中已核对的公开坐标重新计算 OSRM 汽车路网时间。

默认仅打印结果：python3 scripts/update-travel-routes.py
确认地址、校区和口岸点后保存：python3 scripts/update-travel-routes.py --write

学校资料来源与坐标来源在 travel-data.js 的 sourceUrl 等字段中。
脚本只更新路网估算，不核实校区搬迁、不提供实时路况或通关等待。
皇岗于2026-10-12换新口岸：更新皇岗起点前，旧点仍只作历史参考。
OSRM demo 的公开使用要求：每秒最多1个请求。本脚本只发1个请求。
"""

import argparse
import datetime
import json
import math
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen


def rounded_minutes(seconds):
    return math.ceil(seconds / 300) * 5


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="成功核验所有路线后写回文件")
    args = parser.parse_args()
    project = Path(__file__).resolve().parents[1]
    path = project / "dist" / "travel-data.js"
    if not path.exists():
        path = project / "travel-data.js"
    source = path.read_text(encoding="utf-8")
    prefix, payload = source.split("window.TRAVEL_DATA = ", 1)
    data = json.loads(payload.rsplit(";", 1)[0])
    origins = data["origins"]
    origin_keys = ["huanggangShenzhen", "liantangShenzhen", "huanggangHongKong", "liantangHongKong"]
    coordinates = [data["originHanlingyuan"]["coordinates"]]
    coordinates += [origins[key]["coordinates"] for key in origin_keys]
    school_ids = list(data["schools"])
    for sid in school_ids:
        coordinate = data["schools"][sid].get("coordinates")
        if not coordinate:
            raise ValueError("学校坐标待核对，未改写文件：" + sid)
        coordinates.append(coordinate)

    destinations = [1, 2] + list(range(5, len(coordinates)))
    coordinate_text = ";".join(",".join(map(str, coordinate)) for coordinate in coordinates)
    url = (
        "https://router.project-osrm.org/table/v1/driving/" + coordinate_text
        + "?sources=0;3;4&destinations=" + ";".join(map(str, destinations))
        + "&annotations=duration,distance"
    )
    request = Request(url, headers={"User-Agent": "SchoolTrackerRouteRefresh/1.0"})
    with urlopen(request, timeout=60) as response:
        raw = json.load(response)
    if raw.get("code") != "Ok":
        raise ValueError("OSRM请求未成功，未改写文件：" + json.dumps(raw, ensure_ascii=False))

    # 在改写数据前，确保所需的每条路线均有真实返回值。
    required = [(0, 0), (0, 1)]
    for column, sid in enumerate(school_ids, start=2):
        required += [(0, column)] if sid.startswith("sz") else [(1, column), (2, column)]
    if any(raw["durations"][row][column] is None for row, column in required):
        raise ValueError("部分路线不可达，未改写文件。请先核对坐标与当前道路。")

    for column, key in enumerate(["homeToHuanggang", "homeToLiantang"]):
        seconds = raw["durations"][0][column]
        data["driveMinutes"][key] = rounded_minutes(seconds)
        data["driveSeconds"][key] = seconds
        data["driveDistanceMeters"][key] = raw["distances"][0][column]
    for column, sid in enumerate(school_ids, start=2):
        school = data["schools"][sid]
        legs = [(0, "direct")] if sid.startswith("sz") else [(1, "huanggang"), (2, "liantang")]
        for row, leg in legs:
            seconds = raw["durations"][row][column]
            school[leg] = rounded_minutes(seconds)
            school.setdefault("driveSeconds", {})[leg] = seconds
            school.setdefault("driveDistanceMeters", {})[leg] = raw["distances"][row][column]
            start = coordinates[[0, 3, 4][row]]
            destination = school["coordinates"]
            school.setdefault("mapLinks", {})[leg] = "https://www.google.com/maps/dir/?" + urlencode({
                "api": 1,
                "origin": str(start[1]) + "," + str(start[0]),
                "destination": str(destination[1]) + "," + str(destination[0]),
                "travelmode": "driving",
            })
        school["roadSnapDistanceMeters"] = round(raw["destinations"][column]["distance"], 1)
        school["routingStatus"] = "success"
        print(sid, school["officialName"], {leg: school[leg] for _, leg in legs})
    data["routingCheckedAt"] = datetime.date.today().isoformat()
    data["routingStatus"] = "success"
    data["routingRequestUrl"] = url
    data["roadSnapDistanceMeters"] = {
        "home": round(raw["sources"][0]["distance"], 1),
        "huanggangHongKong": round(raw["sources"][1]["distance"], 1),
        "liantangHongKong": round(raw["sources"][2]["distance"], 1),
        "huanggangShenzhen": round(raw["destinations"][0]["distance"], 1),
        "liantangShenzhen": round(raw["destinations"][1]["distance"], 1),
    }
    if args.write:
        path.write_text(prefix + "window.TRAVEL_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
        print("已更新", path)
    else:
        print("仅预览。添加 --write 才会保存。地址和皇岗起点仍须另行核对。")


if __name__ == "__main__":
    main()
