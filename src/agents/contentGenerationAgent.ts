// Content Generation Agent
// 输入：Product Brief + Platform Brief + Content Strategy
// 输出：标题、正文、标签、CTA、生成时间、Session ID
//
// 本地规则驱动生成：根据平台语言、平台风格、内容目标动态拼装文案，
// 不同平台 × 不同内容目标会产生不同风格的结果，而不是返回同一段固定文案。

import { GeneratedContent } from '@/engine/types';
import { generateSessionId } from '@/utils/sessionId';
import { GenerationContext } from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── 标题生成 ──────────────────────────────────────────────
function generateTitle(ctx: GenerationContext): string {
  const { product, platform, goal, productBrief, brand } = ctx;
  const scenario = productBrief.scenarios[0] || '日常';

  // Instagram：英文标题
  if (platform.language === 'en') {
    if (goal.id === 'goal_seeding') {
      return `${scenario} ready: ${product.name} packs a weekend in one bag`;
    }
    return `Meet ${product.name}: the ${product.type} built for ${scenario}`;
  }

  // 小红书：场景化/新品首发，带 ｜ 分隔
  if (platform.id === 'platform_xhs') {
    if (goal.id === 'goal_seeding') {
      return `${scenario}｜${product.name} 让我说走就走`;
    }
    return `新品首发｜${product.name} ${product.type}，为${scenario}而生`;
  }

  // 微信公众号：品牌叙事长标题
  if (goal.id === 'goal_seeding') {
    return `一只装得下${scenario}的包：${product.name} 与我的短途出走`;
  }
  return `新品上市｜${brand.name} ${product.name}：为${scenario}重新设计的一只包`;
}

// ── 正文生成 ──────────────────────────────────────────────
function generateBody(ctx: GenerationContext): string {
  const { platform } = ctx;

  if (platform.language === 'en') {
    return generateEnglishBody(ctx);
  }
  if (platform.id === 'platform_xhs') {
    return generateXhsBody(ctx);
  }
  return generateWechatBody(ctx);
}

// Instagram 英文正文：简洁，50-300 字
function generateEnglishBody(ctx: GenerationContext): string {
  const { product, goal, productBrief } = ctx;
  const scenario = productBrief.scenarios[0] || 'weekend';
  const sp = product.coreSellingPoints;
  const capacity = product.capacity || '';
  const material = product.material || '';

  if (goal.id === 'goal_seeding') {
    return [
      `Took ${product.name} on a ${scenario.toLowerCase()} trip and it handled everything.`,
      '',
      `At ${capacity}, it fits clothes, toiletries and spare shoes without feeling bulky. ${sp[0] || 'Quick access'} makes grabbing essentials effortless${sp[1] ? `, while ${sp[1]} keeps wet and dry gear apart` : ''}.`,
      '',
      `The ${material} shrugs off light rain, and the hidden pocket keeps valuables close. Light, clean, ready to go.`,
    ].join('\n');
  }

  // new product
  const spList = sp.slice(0, 4).join(', ');
  return [
    `${product.name} is a ${capacity} ${product.type} designed for ${scenario.toLowerCase()}.`,
    '',
    `Built from ${material}, it stays light and handles light rain. ${spList} cover the key scenarios you actually care about.`,
    '',
    `Made for travelers who pack light and move fast.`,
  ].join('\n');
}

// 小红书中文正文：场景化，150-500 字，适度 emoji
function generateXhsBody(ctx: GenerationContext): string {
  const { product, goal, productBrief, brand } = ctx;
  const scenario = productBrief.scenarios[0] || '周末';
  const sp = product.coreSellingPoints;
  const capacity = product.capacity || '';
  const material = product.material || '';

  if (goal.id === 'goal_seeding') {
    return [
      `上周末临时决定去${scenario}，随手抓了 ${product.name} 就出门 🌿`,
      '',
      `这只 ${capacity} 的包真的能装，换洗衣服、洗漱包、充电器都塞进去了。最让我惊喜的是 ${sp[1] || sp[0]}，湿毛巾和干衣服分开收纳，再也不怕串味。`,
      '',
      `${sp[0] || '快开设计'}让我在地铁里单手取手机特别顺手，${material} 遇到小雨也不怕，水珠一擦就落。`,
      '',
      `如果你也喜欢说走就走，这只包真的值得拥有 ✨`,
    ].join('\n');
  }

  // new product
  return [
    `${brand.name} 推出全新 ${product.type} ${product.name}，${capacity} 容量刚刚好，为${scenario}而生。`,
    '',
    `${material} 面料轻盈耐用，防泼水设计应对小雨。${sp[0] || '核心卖点'}让你取物更顺手，${sp[1] || ''}把干湿分开，还有隐藏防盗口袋贴身放证件。`,
    '',
    `无论高铁短途还是周边自驾，${product.name} 都能成为可靠的旅伴。`,
  ].join('\n');
}

// 微信公众号中文正文：品牌叙事长文，400-1500 字
function generateWechatBody(ctx: GenerationContext): string {
  const { product, goal, productBrief, brand } = ctx;
  const scenario = productBrief.scenarios[0] || '短途出行';
  const sp = product.coreSellingPoints;
  const capacity = product.capacity || '';
  const material = product.material || '';

  if (goal.id === 'goal_seeding') {
    return [
      `有时候，计划之外的出走反而让人印象深刻。上个月连续两个周末我都背起 ${product.name} 离开城市，一次去山里住了一晚，一次沿${scenario}开了两百公里。`,
      '',
      `这只 ${capacity} 的 ${product.type}，刚好卡在"能装"和"不累赘"之间。换洗衣物、洗漱包、相机、充电设备，拉上拉链还余出一格放纪念品。`,
      '',
      `${material} 的质感很扎实，遇到一阵急雨，水珠在表面滚落，内里依然干燥。${sp[0] || '快开结构'}让我在服务区不用卸包就能拿到手机，${sp[1] || '干湿分离'}则把湿衣物和干衣服隔开。`,
      '',
      `贴身的隐藏防盗口袋放护照和卡片，可挂行李箱的设计在转机时格外省力。`,
      '',
      `${brand.name} 一直相信"少带一点，多体验一点"。如果你也想给周末一个说走就走的理由，${product.name} 或许会成为你常用的那只包。`,
    ].join('\n');
  }

  // new product
  return [
    `在城市与山野之间，越来越多的人开始用一次短途出走重启自己。${brand.name} 注意到，市面上的背包要么偏专业户外、过于硬朗，要么偏通勤、装不下两天的行李。于是有了 ${product.name}。`,
    '',
    `${product.name} 是一只 ${capacity} 的 ${product.type}，定位介于通勤包与旅行包之间。我们用 ${material} 打造主体，轻盈耐刮，遇小雨水珠自然滑落。`,
    '',
    `核心卖点围绕"取物、收纳、安全、衔接"展开：${sp[0] || ''}让你单手取放手机；${sp[1] || ''}把湿衣物与干衣物隔开；隐藏防盗口袋贴身收纳证件；可挂行李箱的背带槽在转机时省力。`,
    '',
    `${product.name} 已正式上线，适合${productBrief.targetUsers.join('与')}。如果你正在寻找一只能装下两天生活、又不显笨重的包，欢迎了解详情。`,
  ].join('\n');
}

// ── 标签生成 ──────────────────────────────────────────────
function generateTags(ctx: GenerationContext): string[] {
  const { product, platform, goal, productBrief, brand } = ctx;
  const scenario = productBrief.scenarios[0] || '';
  const tags: string[] = [];

  if (platform.language === 'en') {
    // Instagram：10-15 个英文标签
    tags.push('#weekendtrip', '#travelbag', '#packingtips', '#shorttrip', '#travelgear');
    tags.push(`#${product.name.toLowerCase().replace(/\s+/g, '')}`);
    tags.push(`#${brand.name.toLowerCase().replace(/\s+/g, '')}`);
    if (goal.id === 'goal_seeding') {
      tags.push('#weekendgetaway', '#travelcommunity', '#lightweight', '#antitheft', '#travelready');
    } else {
      tags.push('#newlaunch', '#gearupdate', '#packinglight', '#travelcommunity', '#minimaltravel');
    }
    return tags.slice(0, platform.tagRange.max);
  }

  if (platform.id === 'platform_xhs') {
    tags.push(`#${scenario}`, `#${product.type}`, '#旅行好物', '#周末出行');
    if (goal.id === 'goal_seeding') {
      tags.push('#说走就走', '#短途旅行');
    } else {
      tags.push('#新品首发', '#防泼水');
    }
    return tags.slice(0, platform.tagRange.max);
  }

  // 微信公众号：3-6 个中文标签
  tags.push(`#${product.type}`, '#品牌故事');
  if (goal.id === 'goal_seeding') {
    tags.push('#短途旅行', '#周末出行');
  } else {
    tags.push('#新品上市', `#${brand.name}`);
  }
  return tags.slice(0, platform.tagRange.max);
}

// ── CTA 生成 ──────────────────────────────────────────────
function generateCta(ctx: GenerationContext): string {
  const { platform, goal, brand, product } = ctx;

  if (platform.language === 'en') {
    if (goal.id === 'goal_seeding') {
      return 'Where are you heading next? Tell me below';
    }
    return 'Save this for your next trip';
  }

  if (platform.id === 'platform_xhs') {
    if (goal.id === 'goal_seeding') {
      return '评论区告诉我你的周末目的地，顺手收藏备用';
    }
    return '你最想用它装什么？评论区聊聊，收藏不迷路';
  }

  // 微信公众号
  if (goal.id === 'goal_seeding') {
    return `关注 ${brand.name}，下一期聊聊短途出行的收纳清单`;
  }
  return `点击关注 ${brand.name}，获取 ${product.name} 的新品详情与首发活动`;
}

// 生成完整内容
export async function runContentGenerationAgent(
  ctx: GenerationContext,
): Promise<GeneratedContent> {
  await delay(800);

  const title = generateTitle(ctx);
  const body = generateBody(ctx);
  const tags = generateTags(ctx);
  const cta = generateCta(ctx);

  const sessionId = generateSessionId();
  const contentId = `content_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: contentId,
    sessionId,
    productId: ctx.product.id,
    platformId: ctx.platform.id,
    goalId: ctx.goal.id,
    title,
    body,
    tags,
    cta,
    createdAt: new Date().toISOString(),
  };
}
