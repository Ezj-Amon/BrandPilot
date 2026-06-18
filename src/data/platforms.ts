import { Platform } from '@/engine/types';

// 小红书平台规则
export const xiaohongshu: Platform = {
  id: 'platform_xhs',
  name: '小红书',
  language: 'zh',
  tagRange: { min: 5, max: 8 },
  bodyLengthRange: { min: 150, max: 500 },
  emojiPolicy: 'moderate',
  ctaStyle: '互动引导（评论/收藏）',
  styleRules: [
    { id: 'xhs_scene', label: '场景感标题', description: '标题应包含使用场景词' },
    { id: 'xhs_emoji', label: '适度 emoji', description: '正文可适度使用 emoji' },
  ],
};

// Instagram 平台规则
export const instagram: Platform = {
  id: 'platform_ig',
  name: 'Instagram',
  language: 'en',
  tagRange: { min: 10, max: 15 },
  bodyLengthRange: { min: 50, max: 300 },
  emojiPolicy: 'moderate',
  ctaStyle: '简短英文 CTA',
  styleRules: [
    { id: 'ig_en', label: '英文为主', description: '正文以英文为主' },
    { id: 'ig_tags', label: '标签丰富', description: '10-15 个标签' },
  ],
};

// 微信公众号平台规则
export const wechat: Platform = {
  id: 'platform_wechat',
  name: '微信公众号',
  language: 'zh',
  tagRange: { min: 3, max: 6 },
  bodyLengthRange: { min: 400, max: 1500 },
  emojiPolicy: 'minimal',
  ctaStyle: '引导关注/活动',
  styleRules: [
    { id: 'wechat_narrative', label: '品牌叙事', description: '适合品牌故事与长文' },
  ],
};

// 全部平台列表
export const platforms: Platform[] = [xiaohongshu, instagram, wechat];
