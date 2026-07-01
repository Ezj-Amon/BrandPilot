import { Platform, PlatformBrief, ProductBrief } from '@/engine/types';

// Platform Adaptation Agent：基于 Product Brief + 平台规则计算平台简报
export function runPlatformAdaptation(_productBrief: ProductBrief, platform: Platform): PlatformBrief {
  let expressionStyle: string;
  switch (platform.id) {
    case 'platform_xhs':
      expressionStyle = '生活化、场景化表达，适度使用 emoji，标题包含场景词';
      break;
    case 'platform_ig':
      expressionStyle = '简洁视觉化表达，正文以英文为主，标签丰富';
      break;
    case 'platform_wechat':
      expressionStyle = '品牌叙事风格，长文为主，emoji 极简';
      break;
    default:
      expressionStyle = `按${platform.name}规则调整表达方式`;
      break;
  }

  return {
    expressionStyle,
    bodyLengthAdvice: `${platform.bodyLengthRange.min}-${platform.bodyLengthRange.max} 字`,
    tagAdvice: `${platform.tagRange.min}-${platform.tagRange.max} 个标签`,
    ctaStyleAdvice: platform.ctaStyle,
  };
}
