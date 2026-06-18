import { Product } from '@/engine/types';

// Voyage Pack：短途旅行背包，第一阶段完整支持
export const voyagePack: Product = {
  id: 'product_voyage_pack',
  brandId: 'brand_lumacarry',
  name: 'Voyage Pack',
  type: '短途旅行背包',
  capacity: '22L',
  material: '防泼水尼龙',
  coreSellingPoints: ['快开取物', '干湿分离', '隐藏防盗口袋', '可挂行李箱'],
  targetUsers: ['周末出行者', '短途旅行爱好者'],
  facts: [
    {
      key: 'water_resistance',
      label: '防水性能',
      value: '防泼水',
      forbiddenExaggeration: ['完全防水', '可浸泡', '潜水', '可淋雨长时间使用'],
    },
    {
      key: 'capacity',
      label: '容量',
      value: '22L',
      forbiddenExaggeration: [],
    },
  ],
  supported: true,
};

// Metro Pack：城市通勤背包，第一阶段暂不支持
export const metroPack: Product = {
  id: 'product_metro_pack',
  brandId: 'brand_lumacarry',
  name: 'Metro Pack',
  type: '城市通勤背包',
  capacity: '18L',
  material: 'Cordura 尼龙',
  coreSellingPoints: ['15寸笔记本仓', '磁吸快取', '减压肩带', '简约外观'],
  targetUsers: ['通勤族'],
  facts: [],
  supported: false,
};

// Flex Sleeve：笔记本电脑内胆包，第一阶段暂不支持
export const flexSleeve: Product = {
  id: 'product_flex_sleeve',
  brandId: 'brand_lumacarry',
  name: 'Flex Sleeve',
  type: '笔记本电脑内胆包',
  material: '潜水料',
  coreSellingPoints: ['超薄贴合', '软绒内里', '多尺寸兼容', '可单独携带'],
  targetUsers: ['笔记本用户'],
  facts: [],
  supported: false,
};

// 全部产品列表
export const products: Product[] = [voyagePack, metroPack, flexSleeve];
