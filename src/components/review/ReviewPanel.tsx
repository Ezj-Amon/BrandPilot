import { ReviewItem, RuleCategory } from '@/engine/types';
import ReviewItemCard from './ReviewItem';

interface ReviewPanelProps {
  items: ReviewItem[];
}

// 各分类的标题与描述
const categoryConfig: Record<RuleCategory, { title: string; description: string }> = {
  brand: {
    title: '品牌一致性检查',
    description: '绝对化用语、禁用词、品牌语气',
  },
  platform: {
    title: '平台风格匹配检查',
    description: '正文长度、平台语言、场景词',
  },
  fact: {
    title: '事实风险检查',
    description: '产品卖点与事实是否一致',
  },
  cta: {
    title: 'CTA 表达检查',
    description: '是否含强销售用语',
  },
  tag: {
    title: '标签匹配检查',
    description: '标签数量与相关性',
  },
  sellingPoint: {
    title: '卖点数量检查',
    description: '正文卖点是否过多或缺失',
  },
};

// 审核面板：按 6 类分组展示
export default function ReviewPanel({ items }: ReviewPanelProps) {
  const categories: RuleCategory[] = ['brand', 'platform', 'fact', 'cta', 'tag', 'sellingPoint'];

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        // 过滤当前分类下的审核项
        const categoryItems = items.filter((i) => i.category === category);
        // 该分类没有审核项则不显示分组
        if (categoryItems.length === 0) return null;

        const config = categoryConfig[category];
        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
            <p className="text-sm text-gray-500">{config.description}</p>
            <div className="mt-3 space-y-3">
              {categoryItems.map((item) => (
                <ReviewItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
