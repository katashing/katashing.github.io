#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""按 travel-data.js 中已核对的公开坐标重新计算 OSRM 汽车路网时间。

仅刷新公开新皇岗PTI到香港学校：python3 scripts/update-travel-routes.py --huanggang-only
确认路网响应后保存：python3 scripts/update-travel-routes.py --huanggang-only --write
离线重放已核实查询：添加 --response-file FILE（含 requestUrl 与 response 的JSON）。

学校资料来源与坐标来源在 travel-data.js 的 sourceUrl 等字段中。
脚本只更新路网估算，不核实校区搬迁、不提供实时路况或通关等待。
新皇岗内部道路尚未完整映射，家庭前段的规划预留不随公开矩阵刷新。
全矩阵联网含家庭精确坐标，仅在用户明确授权向OSRM发送后使用 --allow-home-query。
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
    parser.add_argument("--huanggang-only", action="store_true", help="仅查询公开新皇岗PTI到25所香港学校，不发送家庭坐标")
    parser.add_argument("--response-file", type=Path, help="重放带查询URL的已核实OSRM响应，不联网")
    parser.add_argument("--allow-home-query", action="store_true", help="用户已明确授权向OSRM发送家庭坐标时才使用")
    args = parser.parse_args()
    project = Path(__file__).resolve().parents[1]
    path = project / "dist" / "travel-data.js"
    if not path.exists():
        path = project / "travel-data.js"
    source = path.read_text(encoding="utf-8")
    prefix, payload = source.split("window.TRAVEL_DATA = ", 1)
    data = json.loads(payload.rsplit(";", 1)[0])
    origins = data["origins"]
    if args.huanggang_only:
        coordinates = [origins["huanggangHongKong"]["coordinates"]]
        school_ids = [sid for sid in data["schools"] if not sid.startswith("sz")]
        sources = [0]
        destinations = list(range(1, len(school_ids) + 1))
    else:
        if not args.response_file and not args.allow_home_query:
            parser.error("全矩阵会发送精确家庭坐标；请用 --huanggang-only，或在取得明确授权后添加 --allow-home-query。")
        origin_keys = ["huanggangShenzhen", "liantangShenzhen", "huanggangHongKong", "liantangHongKong"]
        coordinates = [data["originHanlingyuan"]["coordinates"]]
        coordinates += [origins[key]["coordinates"] for key in origin_keys]
        school_ids = list(data["schools"])
        sources = [0, 3, 4]
        destinations = [1, 2] + list(range(5, len(school_ids) + 5))
    for sid in school_ids:
        coordinate = data["schools"][sid].get("coordinates")
        if not coordinate:
            raise ValueError("学校坐标待核对，未改写文件：" + sid)
        coordinates.append(coordinate)

    coordinate_text = ";".join(",".join(map(str, coordinate)) for coordinate in coordinates)
    url = (
        "https://router.project-osrm.org/table/v1/driving/" + coordinate_text
        + "?sources=" + ";".join(map(str, sources))
        + "&destinations=" + ";".join(map(str, destinations))
        + "&annotations=duration,distance"
    )
    if args.response_file:
        bundle = json.loads(args.response_file.read_text(encoding="utf-8"))
        if bundle.get("requestUrl") != url:
            raise ValueError("本地响应的查询URL与当前坐标/路线不一致，未改写文件。")
        raw = bundle["response"]
    else:
        request = Request(url, headers={"User-Agent": "SchoolTrackerRouteRefresh/1.0"})
        with urlopen(request, timeout=30) as response:
            raw = json.load(response)
    if raw.get("code") != "Ok":
        raise ValueError("OSRM请求未成功，未改写文件：" + json.dumps(raw, ensure_ascii=False))

    # 在改写数据前，确保所需的每条路线均有真实返回值。
    if len(raw["sources"]) != len(sources) or len(raw["destinations"]) != len(destinations):
        raise ValueError("响应矩阵大小与请求不一致，未改写文件。")
    column_start = 0 if args.huanggang_only else 2
    required = [] if args.huanggang_only else [(0, 0), (0, 1)]
    for column, sid in enumerate(school_ids, start=column_start):
        required += [(0, column)] if args.huanggang_only or sid.startswith("sz") else [(1, column), (2, column)]
    if any(raw["durations"][row][column] is None for row, column in required):
        raise ValueError("部分路线不可达，未改写文件。请先核对坐标与当前道路。")

    if not args.huanggang_only:
        for column, key in enumerate(["homeToHuanggang", "homeToLiantang"]):
            seconds = raw["durations"][0][column]
            data["driveMinutes"][key] = rounded_minutes(seconds)
            data["driveSeconds"][key] = seconds
            data["driveDistanceMeters"][key] = raw["distances"][0][column]
        data.pop("homeToHuanggangEstimate", None)
    for column, sid in enumerate(school_ids, start=column_start):
        school = data["schools"][sid]
        legs = [(0, "huanggang")] if args.huanggang_only else ([(0, "direct")] if sid.startswith("sz") else [(1, "huanggang"), (2, "liantang")])
        for row, leg in legs:
            seconds = raw["durations"][row][column]
            school[leg] = rounded_minutes(seconds)
            school.setdefault("driveSeconds", {})[leg] = seconds
            school.setdefault("driveDistanceMeters", {})[leg] = raw["distances"][row][column]
            start = coordinates[0 if args.huanggang_only else [0, 3, 4][row]]
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
    if args.huanggang_only:
        data["huanggangRoutingRequestUrl"] = url
        data.setdefault("roadSnapDistanceMeters", {})["huanggangHongKong"] = round(raw["sources"][0]["distance"], 1)
    else:
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
        print("仅预览。添加 --write 才会保存。道路吸附、校区与新口岸内部路径仍须导航核对。")


if __name__ == "__main__":
    main()
