import { Brand, Product, Platform, ContentGoal } from '@/engine/types';

// Agent 类型定义
export interface AgentDefinition {
  id: string;
  name: string;            // 英文名
  nameZh: string;          // 中文名
  role: string;            // 职责
  input: string;           // 输入
  output: string;          // 输出
  expansion: string;      // 可扩展方向
}

// BrandPilot 内部 Agent 编排：5 个 Agent 串联
export const AGENT_DEFINITIONS: AgentDefinition[] = [
  {
    id: 'agent_product_knowledge',
    name: 'Product Knowledge Agent',
    nameZh: '产品知识 Agent',
    role: '读取产品资料库中的产品定位、目标用户、使用场景、卖点和风险表达',
    input: '产品资料库（品牌、产品、卖点、目标用户、产品事实）',
    output: '结构化的内容重点与风险表达约束',
    expansion: '接入真实产品资料库（PIM/数据库）或 CMS，自动同步产品资料',
  },
  {
    id: 'agent_platform_adaptation',
    name: 'Platform Adaptation Agent',
    nameZh: '平台适配 Agent',
    role: '根据平台选择调整表达方式、文案长度、标签数量、emoji 使用等',
    input: '平台规则（标签范围、正文长度、emoji 政策、CTA 风格）',
    output: '平台风格策略与文案结构模板',
    expansion: '扩展为多平台规则库，支持自定义平台与规则版本管理',
  },
  {
    id: 'agent_content_goal',
    name: 'Content Goal Agent',
    nameZh: '内容目标 Agent',
    role: '根据内容目标确定内容结构与重点排序',
    input: '内容目标（种草帖 / 新品介绍）与其 focusPoints',
    output: '内容结构骨架（开头、卖点排序、CTA 优先级）',
    expansion: '支持更多内容目标（促销、活动招募、品牌叙事等）与目标模板',
  },
  {
    id: 'agent_content_generation',
    name: 'Content Generation Agent',
    nameZh: '内容生成 Agent',
    role: '综合产品资料、平台规则和内容目标，生成标题、正文、标签和 CTA',
    input: '前 3 个 Agent 的输出 + Prompt 上下文',
    output: '当前页面展示的完整文案内容',
    expansion: '接入真实大模型 API，支持多版本生成、A/B 文案与生成温度控制',
  },
  {
    id: 'agent_review',
    name: 'Review Agent',
    nameZh: '发布前审核 Agent',
    role: '进入发布前审核前，预先检查品牌一致性、平台风格、卖点数量、事实风险和 CTA 表达',
    input: '生成内容 + 品牌规则 + 平台规则 + 产品事实',
    output: '审核项列表与改进建议（pass / warning / error）',
    expansion: '支持审核分数、人工审核流、团队协作与规则版本管理',
  },
];

// Agent 运行时状态
export type AgentStatus = 'pending' | 'running' | 'completed';

// 运行时 Agent 节点（用于时间线展示）
export interface AgentRunNode {
  id: string;
  name: string;
  nameZh: string;
  role: string;
  input: string;
  output: string;
  status: AgentStatus;
  sample: string;   // 当前 Demo 下的示例输出
  note: string;     // 简短说明
}

// 平台中文名映射（用于示例输出）
function platformLabel(platform: Platform): string {
  return platform.name;
}

// 根据平台生成示例表达风格描述
function platformStyleSample(platform: Platform): string {
  switch (platform.id) {
    case 'platform_xhs':
      return '表达更生活化、场景化，适度使用 emoji，标题包含场景词';
    case 'platform_ig':
      return '表达更简洁、视觉化，正文以英文为主，标签丰富';
    case 'platform_wechat':
      return '更适合品牌叙事和完整说明，长文为主，emoji 极简';
    default:
      return `按 ${platform.name} 规则调整表达方式`;
  }
}

// 根据内容目标生成示例结构描述
function goalStructureSample(goal: ContentGoal): string {
  switch (goal.id) {
    case 'goal_seeding':
      return '优先突出使用场景、痛点和解决方案，开头场景化，结尾互动 CTA';
    case 'goal_new_product':
      return '优先突出产品定位和核心卖点，结构清晰，购买引导明确';
    default:
      return `按「${goal.name}」目标确定内容结构`;
  }
}

// 根据当前 Prompt 上下文，生成每个 Agent 的运行时节点（含示例输出）
export function buildAgentRunNodes(
  brand: Brand,
  product: Product,
  platform: Platform,
  goal: ContentGoal
): AgentRunNode[] {
  const sellingPoints = product.coreSellingPoints.slice(0, 2).join('、');

  return [
    {
      id: 'agent_product_knowledge',
      name: 'Product Knowledge Agent',
      nameZh: '产品知识 Agent',
      role: '读取产品资料库中的产品定位、目标用户、使用场景、卖点和风险表达',
      input: '产品资料库（品牌、产品、卖点、目标用户、产品事实）',
      output: '结构化的内容重点与风险表达约束',
      status: 'completed',
      sample: `识别出「${product.name}」的内容重点是 ${product.type}、${sellingPoints} 与「${product.targetUsers.join('、')}」场景。`,
      note: '当前 Demo 中产品资料来自静态数据 src/data/products.ts，模拟 Agent 读取资料库的结果。',
    },
    {
      id: 'agent_platform_adaptation',
      name: 'Platform Adaptation Agent',
      nameZh: '平台适配 Agent',
      role: '根据平台选择调整表达方式、文案长度、标签数量、emoji 使用等',
      input: '平台规则（标签范围、正文长度、emoji 政策、CTA 风格）',
      output: '平台风格策略与文案结构模板',
      status: 'completed',
      sample: `选择「${platformLabel(platform)}」：${platformStyleSample(platform)}；标签 ${platform.tagRange.min}-${platform.tagRange.max} 个，正文 ${platform.bodyLengthRange.min}-${platform.bodyLengthRange.max} 字。`,
      note: '当前 Demo 中平台规则来自静态数据 src/data/platforms.ts，模拟 Agent 应用平台规则的结果。',
    },
    {
      id: 'agent_content_goal',
      name: 'Content Goal Agent',
      nameZh: '内容目标 Agent',
      role: '根据内容目标确定内容结构与重点排序',
      input: '内容目标（种草帖 / 新品介绍）与其 focusPoints',
      output: '内容结构骨架（开头、卖点排序、CTA 优先级）',
      status: 'completed',
      sample: `选择「${goal.name}」目标：${goalStructureSample(goal)}。`,
      note: '当前 Demo 中内容目标来自静态数据 src/data/goals.ts，模拟 Agent 决策内容结构的结果。',
    },
    {
      id: 'agent_content_generation',
      name: 'Content Generation Agent',
      nameZh: '内容生成 Agent',
      role: '综合产品资料、平台规则和内容目标，生成标题、正文、标签和 CTA',
      input: '前 3 个 Agent 的输出 + Prompt 上下文',
      output: '当前页面展示的完整文案内容',
      status: 'completed',
      sample: `生成 ${brand.name} ${product.name} 在 ${platformLabel(platform)} 的「${goal.name}」文案，包含标题、正文、标签与 CTA。`,
      note: '当前 Demo 使用 mockGenerator（静态模板填充），未接入真实大模型 API，生成结果来自 src/data/templates.ts。',
    },
    {
      id: 'agent_review',
      name: 'Review Agent',
      nameZh: '发布前审核 Agent',
      role: '进入发布前审核前，预先检查品牌一致性、平台风格、卖点数量、事实风险和 CTA 表达',
      input: '生成内容 + 品牌规则 + 平台规则 + 产品事实',
      output: '审核项列表与改进建议（pass / warning / error）',
      status: 'completed',
      sample: `对生成内容预检品牌一致性、平台风格、事实风险与 CTA 表达，生成审核项并提交至第五步「发布前审核」。`,
      note: '当前 Demo 中审核逻辑来自 src/engine/reviewEngine.ts，基于静态规则模拟审核结果。',
    },
  ];
}

// 核心架构节点（用于 /workflow 页面流程图）
export const ARCHITECTURE_NODES: { id: string; label: string; desc: string }[] = [
  {
    id: 'kb_product',
    label: 'Product Knowledge Base',
    desc: '产品资料库：定位、目标用户、使用场景、卖点、风险表达',
  },
  {
    id: 'kb_platform',
    label: 'Platform Rules',
    desc: '平台规则库：标签范围、正文长度、emoji 政策、CTA 风格',
  },
  {
    id: 'kb_goal',
    label: 'Content Goal Templates',
    desc: '内容目标模板：种草帖、新品介绍等结构骨架',
  },
  {
    id: 'agent_gen',
    label: 'Content Generation Agent',
    desc: '内容生成 Agent：综合上下文生成标题、正文、标签、CTA',
  },
  {
    id: 'agent_review',
    label: 'Review Agent',
    desc: '发布前审核 Agent：品牌一致性、平台风格、事实风险',
  },
  {
    id: 'human_loop',
    label: 'Human Review Loop',
    desc: '人工审核回路：人在环中确认与放行发布',
  },
];

// 未来扩展方向
export const FUTURE_EXTENSIONS: { title: string; desc: string; primary?: boolean }[] = [
  {
    title: '接入真实大模型 API',
    desc: '将 Content Generation Agent 与 Review Agent 接入真实大模型 API，替换当前 mockGenerator',
    primary: true,
  },
  {
    title: '自定义品牌规则',
    desc: '支持品牌规则的可视化配置与版本管理，覆盖语气词、禁用词与一致性约束',
  },
  {
    title: '多平台规则库',
    desc: '扩展更多平台规则，支持小红书、Instagram、微信公众号之外的抖音、视频号、TikTok 等',
  },
  {
    title: '内容审核分数',
    desc: '为 Review Agent 输出可解释的审核分数与多维度权重，支持阈值放行',
  },
  {
    title: '提示词版本管理',
    desc: '支持提示词模板与品牌规则的版本管理（作为辅助能力，非当前 MVP 核心）',
  },
  {
    title: '团队协作与人工审核流',
    desc: '支持多人协作、审核任务分配、二次复核与发布权限控制',
  },
  {
    title: '接入真实产品资料库',
    desc: '将静态产品资料库替换为真实 PIM/CMS/数据库，自动同步产品资料',
  },
];
