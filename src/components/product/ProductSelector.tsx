import { Product } from '@/engine/types';
import { products } from '@/data/products';

interface ProductSelectorProps {
  selectedProductId: string;
  onSelect: (product: Product) => void;
}

// 产品选择卡片网格
export default function ProductSelector({ selectedProductId, onSelect }: ProductSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => {
        const isSelected = product.id === selectedProductId;
        const isSupported = product.supported;

        // 卡片样式：未支持 / 选中 / 未选中
        const cardClass = !isSupported
          ? 'bg-white rounded-lg p-6 border border-gray-200 shadow-sm cursor-not-allowed opacity-60'
          : isSelected
            ? 'bg-indigo-50 rounded-lg p-6 border border-indigo-600 ring-2 ring-indigo-200 shadow-sm cursor-pointer'
            : 'bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:border-indigo-400 cursor-pointer';

        return (
          <div
            key={product.id}
            className={cardClass}
            onClick={() => {
              if (isSupported) {
                onSelect(product);
              }
            }}
          >
            {/* 即将支持徽章 */}
            {!isSupported && (
              <span className="inline-block mb-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-400 rounded">
                即将支持
              </span>
            )}

            {/* 产品名（大字） */}
            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>

            {/* 产品类型 */}
            <p className="text-sm text-gray-500 mt-1">{product.type}</p>

            {/* 容量/材质（如有） */}
            {(product.capacity || product.material) && (
              <p className="text-sm text-gray-600 mt-2">
                {product.capacity && <span>{product.capacity}</span>}
                {product.capacity && product.material && <span> · </span>}
                {product.material && <span>{product.material}</span>}
              </p>
            )}

            {/* 核心卖点前 2 个（小标签） */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.coreSellingPoints.slice(0, 2).map((point) => (
                <span
                  key={point}
                  className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
