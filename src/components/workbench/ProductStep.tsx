import { Brand, Product } from '@/engine/types';
import ProductSelector from '@/components/product/ProductSelector';
import ProductEditor from '@/components/product/ProductEditor';

interface ProductStepProps {
  brand: Brand;
  product: Product;
  onProductSelect: (product: Product) => void;
  onBrandChange: (patch: Partial<Brand>) => void;
  onProductChange: (patch: Partial<Product>) => void;
  onNext: () => void;
}

// Step 1：选择产品 + 编辑产品资料
export default function ProductStep({
  brand,
  product,
  onProductSelect,
  onBrandChange,
  onProductChange,
  onNext,
}: ProductStepProps) {
  return (
    <div>
      {/* 标题 + 副标题 */}
      <h2 className="text-xl font-bold text-gray-900">第一步：选择产品</h2>
      <p className="mt-1 text-sm text-gray-500">
        选择要生成内容的产品，可展开编辑产品资料
      </p>
      <p className="mt-2 text-xs text-gray-400">
        当前 Demo 以 Voyage Pack 作为完整案例，展示从内容生成到发布前审核的完整流程；Metro Pack 和 Flex Sleeve 为后续扩展案例。
      </p>

      {/* 产品选择卡片 */}
      <div className="mt-6">
        <ProductSelector selectedProductId={product.id} onSelect={onProductSelect} />
      </div>

      {/* 产品资料编辑 */}
      <ProductEditor
        brand={brand}
        product={product}
        onBrandChange={onBrandChange}
        onProductChange={onProductChange}
      />

      {/* 底部下一步按钮 */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
