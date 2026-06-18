import { ContentGenerator } from '@/engine/types';
import { mockGenerator } from './mockGenerator';
import { aiGenerator } from './aiGenerator';

export type GeneratorMode = 'mock' | 'ai';

// 当前生成器模式，默认 mock
const currentMode: GeneratorMode = 'mock';

// 获取当前生成器实例
export function getGenerator(): ContentGenerator {
  return currentMode === 'ai' ? aiGenerator : mockGenerator;
}

export function getGeneratorMode(): GeneratorMode {
  return currentMode;
}
