家庭看板本地字体

menu-handwriting.ttf
- 字体：LXGW WenKai TC Regular
- 用途：中文菜单、待办、孩子课程、全部资料、农历和黄历宜忌文字。
- 当前覆盖：1118 个字符，完整保留先前 1117 字，本轮新增“休”，用于 10 月 26 日至 11 月 1 日课表中的“白天休息”；新课表全部可见中英文文字逐字核对，无缺字。先前家庭常用节名字（军冬女妇母父）及“青菜”的“青”继续保留；覆盖当前 JSON 可见文字、界面静态中文、2026–2027 年全部 730 天农历 calendar.text、黄历 text/yi/ji 所需字形及大陆、香港常见节名。已核对 festivals.json 全部 64 条 text（63 个日期，含家庭常用节日、复活节正日及香港补假），无缺字；本次对原 1117 字的轮廓和 hmtx 指标逐字比较，全部保持不变。
- 来源：https://fonts.google.com/specimen/LXGW+WenKai+TC
- 官方项目：https://github.com/lxgw/LxgwWenKaiTC
- 许可：menu-handwriting-OFL.txt（SIL Open Font License）

menu-english.ttf
- 字体：EB Garamond Regular，正体（非斜体）。
- 用途：英文菜单、待办、孩子课程及全部资料正文；以清晰端正的餐厅衬线字替代手写字体。英文单词仍使用该字体；阿拉伯数字统一使用 Board Digits，标点回退原字体。
- 来源：https://fonts.google.com/specimen/EB+Garamond
- 官方项目：https://github.com/octaviopardo/EBGaramond12
- 许可：menu-english-OFL.txt（SIL Open Font License）

两份菜单字体均来自 Google Fonts 官方接口，使用 TrueType 格式供旧版 Kindle 浏览器本地加载，不依赖设备联网请求字体。中文源字体经 fontTools 按所需字符生成 544,228 字节的本地子集；保留字形轮廓和 OFL 许可，不部署 13 MB 的完整源字体。英文为官方 text 子集接口提供的文件。
中文子集覆盖当前菜单、任务、课程、家务标准、今日/明日早餐、饮品规则、星期、时段、农历、黄历和大陆及香港节日文字，并保留原 helper-schedule 手册的常用中文字；英文子集覆盖可打印 ASCII 和弯撇号 U+2019。
新增菜单字符时应检查覆盖范围并更新对应子集；缺少字符时浏览器会使用页面设置的系统后备字体。
部署时保留菜单字体文件、本说明、相应 OFL 许可，以及下述数字字体及许可。

控件手写标签已覆盖早餐、待办、孩子、语言、轮播、资料、前后翻日、分页及家务分类；补齐停、列、播、读、资、轮、返，保留之前全部字形。

board-digits.ttf
- 字体：LXGW WenKai TC 原手写数字轮廓；CSS 名 Board Digits。
- 用途：所有可见阿拉伯数字，包括日期、天气、课表时间、星期数字按钮、页码及中英文混合正文。
- 覆盖：仅 0–9；每个 font-family 栈都优先此字体，其余文字与标点使用原菜单/系统字体，不依赖 unicode-range。
- 格式：TrueType glyf，2,640 字节，保留 Windows BMP format-4 cmap；0–9 字宽均为 600/1000em，原轮廓、字宽和行指标不变。
- 内部 family：Family Board Digits；PostScript 名：FamilyBoardDigits-Regular。所有内部身份名与其他字体区分，避免旧浏览器按相同名字混用不同字形表。
- 来源：保留的 ui-numerals.ttf 原文件；许可：board-digits-OFL.txt（SIL Open Font License）。
- 构建：安装构建依赖 fonttools==4.61.1 后，运行 python3 scripts/build_digit_font.py 只预览，--write 才写入；网站运行无需 Python 或 FontTools。
- 构建器核对原字体/许可哈希、0–9 cmap、唯一内部名字及原轮廓/指标。桌面显示与结构校验不能代替 Kindle 实机重新加载复测。

ui-numerals.ttf、ui-rounded.ttf 与原许可继续保留为来源，不加载。
旧 ui-numerals.ttf 与中文菜单字体有相同内部名字但不同 glyph 顺序；将旧数字 glyph ID 套入中文字体恰好会把 2026-10-27 显示为 CACGPBAPCH，是旧 Kindle 字体混用的强证据。不能只改 CSS 别名便重新启用旧字体。
