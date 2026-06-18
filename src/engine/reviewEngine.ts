import { GeneratedContent, PromptContext, ReviewResult, ReviewItem } from '@/engine/types';
import { brandRules } from './rules/brandRules';
import { platformRules } from './rules/platformRules';
import { factRules } from './rules/factRules';

const allRules = [...brandRules, ...platformRules, ...factRules];

// 对生成内容执行全部审核规则
export function reviewContent(content: GeneratedContent, ctx: PromptContext): ReviewResult {
  const items: ReviewItem[] = allRules.map((rule, idx) => {
    const item = rule(content, ctx);
    // 确保有 id
    return { ...item, id: item.id || `review_${idx}` };
  });

  const summary = {
    pass: items.filter((i) => i.severity === 'pass').length,
    warning: items.filter((i) => i.severity === 'warning').length,
    error: items.filter((i) => i.severity === 'error').length,
  };

  return {
    sessionId: content.sessionId,
    contentId: content.id,
    items,
    summary,
  };
}
