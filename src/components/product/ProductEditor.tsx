import { useState } from 'react';
import { Brand, Product } from '@/engine/types';

interface ProductEditorProps {
  brand: Brand;
  product: Product;
  onBrandChange: (patch: Partial<Brand>) => void;
  onProductChange: (patch: Partial<Product>) => void;
}

// 产品资料编辑表单，可展开/收起
export default function ProductEditor({
  brand,
  product,
  onBrandChange,
  onProductChange,
}: ProductEditorProps) {
  // 默认收起，由展开按钮控制
  const [expanded, setExpanded] = useState(false);

  // 输入框通用样式
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500';

  return (
    <div className="mt-6">
      {/* 展开/收起按钮 */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        {expanded ? '收起产品资料' : '编辑产品资料'}
      </button>

      {expanded && (
        <div className="mt-4 max-w-2xl space-y-4">
          {/* 品牌名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">品牌名</label>
            <input
              type="text"
              value={brand.name}
              onChange={(e) => onBrandChange({ name: e.target.value })}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          {/* 产品名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">产品名</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onProductChange({ name: e.target.value })}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          {/* 产品类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">产品类型</label>
            <input
              type="text"
              value={product.type}
              onChange={(e) => onProductChange({ type: e.target.value })}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          {/* 核心卖点（每行一个） */}
          <div>
            <label className="block text-sm font-medium text-gray-700">核心卖点（每行一个）</label>
            <textarea
              value={product.coreSellingPoints.join('\n')}
              onChange={(e) => {
                // split('\n') 后过滤空行
                const points = e.target.value.split('\n').filter((s) => s.trim() !== '');
                onProductChange({ coreSellingPoints: points });
              }}
              rows={4}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          {/* 禁用词（每行一个） */}
          <div>
            <label className="block text-sm font-medium text-gray-700">禁用词（每行一个）</label>
            <textarea
              value={brand.bannedWords.join('\n')}
              onChange={(e) => {
                // split('\n') 后过滤空行
                const words = e.target.value.split('\n').filter((s) => s.trim() !== '');
                onBrandChange({ bannedWords: words });
              }}
              rows={4}
              className={`mt-1 ${inputClass}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
