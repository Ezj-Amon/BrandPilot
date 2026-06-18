import { ContentGenerator, GeneratedContent, PromptContext } from '@/engine/types';
import { mockGenerator } from './mockGenerator';

// 预留：真实 AI 生成器，第一阶段未接入真实接口
// 后续接入时在此处调用真实 AI API，保持接口与 mockGenerator 一致
export const aiGenerator: ContentGenerator = {
  async generate(ctx: PromptContext): Promise<GeneratedContent> {
    // TODO: 接入真实 AI 接口
    // 当前阶段回退到 mockGenerator，保证 Demo 可运行
    return mockGenerator.generate(ctx);
  },
};
