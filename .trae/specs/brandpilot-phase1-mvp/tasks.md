# Tasks

- [x] Task 1: 初始化项目骨架
  - [x] SubTask 1.1: 创建 package.json / vite.config.ts / tsconfig.json / tailwind.config.js / index.html / postcss.config.js
  - [x] SubTask 1.2: 创建 src/main.tsx / src/App.tsx / src/index.css，配置 Tailwind 与路由（首页 / 工作台）
  - [x] SubTask 1.3: 验证 `npm install && npm run dev` 能跑通空白页

- [x] Task 2: 定义 engine 类型与数据层
  - [x] SubTask 2.1: 创建 src/engine/types.ts，定义 Brand / Product / ProductFact / Platform / ContentGoal / GeneratedContent / ReviewItem / ReviewResult / ContentGenerator / PromptContext
  - [x] SubTask 2.2: 创建 src/data/brands.ts（LumaCarry：调性、antiToneKeywords、bannedWords）
  - [x] SubTask 2.3: 创建 src/data/products.ts（Voyage Pack 完整 facts 含 water_resistance=防泼水 + forbiddenExaggeration；Metro Pack / Flex Sleeve 仅基础字段）
  - [x] SubTask 2.4: 创建 src/data/platforms.ts（小红书 tagRange[5,8] 中文；Instagram tagRange[10,15] en；微信公众号 tagRange[3,6] 中文）
  - [x] SubTask 2.5: 创建 src/data/goals.ts（种草帖 / 新品介绍）

- [x] Task 3: 实现 engine 层
  - [x] SubTask 3.1: 创建 src/engine/promptBuilder.ts，build(brand, product, platform, goal) → PromptContext
  - [x] SubTask 3.2: 创建 src/engine/mockGenerator.ts，实现 ContentGenerator 接口，从 templates 取模板填充
  - [x] SubTask 3.3: 创建 src/engine/aiGenerator.ts，预留接口（throw NotImplementedError 或返回 mock 结果）
  - [x] SubTask 3.4: 创建 src/engine/generatorIndex.ts，默认返回 mockGenerator
  - [x] SubTask 3.5: 创建 src/engine/rules/brandRules.ts（absolute / banned / ctaHardSell）
  - [x] SubTask 3.6: 创建 src/engine/rules/platformRules.ts（tagCount / instagramLanguage）
  - [x] SubTask 3.7: 创建 src/engine/rules/factRules.ts（waterExaggeration）
  - [x] SubTask 3.8: 创建 src/engine/reviewEngine.ts，调度 6 条规则，输出 ReviewResult + summary

- [x] Task 4: 编写模板库（含故意带问题案例）
  - [x] SubTask 4.1: 创建 src/data/templates.ts，覆盖 Voyage Pack × {小红书, Instagram, 微信公众号} × {种草帖, 新品介绍} = 6 个模板
  - [x] SubTask 4.2: Voyage Pack × 小红书 × 种草帖 模板故意包含：标题"全网最好的短途背包"、正文"完全防水"、标签数量不足（3 个）、CTA"立即下单抢购"
  - [x] SubTask 4.3: 其他 5 个模板生成基本合规内容（可能触发少量 warning，但不触发 error）

- [x] Task 5: 状态管理与工具
  - [x] SubTask 5.1: 创建 src/store/workbenchStore.ts，useReducer 管理 step / product / platform / goal / editingProduct / generatedContent / reviewResult / loading
  - [x] SubTask 5.2: 创建 src/hooks/useWorkbench.ts 封装 store + 生成 + 审核调用
  - [x] SubTask 5.3: 创建 src/utils/sessionId.ts（时间戳 + 随机串）

- [x] Task 6: 布局与首页
  - [x] SubTask 6.1: 创建 src/components/layout/Header.tsx / Footer.tsx（Footer 含虚拟品牌声明）
  - [x] SubTask 6.2: 创建 src/components/layout/ProgressBar.tsx（5 步，当前步高亮）
  - [x] SubTask 6.3: 创建 src/components/home/Hero.tsx（一句话定位 + 进入工作台按钮）
  - [x] SubTask 6.4: 创建 src/components/home/PainPoints.tsx（4 个痛点卡片）
  - [x] SubTask 6.5: 创建 src/components/home/WorkflowIntro.tsx（5 步流程示意）
  - [x] SubTask 6.6: 创建 src/pages/HomePage.tsx 组合上述组件

- [x] Task 7: 工作台 Step 1–3
  - [x] SubTask 7.1: 创建 src/components/product/ProductSelector.tsx（3 个产品卡片，Voyage Pack 可选，另两个标记"即将支持"）
  - [x] SubTask 7.2: 创建 src/components/product/ProductEditor.tsx（编辑品牌名、产品名、类型、核心卖点、禁用词）
  - [x] SubTask 7.3: 创建 src/components/workbench/ProductStep.tsx 组合 Selector + Editor
  - [x] SubTask 7.4: 创建 src/components/workbench/PlatformStep.tsx（Tab 切换 3 平台）
  - [x] SubTask 7.5: 创建 src/components/workbench/GoalStep.tsx（2 个目标单选卡片）

- [x] Task 8: 工作台 Step 4 生成
  - [x] SubTask 8.1: 创建 src/components/result/ContentResultCard.tsx（标题/正文/标签/CTA 分块展示）
  - [x] SubTask 8.2: 创建 src/components/result/CopyButton.tsx / RegenerateButton.tsx
  - [x] SubTask 8.3: 创建 src/components/workbench/GenerateStep.tsx（loading 态 + 调用 useWorkbench.generate）

- [x] Task 9: 工作台 Step 5 审核
  - [x] SubTask 9.1: 创建 src/components/review/ReviewSummary.tsx（pass/warning/error 计数）
  - [x] SubTask 9.2: 创建 src/components/review/ReviewItem.tsx（颜色标签 + 可展开 evidence/suggestion）
  - [x] SubTask 9.3: 创建 src/components/review/ReviewPanel.tsx（按 brand/platform/fact 三类分组）
  - [x] SubTask 9.4: 创建 src/components/workbench/ReviewStep.tsx 组合上述组件 + Session ID

- [x] Task 10: 组装工作台与端到端验证
  - [x] SubTask 10.1: 创建 src/pages/WorkbenchPage.tsx，组合 ProgressBar + 5 个 Step，底部 Session ID
  - [x] SubTask 10.2: 端到端验证：首页 → 工作台 → 编辑 Voyage Pack → 小红书 + 种草帖 → 生成 → 看到 4 条审核问题 → 切换到 Instagram + 新品介绍 → 看到基本合规结果
  - [x] SubTask 10.3: 验证 `npm run build` 无 TypeScript 错误

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 依赖 Task 2
- Task 5 依赖 Task 3
- Task 6 依赖 Task 1（可与 Task 2–5 并行）
- Task 7 依赖 Task 5
- Task 8 依赖 Task 5、Task 4
- Task 9 依赖 Task 5
- Task 10 依赖 Task 6、7、8、9
