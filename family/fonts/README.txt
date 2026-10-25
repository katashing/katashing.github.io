家庭看板本地字体

menu-handwriting.ttf
- 字体：LXGW WenKai TC Regular
- 用途：中文菜单、待办、孩子课程、全部资料、农历和黄历宜忌文字。
- 当前覆盖：1117 个字符，完整保留先前 1111 字，本轮新增 6 个家庭常用节名字（军冬女妇母父）；覆盖当前 JSON 可见文字、界面静态中文及 2026–2027 年全部 730 天农历 calendar.text、黄历 text/yi/ji 所需字形及大陆、香港常见节名。已补齐“青菜”的“青”（“菜”原已覆盖），避免同一菜名混用系统后备字体；完整 LXGW 源缺字为 0。已核对实际 festivals.json 全部 64 条 text（63 个日期，含家庭常用节日、复活节正日及香港补假），无缺字；原 1111 字的轮廓和 hmtx 指标逐字对比保持不变。
- 来源：https://fonts.google.com/specimen/LXGW+WenKai+TC
- 官方项目：https://github.com/lxgw/LxgwWenKaiTC
- 许可：menu-handwriting-OFL.txt（SIL Open Font License）

menu-english.ttf
- 字体：EB Garamond Regular，正体（非斜体）。
- 用途：英文菜单、待办、孩子课程及全部资料正文；以清晰端正的餐厅衬线字替代手写字体。日期与时段中的英文单词也使用该字体，仅数字及数字符号使用 UI Numerals。
- 来源：https://fonts.google.com/specimen/EB+Garamond
- 官方项目：https://github.com/octaviopardo/EBGaramond12
- 许可：menu-english-OFL.txt（SIL Open Font License）

两份菜单字体均来自 Google Fonts 官方接口，使用 TrueType 格式供旧版 Kindle 浏览器本地加载，不依赖设备联网请求字体。中文源字体经 fontTools 按所需字符生成 543,872 字节的本地子集；保留字形轮廓和 OFL 许可，不部署 13 MB 的完整源字体。英文为官方 text 子集接口提供的文件。
中文子集覆盖当前菜单、任务、课程、家务标准、今日/明日早餐、饮品规则、星期、时段、农历、黄历和大陆及香港节日文字，并保留原 helper-schedule 手册的常用中文字；英文子集覆盖可打印 ASCII 和弯撇号 U+2019。
新增菜单字符时应检查覆盖范围并更新对应子集；缺少字符时浏览器会使用页面设置的系统后备字体。
部署时保留菜单字体文件、本说明、相应 OFL 许可，以及下述数字字体及许可。

控件手写标签已覆盖早餐、待办、孩子、语言、轮播、资料、前后翻日、分页及家务分类；补齐停、列、播、读、资、轮、返，保留之前全部字形。

ui-numerals.ttf
- 字体：LXGW WenKai TC Regular，与中文正文相同的手写数字，逻辑名 UI Numerals。
- 用途：中英文课表时间、顶部日期/天气、日期按钮和 1–7 星期按钮中的数字及数字符号；中文文字回退 Menu Handwriting，英文文字回退 Menu English。
- 来源：与 menu-handwriting.ttf 相同的官方 LXGW WenKai TC 完整源字体，经 fontTools 提取数字子集。
- 许可：ui-numerals-OFL.txt（SIL Open Font License，与菜单中文字体许可相同）。
- 格式：TrueType，19,156 字节；保留原字形轮廓、原生 Regular 字重和所有指标，不合成粗体。
- 覆盖：22 个字符：0–9、空格、百分号、正负号、长短横线、句点、逗号、斜杠、冒号和度数符号。
- 0–9 的原生 hmtx advance 均为 600（unitsPerEm 1000）；无需 font-feature-settings 或 tabular-nums 即可对齐时间数字。
- “17:45 – 18:45”按 16px 为 107.2px，适合小屏 112px 时间列；按 19px 为 127.3px，适合正常 134px 时间列。
当前页面不再引用 Nunito 或 ui-rounded.ttf；旧 ui-rounded.ttf 和许可仅保留为历史文件。
部署时保留 ui-numerals.ttf 与 ui-numerals-OFL.txt。
