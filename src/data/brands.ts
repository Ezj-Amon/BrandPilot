import { Brand } from '@/engine/types';

// LumaCarry 品牌资料
export const lumaCarry: Brand = {
  id: 'brand_lumacarry',
  name: 'LumaCarry',
  tagline: 'Carry less, experience more',
  toneKeywords: ['简约', '实用', '城市感', '轻户外'],
  antiToneKeywords: ['奢华', '炫富', '土豪'],
  bannedWords: ['最便宜', '全网最低', '极品', '神器'],
};

// 全部品牌列表
export const brands: Brand[] = [lumaCarry];
