# BrandPilot

> 面向早期 DTC 品牌与小型运营团队的 AI 内容运营工作台（参赛 Demo）

## 一句话介绍

BrandPilot 把"产品资料录入 → 平台选择 → 内容目标选择 → 内容生成 → 发布前审核"整合成一条可复用的内容生产流程，重点不是单纯生成文案，而是把"发布前审核"与"品牌一致性检查"纳入内容生产闭环。

## 项目背景

早期 DTC 品牌、跨境电商小团队在多平台内容运营时，常遇到：内容方向不稳定、产品卖点表达混乱、平台文案风格不匹配、人工审核成本高等问题。传统 AI 文案工具只能生成文字，无法同时理解品牌规则、产品事实、平台差异和审核标准。

BrandPilot 希望把内容生产从"临时灵感"变成"稳定流程"，让小团队也能建立可复用的内容工作流。本项目为 AI 应用创意比赛的初赛 Demo，聚焦可体验、可讲清楚的最小可行版本。

## 核心功能

- **产品资料录入**：结构化录入品牌信息、产品资料、核心卖点、禁用词
- **平台选择**：适配小红书 / Instagram / 微信公众号的不同风格规则
- **内容目标选择**：种草帖 / 新品介绍等不同目标驱动生成方向
- **内容生成**：基于产品事实与内容目标生成标题、正文、标签、CTA
- **发布前审核（核心亮点）**：6 条规则检查绝对化用语、禁用词、标签数量、平台语言、事实夸大、CTA 强销售，输出修改建议与命中证据
- **Session ID 留档**：每次生成结果带可复制的 Session ID，便于比赛留档与追溯

## Demo 流程

首页 → 进入工作台 → 编辑产品资料 → 选择平台和内容目标 → 生成内容 → 审核发现问题 → 展示修改建议

工作台为 5 步闭环：
1. 产品资料录入
2. 选择发布平台
3. 选择内容目标
4. 生成内容
5. 发布前审核

## 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式**：Tailwind CSS 3
- **路由**：React Router 6
- **状态管理**：React useReducer（无额外状态库）
- **引擎分层**：promptBuilder / mockGenerator / aiGenerator（预留）/ generatorIndex / reviewEngine

## 本地运行方式

前置要求：Node.js 18+ 与 npm。

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

启动后访问终端提示的地址（默认 http://localhost:5173）。

## 构建方式

```bash
# 类型检查 + 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

构建产物输出到 `dist/` 目录。

## 部署方式

本项目为纯前端静态应用，适合部署到 Vercel、Cloudflare Pages、Netlify 等静态托管平台。

### 通用部署参数

| 配置项 | 值 |
| --- | --- |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Vercel

1. 导入 Git 仓库
2. Framework Preset 选择 `Vite`
3. Build Command 填 `npm run build`，Output Directory 填 `dist`
4. 部署即可，根路径访问无需额外配置

### Cloudflare Pages

1. 创建项目并连接 Git 仓库
2. Build command 填 `npm run build`，Build output directory 填 `dist`
3. 部署即可

### GitHub Pages（子路径部署需额外配置）

如果部署到 `https://<user>.github.io/<repo>/` 这种子路径，需要同时设置 Vite 的 `base` 与 React Router 的 `basename`，否则会出现资源 404 或路由 404。

1. 修改 `vite.config.ts`，在 `defineConfig` 中加入 `base`：

```ts
export default defineConfig({
  base: '/<repo>/',
  // ...其余配置
})
```

2. 修改 `src/App.tsx`，为 `BrowserRouter` 设置 `basename`：

```tsx
<BrowserRouter basename="/<repo>/">
  <Routes>...</Routes>
</BrowserRouter>
```

部署到根域名（如自定义域名或 `<user>.github.io`）时无需上述配置。

## 当前 MVP 范围

**完整支持：**

- 主产品：Voyage Pack
- 平台：小红书 / Instagram / 微信公众号
- 内容目标：种草帖 / 新品介绍
- 审核规则（6 条）：
  1. 绝对化用语检查
  2. 禁用词检查
  3. 标签数量检查
  4. Instagram 语言检查
  5. 防泼水夸大成完全防水检查
  6. CTA 强销售检查

**展示但暂未完整支持：**

- Metro Pack、Flex Sleeve 仅作为展示卡片，后续扩展

**故意触发警告的演示案例：**

Voyage Pack × 小红书 × 种草帖 组合下，生成内容故意包含绝对化用语、夸大表述、标签不足、强销售 CTA，用于演示审核系统的拦截价值。

**暂不包含（后续阶段）：**

- 登录注册 / 多用户协作
- 数据库持久化 / 历史记录
- 真实 AI 接口调用（已预留 `aiGenerator` 接口层）
- 支付 / 后台管理
- PDF / Markdown 导出
- 暗色模式 / 多平台并排对比

## 虚拟品牌声明

本项目为参赛 Demo，所有品牌与产品均为虚构案例，仅用于展示 BrandPilot 的内容运营工作流：

- 虚拟品牌：**LumaCarry**
- 虚拟产品：**Voyage Pack**（短途旅行背包）、**Metro Pack**（城市通勤背包）、**Flex Sleeve**（笔记本电脑内胆包）

本项目**不包含**任何真实公司、真实品牌、真实产品名、真实电商链接、真实 ASIN 或内部资料。LumaCarry 仅为虚拟演示案例，BrandPilot 才是产品本体。

## 参赛说明

- 本项目用于 AI 应用创意比赛初赛 Demo 展示
- 产品本体是 **BrandPilot**（AI 内容运营工作台），不是 LumaCarry 品牌官网
- 核心差异化是"发布前审核"与"品牌一致性检查"，而非普通 AI 文案生成
- 当前 MVP 聚焦 Voyage Pack 作为完整案例，Metro Pack 和 Flex Sleeve 为后续扩展案例
- 引擎层采用分层设计（mockGenerator / aiGenerator / generatorIndex），后续可无缝接入真实 AI 接口
- 每次生成结果带 Session ID，便于比赛留档与开发过程说明
