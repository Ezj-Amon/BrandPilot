import { ContentGenerator, GeneratedContent, PromptContext, ContentTemplate } from '@/engine/types';
import { getTemplate } from '@/data/templates';
import { generateSessionId } from '@/utils/sessionId';

// 占位符替换：{productName} {capacity} {material} {sellingPoint1} {brandName} 等
function fillTemplate(text: string, ctx: PromptContext): string {
  const { brand, product } = ctx;
  let result = text;
  result = result.replace(/\{brandName\}/g, brand.name);
  result = result.replace(/\{productName\}/g, product.name);
  result = result.replace(/\{productType\}/g, product.type);
  result = result.replace(/\{capacity\}/g, product.capacity || '');
  result = result.replace(/\{material\}/g, product.material || '');
  result = result.replace(/\{sellingPoint1\}/g, product.coreSellingPoints[0] || '');
  result = result.replace(/\{sellingPoint2\}/g, product.coreSellingPoints[1] || '');
  result = result.replace(/\{sellingPoint3\}/g, product.coreSellingPoints[2] || '');
  result = result.replace(/\{sellingPoint4\}/g, product.coreSellingPoints[3] || '');
  return result;
}

// 模拟网络延迟
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockGenerator: ContentGenerator = {
  async generate(ctx: PromptContext): Promise<GeneratedContent> {
    await delay(800); // 模拟生成耗时

    const template: ContentTemplate | null = getTemplate(ctx.product.id, ctx.platform.id, ctx.goal.id);

    // 如果没有对应模板，返回兜底内容
    const title = template ? fillTemplate(template.title, ctx) : `${ctx.product.name} - ${ctx.goal.name}`;
    const body = template ? fillTemplate(template.body, ctx) : `${ctx.product.name} 是一款 ${ctx.product.type}。`;
    const tags = template ? template.tags : [];
    const cta = template ? fillTemplate(template.cta, ctx) : '了解更多';

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
  },
};
