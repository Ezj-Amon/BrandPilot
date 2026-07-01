// Platform Adaptation Agent
// 输入：Product Brief + 用户选择的平台
// 输出：Platform Brief（平台表达风格、内容长度建议、标签建议、CTA 风格建议）

import { Platform } from '@/engine/types';
import { ProductBrief, PlatformBrief } from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 根据平台推导表达风格关键词
function inferStyleKeywords(platform: Platform): string[] {
  switch (platform.id) {
    case 'platform_xhs':
      return ['生活化', '场景化', '适度 emoji', '互动感'];
    case 'platform_ig':
      return ['简洁视觉化', '英文为主', '标签丰富', '视觉驱动'];
    case 'platform_wechat':
      return ['品牌叙事', '长文深度', 'emoji 极简', '完整说明'];
    default:
      return ['贴合平台风格'];
  }
}

// 生成 Platform Brief
export async function runPlatformAdaptationAgent(
  _productBrief: ProductBrief,
  platform: Platform,
): Promise<PlatformBrief> {
  await delay(300);

  const { min: tMin, max: tMax } = platform.tagRange;
  const { min: bMin, max: bMax } = platform.bodyLengthRange;

  return {
    platformId: platform.id,
    styleKeywords: inferStyleKeywords(platform),
    bodyLengthAdvice: `正文建议 ${bMin}-${bMax} 字`,
    tagAdvice: `建议 ${tMin}-${tMax} 个标签，结合场景与产品词`,
    ctaStyleAdvice: platform.ctaStyle,
    emojiPolicy: platform.emojiPolicy,
    language: platform.language,
    tagRange: { ...platform.tagRange },
    bodyLengthRange: { ...platform.bodyLengthRange },
    generatedAt: new Date().toISOString(),
  };
}
