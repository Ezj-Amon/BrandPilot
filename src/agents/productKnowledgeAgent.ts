// Product Knowledge Agent
// 输入：当前产品资料 + 虚拟品牌资料
// 输出：Product Brief（产品定位、目标用户、使用场景、核心卖点、风险表达）

import { Brand, Product } from '@/engine/types';
import { ProductBrief } from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 根据产品类型与目标用户推导使用场景
function inferScenarios(product: Product): string[] {
  const scenarios: string[] = [];
  const type = product.type;
  const users = product.targetUsers;

  if (type.includes('旅行') || type.includes('背包')) {
    scenarios.push('周末短途出行', '周边自驾', '高铁短途');
  }
  if (type.includes('通勤')) {
    scenarios.push('日常通勤', '商务出行');
  }
  if (type.includes('内胆包') || type.includes('电脑')) {
    scenarios.push('办公携带', '会议出行');
  }
  if (users.some((u) => u.includes('旅行')) && !scenarios.includes('周末短途出行')) {
    scenarios.push('周末短途出行');
  }
  if (scenarios.length === 0) {
    scenarios.push('日常使用');
  }
  return scenarios;
}

// 从产品事实中提取风险表达（forbiddenExaggeration）
function extractRiskExpressions(product: Product): string[] {
  const risks: string[] = [];
  for (const fact of product.facts) {
    risks.push(...fact.forbiddenExaggeration);
  }
  return risks;
}

// 生成 Product Brief
export async function runProductKnowledgeAgent(
  brand: Brand,
  product: Product,
): Promise<ProductBrief> {
  await delay(300);

  const positioning = `${brand.name} ${product.name} 是一款面向${product.targetUsers.join('、')}的${product.type}`;
  const scenarios = inferScenarios(product);
  const riskExpressions = extractRiskExpressions(product);

  return {
    productId: product.id,
    positioning,
    targetUsers: [...product.targetUsers],
    scenarios,
    coreSellingPoints: [...product.coreSellingPoints],
    riskExpressions,
    generatedAt: new Date().toISOString(),
  };
}
