# BrandPilot Phase 1 MVP Spec

## Why
BrandPilot 需要一个可跑通的最小 Demo，让比赛评委在 3–5 分钟内体验完整闭环：产品资料 → 平台选择 → 内容目标 → 内容生成 → 发布前审核。重点是展示审核环节作为核心差异化价值，而非普通 AI 文案生成器。

## What Changes
- 新建 Vite + React + TypeScript + Tailwind 项目骨架
- 实现 engine 分层：promptBuilder / mockGenerator / aiGenerator / generatorIndex / reviewEngine
- 第一阶段只完整支持 Voyage Pack × {小红书, Instagram, 微信公众号} × {种草帖, 新品介绍}
- Metro Pack / Flex Sleeve 仅做展示卡片，不接入生成流程
- 审核规则只做 6 条：绝对化用语、禁用词、标签数量、Instagram 语言、防泼水夸大、CTA 强销售
- 保留一个故意触发警告的案例：Voyage Pack × 小红书 × 种草帖，内容包含"完全防水""全网最好的短途背包""标签数量不足""立即下单抢购"
- 产品资料支持编辑：品牌名、产品名、产品类型、核心卖点、禁用词
- 首页轻量化，重点放在可交互工作台
- 顶部 5 步进度条，底部 Session ID

## Impact
- Affected specs: 无（首个 spec）
- Affected code: 全新项目，从零搭建

## ADDED Requirements

### Requirement: Engine 分层架构
系统 SHALL 提供 engine 层，包含 promptBuilder、mockGenerator、aiGenerator、generatorIndex、reviewEngine 五个模块，mockGenerator 与 aiGenerator 实现同一 ContentGenerator 接口，通过 generatorIndex 切换。

#### Scenario: 切换生成器
- **WHEN** 环境变量或配置指定使用 mock
- **THEN** generatorIndex 返回 mockGenerator 实例
- **WHEN** 配置指定使用 ai
- **THEN** generatorIndex 返回 aiGenerator 实例（第一阶段不实现真实调用，仅预留接口）

### Requirement: 产品资料编辑
系统 SHALL 支持在工作台 Step 1 编辑当前产品资料，包括品牌名、产品名、产品类型、核心卖点、禁用词。编辑结果参与后续生成与审核。

#### Scenario: 编辑产品资料
- **WHEN** 用户在 ProductStep 展开编辑器并修改禁用词
- **THEN** 后续生成与审核使用更新后的禁用词列表

### Requirement: 平台与目标选择
系统 SHALL 支持选择小红书 / Instagram / 微信公众号三个平台，以及种草帖 / 新品介绍两个内容目标。

#### Scenario: 切换平台
- **WHEN** 用户从 Instagram 切换到小红书
- **THEN** 重新生成时使用小红书的平台风格规则与模板

### Requirement: 内容生成
系统 SHALL 基于 (产品 × 平台 × 目标) 组合生成标题、正文、标签、CTA 四部分内容。第一阶段使用 mockGenerator 从 templates.ts 取模板填充。

#### Scenario: 故意触发警告的案例
- **WHEN** 用户选择 Voyage Pack × 小红书 × 种草帖
- **THEN** 生成的标题或正文包含"全网最好的短途背包"
- **AND** 正文包含"完全防水"
- **AND** 标签数量少于小红书要求的最小值
- **AND** CTA 包含"立即下单抢购"

### Requirement: 审核规则（6 条）
系统 SHALL 实现以下 6 条审核规则，每条输出 { ruleName, category, severity, message, suggestion, evidence }：

1. **brand.absolute** — 绝对化用语检查：扫描"最/第一/唯一/顶级/全网最低/绝对/最佳/全网最好"等词，命中为 error
2. **brand.banned** — 禁用词检查：扫描 brand.bannedWords，命中为 error
3. **brand.ctaHardSell** — CTA 强销售检查：CTA 含"立即下单/抢购/赶紧买/马上抢"等，命中为 warning
4. **platform.tagCount** — 标签数量检查：不在 platform.tagRange 范围内为 warning
5. **platform.instagramLanguage** — Instagram 语言检查：Instagram 平台下中文占比 > 30% 为 warning
6. **fact.waterExaggeration** — 防泼水夸大检查：产品 facts 中 water_resistance 为"防泼水"时，内容出现"完全防水/可浸泡/潜水"为 error

#### Scenario: 审核发现问题
- **WHEN** 生成内容命中任一规则
- **THEN** ReviewStep 展示对应 ReviewItem，颜色区分 pass/warning/error
- **AND** 每条可展开查看 evidence（命中文本片段）与 suggestion

### Requirement: 5 步工作台流程
系统 SHALL 提供 5 步工作台：ProductStep → PlatformStep → GoalStep → GenerateStep → ReviewStep，顶部 ProgressBar 始终可见。

#### Scenario: 完整流程
- **WHEN** 用户从首页点击"进入工作台"
- **THEN** 进入 WorkbenchPage，ProgressBar 显示 Step 1
- **WHEN** 用户依次完成选择并点击生成
- **THEN** 自动流转到 ReviewStep 展示审核结果

### Requirement: Session ID
系统 SHALL 在每次生成时生成 Session ID（时间戳 + 随机串），展示在工作台底部用于留档。

### Requirement: 虚拟品牌约束
系统 SHALL 只使用虚拟品牌 LumaCarry 与虚拟产品 Voyage Pack / Metro Pack / Flex Sleeve，不出现任何真实公司、品牌、产品名、ASIN、电商链接。

## Scope Exclusions (第一阶段不做)
- 36 个完整模板（只覆盖 Voyage Pack × 3 平台 × 2 目标 = 6 个模板，其中 1 个故意带问题）
- 历史记录
- localStorage 持久化
- PDF / Markdown 导出
- 暗色模式
- 多平台并排对比
- 规则可视化编辑
- 登录 / 数据库 / 真实 AI 调用 / 多用户协作 / 支付
