import { Brand, Product, ProductBrief } from '@/engine/types';

// 根据目标用户与产品类型推导使用场景
function buildUseScenarios(targetUsers: string[], productType: string): string[] {
  const scenarios: string[] = [];
  for (const user of targetUsers) {
    if (user.includes('周末')) {
      scenarios.push('周末短途出行', '两天一夜旅行');
    } else if (user.includes('短途旅行') || user.includes('短途')) {
      scenarios.push('短途旅行', '周末出游');
    } else if (user.includes('通勤')) {
      scenarios.push('日常通勤', '城市出行');
    } else if (user.includes('笔记本')) {
      scenarios.push('笔记本日常携带', '办公出行');
    } else {
      scenarios.push(`${user}的${productType}`);
    }
  }
  return Array.from(new Set(scenarios));
}

// 从 facts 提取风险表达约束（forbiddenExaggeration 非空的事实）
function buildRiskConstraints(product: Product): string[] {
  return product.facts
    .filter((f) => f.forbiddenExaggeration.length > 0)
    .map((f) => `${f.label}为${f.value}，不可表述为${f.forbiddenExaggeration.join('、')}`);
}

// Product Knowledge Agent：基于产品 + 品牌资料计算产品简报
export function runProductKnowledge(product: Product, _brand: Brand): ProductBrief {
  const parts: string[] = [product.type];
  if (product.capacity) parts.push(`容量 ${product.capacity}`);
  if (product.material) parts.push(`材质 ${product.material}`);
  const positioning = parts.join('，');

  return {
    positioning,
    targetUsers: [...product.targetUsers],
    useScenarios: buildUseScenarios(product.targetUsers, product.type),
    coreSellingPoints: [...product.coreSellingPoints],
    riskConstraints: buildRiskConstraints(product),
  };
}
