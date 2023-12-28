const url_prefix = "./img/";

let images = ["creator1.PNG", "creator2.PNG", "creator3.PNG", "creator4.PNG", "creator5.PNG", "ac6.PNG"];
let currentImage = 0;
let textContainer = document.querySelector('.text-container');
let scrollSpeed = 0.5; // 可以调整滚动速度
let scrollPosition = 0;

function changeImage() {
    document.querySelector('.img-container').src = url_prefix + images[currentImage];
    currentImage = (currentImage + 1) % images.length;
    setTimeout(changeImage, 10000); // 每12秒更换一次图片
}

function scrollText() {
    let maxScrollHeight = textContainer.scrollHeight - textContainer.clientHeight;
    if (scrollPosition < maxScrollHeight) {
        scrollPosition += scrollSpeed;
        textContainer.scrollTop = scrollPosition;
        requestAnimationFrame(scrollText);
    }
}


textContainer.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><h2>总策划</h2>\n\n<p>超常事件“共鸣”</p>\n\n<h2>故事文案</h2>\n\n<p>异常项目“马桶蓄水池之神”</p>\n\n<h2>页面美术</h2>\n\n<p>异常项目“做梦都想摸鱼”</p>\n\n<h2>游戏设计</h2>\n\n<p>异常项目“绝对泛用钱包”</p>\n\n<h2>外部联络</h2>\n\n<p>异常项目“可视化宠爱”</p>\n\n<br><br><br><br><br><br><br><h2>感谢出场</h2>\n\n<ul><li>SCP-CN-004 - 只一場夢</li><li>SCP-CN-007 - 服务性巨兽</li><li>SCP-CN-012 - 液体广告</li><li>SCP-CN-026 - 不再孤独</li><li>SCP-CN-027 - 囚星蝶</li><li>SCP-CN-040 - 做一个威猛先生™</li><li>SCP-CN-052 - 硬币</li><li>SCP-CN-083 - 画中湖水</li><li>SCP-CN-086 - “對著湯匙繞圈子，可以產生龍捲風”</li><li>SCP-CN-099 - 献花之人</li><li>SCP-CN-118 - 路上小心</li><li>SCP-CN-，00122 - 第五一模因</li><li>SCP-CN-173 - 自定义先生</li><li>SCP-CN-206 - 飞行模式</li><li>SCP-CN-210 - 平凡的梦想</li><li>SCP-CN-238 - 星之梦</li><li>SCP-CN-285 - 单人TRPG</li><li>SCP-CN-288 - 我们为何相聚</li><li>艾斯 瑟 癖 横杠 瑟 恩 横杠 二九六 - 汉字模因</li><li>SCP-CN-318 - 他应当被人知晓</li><li>SCP-CN-319 - 此处仍有希望。</li><li>SCP-CN-321 - 蹦迪小鸟</li><li>SCP-CN-333 - 擦脚巾</li><li>SCP-CN-349 - 断你WIFI</li><li>SCP-CN-351 - 赋运神猫</li><li>SCP-CN-352 - 猫抽屉</li><li>SCP-CN-373 - 模因海洋</li><li>SCP-CN-380 - LETTERS電競能量飲</li><li>SCP-CN-383 - 黑暗料理餐厅</li><li>SCP-CN-398 - 一篇异常的文档</li><li>SCP-CN-445 - 一篇不合格的异常文档</li><li>SCP-CN-432 - 相声先生</li><li>SCP-CN-454 - 请保持联系</li><li>SCP-CN-458 - 航天胶囊™</li><li>SCP-CN-460 - 脑内所想</li><li>SCP-CN-471 - 唯一能为你做的</li><li>SCP-CN-434 - 开袋百分百有奖</li><li>SCP-CN-522 - 地球美食售货机</li><li>SCP-CN-528 - 三个标准仙人掌</li><li>项目的编号为SCP-CN-533。 </li><li>SCP-CN-546 - 我们的秘密</li><li>SCP-CN-564 - 你的個人辦公室</li><li>SCP-CN-578 - 如是恒常</li><li>SCP-CN-585 - 一笔兔</li><li>SCP-CN-593 - 許願池</li><li>SCP-CN-600 - 巧克力糖果</li><li>SCP-CN-626 - 项目等级</li><li>SCP-CN-680 - Wondertainment博士的澡盆大海战®</li><li>SCP-CN-737 - 梦境搬家</li><li>SCP-CN-739 - 一串代码</li><li>SCP-CN-758 - 迷你基金会</li><li>SCP-CN-765 - 描述训练</li><li>SCP-CN-767 - 图表症</li><li>SCP-CN-803 - 人形售货机</li><li>SCP-CN-812 - 不死妖喵</li><li>SCP-CN-843 - “金榜题名”</li><li>SCP-CN-848 - 倒数第二重真相</li><li>SCP-CN-883 - 微小误差</li><li>SCP-CN-925 - 礼帽白鲸</li><li>SCP-CN-937-J - 好用的马桶</li><li>SCP-CN-954 - :v</li><li>SCP-CN-962 - 文字游戏</li><li>SCP-CN-970 - 唯手熟尔</li><li>SCP-CN-980 - J</li><li>SCP-CN-982 - 正确的事</li><li>SCP-CN-984 - 87%</li><li>SCP-CN-985 - 考试鲨</li><li>SCP-CN-992 - 危险物品测试</li><li>SCP-CN-1001 - 文字终结于此</li><li>SCP-CN-1004 - 一切终将逝去</li><li>SCP-CN-1028 - 晒月亮</li><li>SCP-CN-1061 - 猫之彩</li><li>SCP-CN-1066 - “华曦”二手手机交易店</li><li>SCP-CN-1069 - 你好啊，老朋友</li><li>SCP-CN-1129 - 膨化</li><li>SCP-CN-1171 - 巧克力烤面包</li><li>SCP-CN-1200 - 余音</li><li>SCP-CN-1211 - 今天起，做一个有梦想的旭蟹</li><li>SCP-CN-1256 - 《基金会中分编年史》</li><li>SCP-CN-1261 - 当你漂泊的时候，不要害怕，因为我会等你</li><li>SCP-CN-1276 - “绝好调回转寿司！”</li><li>SCP-CN-1296 - 猫枪</li><li>SCP-CN-1286 - 流金岁月</li><li>SCP-CN-1301 - 末时赠礼</li><li>SCP-CN-1326 - 信息传输协议</li><li>SCP-CN-1344 - 我们每个人的结局</li><li>SCP-CN-1372 - 鱼竿</li><li>SCP-CN-1394 - 黑点</li><li>SCP-CN-1435 - “地狱恶龙魂”</li><li>SCP-CN-1459 - dado不是很懂尼们二次元</li><li>SCP-CN-1491 - 这可不是什么挽留</li><li>SCP-CN-1496 - 鱼伞</li><li>SCP-CN-1559 - 青鸟</li><li>SCP-CN-1572 - 预定的流程</li><li>SCP-CN-1573 - 特长收容措施</li><li>SCP-CN-1675 - 欢迎光临</li><li>SCP-CN-1713 - 一种近期发现的具备传染性模因效应及元数据影响效应的异常项目</li><li>SCP-CN-1715 - 天下没有不散的筵席</li><li>SCP-CN-1716 - 为你撰写的故事，待你谱写的结局</li><li>SCP-CN-1726 - 秘法配方</li><li>SCP-CN-1757 - “墓志铭” </li><li>SCP-CN-1760 - 谢谢惠顾</li><li>SCP-CN-1790 - 然后我们得以生活在阳光之下</li><li>SCP-CN-1814 - 没玩过的新游戏</li><li>SCP-CN-1830 - 海蛞蝓奶茶店</li><li>SCP-CN-1881 - 描绘梦想</li><li>SCP-CN-1890 - 应当多加关心基金会员工的精神状态，也许吧</li><li>SCP-CN-1922 - 液体猫咪</li><li>SCP-CN-1987 - 马桶搋子</li><li>SCP-CN-1989 - 该轮到你啦</li><li>SCP-CN-1999 - 幻想遗物</li><li>SCP-CN-2062 - 是。否。否。</li><li>SCP-CN-2067 - 你好，我是赛博猫猫。</li><li>SCP-CN-2073 - 鹊桥</li><li>SCP-CN-2088 - 我的新生</li><li>SCP-CN-2107 - 好梦</li><li>SCP-CN-2131 - 我们有棱角，是为了成为星星</li><li>SCP-CN-2220 - 灵魂所在</li><li>SCP-CN-2289 - 鸡子涅槃</li><li>SCP-CN-2300 - 1000</li><li>SCP-CN-2303 - 一台手机</li><li>SCP-CN-2379 - 星落之时</li><li>SCP-CN-2418 - 归档</li><li>SCP-CN-2425 - 回环在我</li><li>SCP-CN-2426 - 麦乐鸡基本主义</li><li>SCP-CN-2437 - 伴你同行</li><li>SCP-CN-2460 - 你的第一篇skip！</li><li>SCP-CN-2485 - 回声</li><li>SCP-CN-2629（已归档） - 只是一个小玩笑</li><li>SCP-CN-2638 - “即使故事的结局无法改变……”</li><li>SCP-CN-2640 - “如你所愿”</li><li>SCP-CN-2646 - 死亡从未是终点</li><li>SCP-CN-2649 - 但这不是全貌</li><li>SCP-CN-2662 - 一朝梦境，一影随行</li><li>SCP-CN-2669 - 回忆永驻</li><li>SCP-CN-2676 - 自成逻辑</li><li>SCP-CN-2678 - ……直到大厦崩塌</li><li>SCP-CN-2696 - 一路顺风</li><li>SCP-CN-2785 - “星”代表“咫尺” </li><li>SCP-CN-2795 - “我”于你们之中</li><li>SCP-CN-2805 - 一份普通的基金会档案</li><li>SCP-CN-2810 - 让她睡吧</li><li>SCP-CN-2820 - 减少收容失效的可能性。</li><li>SCP-CN-2823 - 唯一指向性结局</li><li>SCP-CN-2985 - 海上交通大学</li><li>SCP-CN-2987 - 不要抬头看</li><li>SCP-CN-2989 - 在场证明</li><li>SCP-CN-2995 结束了吗？</li><li>SCP-CN-2997 - █000</li></ul>\n\n<br><br><br><br><br><br><br><h3>特别协力</h3>\n\n<ul><li>SCP-CN-004-J - 爱因斯坦罗森马桶效应，或虫洞马桶效应</li><li>SCP-CN-006-J - 文乎wordのmeme是也です呐♥ 复合型文字模因，又名究极缝合怪</li><li>SCP-CN-034-J - 固有印象铲</li><li>SCP-CN-048-J - 中二病体验器</li><li>SCP-CN-111-J - 美食评判家便便</li><li>SCP-CN-123-J - 到底需要几个小便池？</li><li>SCP-CN-166-J - 红唇之神</li><li>SCP-CN-321-J - 一个车轱辘</li><li>SCP-CN-322-J - 走到哪炸到哪</li><li>SCP-CN-648-J - 现在我的手中抓住了希望！</li><li>SCP-CN-830-J - 厕所幽灵</li><li>SCP-CN-888-J - 由于贯彻O5议会第一次会议关于收容异常的决议而被收容的模因官僚主义模因</li></ul>\n\n<br><br><br><br><br><br><br><p>感谢基金会所有成员一直以来的付出和收容<br><br><br><br><br><br><br><br><br><br><br><br><br>以及看到这里的你。</p>";



// 启动动画
changeImage();
requestAnimationFrame(scrollText);
