import {
  AgentContext,
  Brand,
  ContentGoal,
  ContentStrategy,
  GeneratedContent,
  Platform,
  PlatformBrief,
  Product,
  ProductBrief,
} from '@/engine/types';
import { generateSessionId } from '@/utils/sessionId';

// 标题生成：按平台语言 + 内容目标组合差异化
function buildTitle(
  product: Product,
  brand: Brand,
  platform: Platform,
  goal: ContentGoal,
  productBrief: ProductBrief,
): string {
  const isZh = platform.language === 'zh';
  const sp = productBrief.coreSellingPoints;
  const sc = productBrief.useScenarios;
  if (isZh) {
    if (goal.id === 'goal_seeding') {
      return `${sc[0] || product.name}｜${product.name}，${sp[0] || '说走就走'}`;
    }
    if (goal.id === 'goal_new_product') {
      return `新品首发｜${brand.name} ${product.name}，${product.type}为${sc[0] || '出行'}而生`;
    }
    return `${product.name}｜${sp[0] || product.type}`;
  }
  // 英文平台
  if (goal.id === 'goal_seeding') {
    return `Weekend ready: ${product.name} packs ${product.capacity || 'essentials'} for short trips`;
  }
  if (goal.id === 'goal_new_product') {
    return `Meet ${product.name}: the ${product.type} built for spontaneous travel`;
  }
  return `${product.name}: ${sp[0] || 'designed for travel'}`;
}

// 按信息段落挑选 emoji（仅 zh + emoji 平台使用）
function pickEmoji(section: string): string {
  switch (section) {
    case '场景化开头':
      return '✨';
    case '卖点融入体验':
      return '🎒';
    case '真实感受':
      return '😌';
    case '互动CTA':
      return '👇';
    case '产品定位':
      return '🆕';
    case '核心卖点':
      return '💡';
    case '适用人群':
      return '👥';
    case '购买引导':
      return '🛒';
    default:
      return '✨';
  }
}

// 正文段落（中文）：按信息排序构建场景化文案
function buildSectionZh(section: string, ctx: AgentContext, useEmoji: boolean): string {
  const { productBrief, product, brand } = ctx;
  const sp = productBrief.coreSellingPoints;
  const sc = productBrief.useScenarios;
  let text = '';
  switch (section) {
    case '场景化开头':
      text = `${sc[0] || '周末出行'}，不想大包小包？带上 ${product.name}，${sp[0] || '轻松出行'}，让每一段旅程都更从容。`;
      break;
    case '卖点融入体验':
      text = `${sp[0] || '快开取物'}的设计，在${sc[1] || sc[0] || '出行'}时很实用；${sp[1] || '分区收纳'}让行李井井有条，${sp[2] || '安全设计'}也更安心。`;
      break;
    case '真实感受':
      text = `${product.capacity || '22L'}的容量刚好装下两天所需，${product.material || '尼龙'}材质轻便，背着不累，适合${productBrief.targetUsers.join('、')}。`;
      break;
    case '互动CTA':
      text = `你下次出行会去哪儿？${product.name} 陪你一起出发，期待你的故事。`;
      break;
    case '产品定位':
      text = `${brand.name} ${product.name} 是一款 ${product.type}（${product.capacity || ''} ${product.material || ''}），为${sc[0] || '出行'}而生。`;
      break;
    case '核心卖点':
      text = `核心卖点：${sp.join('、')}。`;
      break;
    case '适用人群':
      text = `适合${productBrief.targetUsers.join('、')}，${brand.toneKeywords.join('、')}的设计语言贯穿其中。`;
      break;
    case '购买引导':
      text = `${brand.name} ${product.name} 现已上市，欢迎前往官方渠道了解详情。`;
      break;
    default:
      text = `${section}：${product.name}。`;
  }
  return useEmoji ? `${text} ${pickEmoji(section)}` : text;
}

// 正文段落（英文）：避免直接嵌入中文卖点名，保证英文占比
function buildSectionEn(section: string, ctx: AgentContext): string {
  const { product, brand } = ctx;
  switch (section) {
    case '场景化开头':
      return `Weekend ready? ${product.name} packs ${product.capacity || 'your essentials'} for short trips.`;
    case '卖点融入体验':
      return `Quick-access pockets and separate compartments keep your gear organized on the go.`;
    case '真实感受':
      return `At ${product.capacity || '22L'}, it holds a weekend's worth of essentials without feeling bulky.`;
    case '互动CTA':
      return `Where are you heading next? Share your destination below.`;
    case '产品定位':
      return `${brand.name} ${product.name}: a ${product.capacity || ''} travel backpack built for spontaneous trips.`;
    case '核心卖点':
      return `Key features: quick-access design, wet/dry separation, hidden security pocket, and luggage-strap attachment.`;
    case '适用人群':
      return `Made for weekend travelers and short-trip lovers who pack light.`;
    case '购买引导':
      return `${brand.name} ${product.name} is now available. Learn more at the official channel.`;
    default:
      return `${product.name}: designed for travel.`;
  }
}

// 中文补充段落（用于达到平台最小长度，主要是微信公众号）
function zhExtras(ctx: AgentContext): string[] {
  const { brand, product, productBrief } = ctx;
  const sc = productBrief.useScenarios;
  return [
    `${brand.name} 坚持「${brand.tagline}」的理念，${brand.toneKeywords.join('、')}是我们一贯的设计语言。`,
    `无论是${sc.join('还是') || '日常出行'}，${product.name} 都能胜任。`,
    `建议搭配轻便穿搭，适合${productBrief.targetUsers.join('、')}的日常与周末。`,
    `${product.material || '材质'}质感扎实，${product.capacity || '容量'}适中，长期使用依然耐用。`,
    `从容量分区到取物方式，每一个细节都为短途出行优化。`,
    `如果你正在寻找一款能装、好取、耐用的${product.type}，${product.name} 值得一试。`,
  ];
}

// 英文补充段落
function enExtras(ctx: AgentContext): string[] {
  const { brand, product } = ctx;
  return [
    `${brand.name} believes in "${brand.tagline}".`,
    `Whether for weekend trips or short getaways, ${product.name} is up for it.`,
    `Lightweight ${product.material || 'material'} and a ${product.capacity || 'compact'} capacity keep it comfortable all day.`,
  ];
}

// 正文组装：按信息排序生成段落，并适配平台长度
function buildBody(ctx: AgentContext): string {
  const platform: Platform = ctx.platform;
  const contentStrategy: ContentStrategy = ctx.contentStrategy;
  const platformBrief: PlatformBrief = ctx.platformBrief;
  const isZh = platform.language === 'zh';
  const useEmoji =
    platform.emojiPolicy !== 'minimal' &&
    platformBrief.expressionStyle.includes('emoji') &&
    !platformBrief.expressionStyle.includes('极简');

  const paragraphs: string[] = contentStrategy.infoOrder.map((s) =>
    isZh ? buildSectionZh(s, ctx, useEmoji) : buildSectionEn(s, ctx),
  );

  // 微信公众号需要长文：前置品牌引入，后置品牌理念
  if (platform.id === 'platform_wechat') {
    const { brand, product, productBrief } = ctx;
    paragraphs.unshift(
      `${brand.name}（${brand.tagline}）推出 ${product.name}，一款为${productBrief.targetUsers.join('、')}打造的 ${product.type}，兼顾日常与轻户外。`,
    );
    paragraphs.push(
      `品牌理念：「${brand.tagline}」。${brand.toneKeywords.join('、')}是我们一贯的风格，避免${brand.antiToneKeywords.join('、')}。`,
    );
  }

  let body = paragraphs.join('\n\n');
  // 补充段落直至达到平台最小长度
  const extras = isZh ? zhExtras(ctx) : enExtras(ctx);
  let ei = 0;
  while (body.length < platform.bodyLengthRange.min && ei < extras.length) {
    body += '\n\n' + extras[ei++];
  }
  // 超出最大长度则截断
  if (body.length > platform.bodyLengthRange.max) {
    body = body.slice(0, platform.bodyLengthRange.max);
  }
  return body;
}

// 标签生成：按平台语言从关键词池中取平台允许数量
function buildTags(platform: Platform, product: Product, brand: Brand, productBrief: ProductBrief): string[] {
  const isZh = platform.language === 'zh';
  const productName = product.name.replace(/\s+/g, '');
  const brandName = brand.name.replace(/\s+/g, '');
  const scenarioTag = productBrief.useScenarios[0] || '';
  let pool: string[];
  if (isZh) {
    pool = [
      '#周末出行',
      '#短途旅行',
      '#旅行好物',
      '#背包推荐',
      `#${productName}`,
      `#${brandName}`,
      `#${product.type}`,
      '#好物分享',
      '#出行必备',
      '#轻户外',
      scenarioTag ? `#${scenarioTag}` : '#出行',
    ];
  } else {
    const pName = productName.toLowerCase();
    const bName = brandName.toLowerCase();
    pool = [
      '#weekendtrip',
      '#travelbag',
      '#travel',
      '#backpack',
      `#${pName}`,
      `#${bName}`,
      '#shorttrip',
      '#travelgear',
      '#weekend',
      '#travelcommunity',
      '#travellife',
      '#packing',
      '#travelers',
      '#outdoor',
      '#essentials',
      '#travelessentials',
    ];
  }
  const unique = Array.from(new Set(pool));
  const count = Math.min(platform.tagRange.max, unique.length);
  return unique.slice(0, count);
}

// CTA 生成：按平台与目标差异化
function buildCta(platform: Platform, goal: ContentGoal, product: Product, brand: Brand): string {
  const isZh = platform.language === 'zh';
  if (isZh) {
    if (platform.id === 'platform_xhs') {
      if (goal.id === 'goal_seeding') return '评论区告诉我你的周末目的地';
      if (goal.id === 'goal_new_product') return '收藏备用，了解新品详情';
    }
    if (platform.id === 'platform_wechat') {
      return `关注${brand.name}，了解更多${product.name}详情`;
    }
    return `了解更多${product.name}`;
  }
  return 'Where are you heading next? Tell me below';
}

// Content Generation Agent：基于 Brief + Strategy 按规则拼装差异化文案
export function runContentGeneration(ctx: AgentContext): GeneratedContent {
  const { brand, product, platform, goal, productBrief } = ctx;
  const title = buildTitle(product, brand, platform, goal, productBrief);
  const body = buildBody(ctx);
  const tags = buildTags(platform, product, brand, productBrief);
  const cta = buildCta(platform, goal, product, brand);

  return {
    id: `content_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sessionId: generateSessionId(),
    productId: product.id,
    platformId: platform.id,
    goalId: goal.id,
    title,
    body,
    tags,
    cta,
    createdAt: new Date().toISOString(),
  };
}
