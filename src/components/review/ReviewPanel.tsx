import { ReviewItem, RuleCategory } from '@/engine/types';
import ReviewItemCard from './ReviewItem';

interface ReviewPanelProps {
  items: ReviewItem[];
}

// 各分类的标题与描述
const categoryConfig: Record<RuleCategory, { title: string; description: string }> = {
  brand: {
    title: '品牌规则检查',
    description: '绝对化用语、禁用词、CTA 风格',
  },
  platform: {
    title: '平台风格检查',
    description: '标签数量、平台语言',
  },
  fact: {
    title: '事实一致性检查',
    description: '产品卖点与事实是否一致',
  },
};

// 审核面板：按 brand/platform/fact 三类分组展示
export default function ReviewPanel({ items }: ReviewPanelProps) {
  const categories: RuleCategory[] = ['brand', 'platform', 'fact'];

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
