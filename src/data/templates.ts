import { ContentTemplate } from '@/engine/types';

// BrandPilot 内容模板库
// 覆盖 Voyage Pack × 3 平台（小红书 / Instagram / 微信公众号）× 2 目标（种草帖 / 新品介绍）= 6 个模板
// 占位符 {productName} {capacity} {material} {sellingPoint1} {sellingPoint2} {brandName} {productType}
// 会被 mockGenerator.fillTemplate 替换为真实产品信息后再进入审核流程
export const templates: ContentTemplate[] = [
  // ─────────────────────────────────────────────────────────────
  // 模板 1：Voyage Pack × 小红书 × 种草帖
  // 关键案例：故意带问题，用于演示审核引擎的拦截能力
  //   - 标题含"全网最好的短途背包" → 触发 brand.absolute（error）
  //   - 正文含"完全防水"           → 触发 fact.waterExaggeration（error）
  //   - tags 仅 3 个               → 触发 platform.tagCount（warning，小红书要求 5-8）
  //   - cta 含"立即下单抢购"        → 触发 brand.ctaHardSell（warning）
  // ─────────────────────────────────────────────────────────────
  {
    productId: 'product_voyage_pack',
    platformId: 'platform_xhs',
    goalId: 'goal_seeding',
    title: '周末说走就走｜全网最好的短途背包，{productName} 装下两天全部家当',
    body: '上周末临时决定去周边城市放空两天，随手抓了 {productName} 就出门。\n\n这只 {capacity} 的包真的能装，换洗衣服、洗漱包、充电器、还有一双备用鞋都塞进去了。最让我惊喜的是干湿分离层，泳衣和湿毛巾直接丢进去也不怕。\n\n外面下小雨也完全没在怕，完全防水的设计让我很安心。隐藏防盗口袋贴身放证件，{sellingPoint1} 的快开设计拿手机特别顺手。\n\n如果你也喜欢说走就走的周末，这只包真的值得拥有。',
    tags: ['#周末出行', '#短途旅行', '#旅行好物'],
    cta: '喜欢的话立即下单抢购，评论区告诉我你的周末目的地',
  },

  // ─────────────────────────────────────────────────────────────
  // 模板 2：Voyage Pack × 小红书 × 新品介绍（基本合规）
  // 场景感标题 + 产品定位，卖点融入正文，cta 互动引导
  // ─────────────────────────────────────────────────────────────
  {
    productId: 'product_voyage_pack',
    platformId: 'platform_xhs',
    goalId: 'goal_new_product',
    title: '新品首发｜{productName} 短途旅行背包，为说走就走的周末而生',
    body: '{brandName} 推出全新 {productType} {productName}，{capacity} 容量刚刚好，刚好装下两天一夜的行李。\n\n{material} 面料轻盈耐用，防泼水设计应对突如其来的小雨。{sellingPoint1} 让你单手取手机，{sellingPoint2} 把湿毛巾和干衣服分开收纳，还有隐藏防盗口袋贴身放证件。\n\n无论高铁短途还是周边自驾，{productName} 都能成为你可靠的旅伴。',
    tags: ['#短途旅行背包', '#新品首发', '#周末出行', '#旅行好物', '#防泼水', '#收纳背包'],
    cta: '你最想用它装什么？评论区聊聊，顺手收藏备用',
  },

  // ─────────────────────────────────────────────────────────────
  // 模板 3：Voyage Pack × Instagram × 种草帖（基本合规，英文为主）
  // Instagram language 为 'en'，正文以英文为主（中文占比 ≤ 30%），tags 10-15 个，cta 简短英文
  // ─────────────────────────────────────────────────────────────
  {
    productId: 'product_voyage_pack',
    platformId: 'platform_ig',
    goalId: 'goal_seeding',
    title: 'Weekend getaway ready: {productName} packs two days in one bag',
    body: 'Took {productName} on a last-minute weekend trip and it handled everything.\n\nAt {capacity}, it fits clothes, toiletries, chargers and spare shoes without feeling bulky. The wet/dry compartment keeps damp gear separate, and {sellingPoint1} makes grabbing my phone effortless.\n\nLight rain? The splash-resistant {material} shrugs it off, and the hidden anti-theft pocket keeps my passport close.',
    tags: [
      '#weekendtrip',
      '#travelbag',
      '#packingtips',
      '#shorttrip',
      '#travelgear',
      '#voyagepack',
      '#lumacarry',
      '#weekendgetaway',
      '#travelcommunity',
      '#lightweight',
      '#antitheft',
      '#travelready',
    ],
    cta: 'Where are you heading next? Tell me below',
  },

  // ─────────────────────────────────────────────────────────────
  // 模板 4：Voyage Pack × Instagram × 新品介绍（基本合规，英文为主）
  // 英文为主，tags 10-15 个，突出产品定位与核心卖点
  // ─────────────────────────────────────────────────────────────
  {
    productId: 'product_voyage_pack',
    platformId: 'platform_ig',
    goalId: 'goal_new_product',
    title: 'Meet {productName}: the short-trip pack built for spontaneous weekends',
    body: '{brandName} introduces {productName}, a {capacity} short-trip pack designed for two-day escapes.\n\nBuilt from {material}, it stays light and shrugs off light rain. {sellingPoint1} lets you grab your phone one-handed, while {sellingPoint2} separates damp clothes from dry ones. A hidden anti-theft pocket keeps valuables close, and the luggage pass-through makes airport transitions smooth.\n\nMade for weekend travelers who pack light and move fast.',
    tags: [
      '#newlaunch',
      '#travelbag',
      '#shorttrip',
      '#travelgear',
      '#voyagepack',
      '#lumacarry',
      '#weekendready',
      '#packinglight',
      '#travelcommunity',
      '#gearupdate',
      '#traveltech',
      '#minimaltravel',
    ],
    cta: 'Save this for your next trip',
  },

  // ─────────────────────────────────────────────────────────────
  // 模板 5：Voyage Pack × 微信公众号 × 种草帖（基本合规）
  // 中文，tags 3-6 个，正文较长（品牌叙事风格）
  // ─────────────────────────────────────────────────────────────
  {
    productId: 'product_voyage_pack',
    platformId: 'platform_wechat',
    goalId: 'goal_seeding',
    title: '一只装得下周末的包：{productName} 与我的两次短途出走',
    body: '有时候，计划之外的出走反而让人印象深刻。上个月连续两个周末我都背起 {productName} 离开城市，一次去山里住了一晚，一次沿海岸线开了两百公里。\n\n这只 {capacity} 的 {productType}，刚好卡在“能装”和“不累赘”之间。换洗衣物、洗漱包、相机、充电设备，外加一本路上读的书，拉上拉链还余出一格放纪念品。\n\n{material} 的质感很扎实，遇到山里一阵急雨，水珠在表面滚落，内里依然干燥——防泼水设计足以应对这种天气。{sellingPoint1} 的快开结构让我在服务区不用卸包就能拿到手机，{sellingPoint2} 则把泳衣和干衣服隔开，避免湿气串味。\n\n贴身的隐藏防盗口袋放护照和卡片，背着它穿地铁也安心。可挂行李箱的设计在机场转机时格外省力，往拉杆上一套就能腾出手来。\n\n{brandName} 一直相信“少带一点，多体验一点”。{productName} 不追求把所有功能堆砌在一起，而是把短途出行真正用得到的细节做扎实。如果你也想给周末一个说走就走的理由，它或许会成为你常用的那只包。',
    tags: ['#短途旅行', '#周末出行', '#旅行背包', '#品牌故事', '#LumaCarry'],
    cta: '关注 {brandName}，下一期聊聊短途出行的收纳清单',
  },

  // ─────────────────────────────────────────────────────────────
  // 模板 6：Voyage Pack × 微信公众号 × 新品介绍（基本合规）
  // 中文，tags 3-6 个，正文较长，突出产品定位与核心卖点
  // ─────────────────────────────────────────────────────────────
  {
    productId: 'product_voyage_pack',
    platformId: 'platform_wechat',
    goalId: 'goal_new_product',
    title: '新品上市｜{brandName} {productName}：为短途出行重新设计的一只包',
    body: '在城市与山野之间，越来越多的人开始用一次短途出走重启自己。{brandName} 注意到，市面上的背包要么偏专业户外、过于硬朗，要么偏通勤、装不下两天的行李。于是有了 {productName}。\n\n{productName} 是一只 {capacity} 的 {productType}，定位介于通勤包与旅行包之间。我们用 {material} 打造主体，轻盈耐刮，遇小雨水珠自然滑落，内里保持干燥——防泼水等级足以应对日常多变的天气。\n\n核心卖点围绕“取物、收纳、安全、衔接”四个场景展开：{sellingPoint1} 让你单手取放手机；{sellingPoint2} 把湿衣物与干衣物隔开；隐藏防盗口袋贴身收纳证件；可挂行李箱的背带槽在转机时省力。\n\n我们和几十位周末出行者一起打磨细节：肩带宽度经过反复调整，长时间背负不勒肩；拉链头做了静音处理，进出图书馆与咖啡馆不打扰他人。\n\n{productName} 已正式上线，适合周末出行者与短途旅行爱好者。如果你正在寻找一只能装下两天生活、又不显笨重的包，欢迎了解详情。',
    tags: ['#新品上市', '#短途旅行背包', '#LumaCarry', '#VoyagePack', '#周末出行'],
    cta: '点击关注 {brandName}，获取 {productName} 的新品详情与首发活动',
  },
];

// 根据 产品 × 平台 × 目标 查找模板
export function getTemplate(
  productId: string,
  platformId: string,
  goalId: string,
): ContentTemplate | null {
  return (
    templates.find(
      (t) =>
        t.productId === productId &&
        t.platformId === platformId &&
        t.goalId === goalId,
    ) || null
  );
}
