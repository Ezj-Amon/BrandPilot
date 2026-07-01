# Checklist

- [ ] `src/agents/` 目录存在，包含 5 个 Agent 模块（productKnowledgeAgent / platformAdaptationAgent / contentStrategyAgent / contentGenerationAgent / reviewAgent）
- [ ] ProductKnowledgeAgent 输出 ProductBrief，包含产品定位、目标用户、使用场景、核心卖点、风险表达约束
- [ ] PlatformAdaptationAgent 输出 PlatformBrief，包含平台表达风格、内容长度建议、标签建议、CTA 风格建议
- [ ] ContentStrategyAgent 输出 ContentStrategy，包含内容主线、表达切口、信息排序、结构建议
- [ ] ContentGenerationAgent 不同平台（小红书/Instagram/微信公众号）与不同内容目标（种草帖/新品介绍）生成不同风格结果
- [ ] ReviewAgent 基于生成内容做规则审核（CTA 硬度、标签数量、场景词缺失、风险表达、卖点数量、平台风格匹配）
- [ ] 工作台步骤 1-3 进入时分别调用对应 Agent 生成 Brief/Strategy 并存入 state
- [ ] 步骤 4 生成内容使用已计算的 Brief/Strategy，不再只依赖模板查找
- [ ] CurrentAgentCard 展示对应 Agent 的真实输出摘要，而非纯静态说明文本
- [ ] 首页 Hero 区域明确说明当前为本地规则驱动的 Agent Workflow，未接入真实大模型 API
- [ ] 未新增登录、数据库、后端服务、真实 AI API、API Key、复杂提示词管理系统、产品 CRUD、权限管理
- [ ] `npm run build` 通过（tsc + vite build 无错误）
