# BrandPilot

面向 DTC 品牌的 AI 内容运营工作台 Demo。把「产品资料 → 平台选择 → 内容目标 → 内容生成 → 发布前审核」整合成一条可复用的内容生产流程，重点展示审核环节作为核心差异化价值。

## 技术栈

- Vite + React 18 + TypeScript
- React Router v6（前端 SPA 路由）
- Tailwind CSS

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 类型检查 + 生产构建，产物输出到 dist/
npm run preview  # 本地预览生产构建
```

## 部署到 Cloudflare Pages

| 配置项 | 值 |
| --- | --- |
| 框架预设 | 无（或 Vite） |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| 安装命令 | `npm install` |
| 环境变量 | `NODE_VERSION = 20` |

步骤：

1. 在 Cloudflare Pages 控制台新建项目，连接代码仓库。
2. 按上表填写构建配置，并在「Settings → Environment variables」中添加 `NODE_VERSION = 20`。
3. 触发部署，构建产物会输出到 `dist/`。
4. SPA 路由刷新由仓库内的 `public/_redirects` 处理（内容为 `/*  /index.html  200`），构建时会自动复制到 `dist/_redirects`，刷新 `/workbench` 等子路由不会 404。

> 注意：本项目使用 BrowserRouter，刷新子路由依赖 `_redirects`，请勿删除 `public/_redirects` 文件。

## MVP 范围（第一阶段）

- 5 步工作台：产品资料 → 平台选择 → 内容目标 → 内容生成 → 发布前审核，顶部 ProgressBar 始终可见。
- engine 分层：`promptBuilder` / `mockGenerator` / `aiGenerator` / `generatorIndex` / `reviewEngine`，mock 与 ai 实现同一 `ContentGenerator` 接口，默认使用 mock。
- 第一阶段仅完整支持 **Voyage Pack × {小红书, Instagram, 微信公众号} × {种草帖, 新品介绍}** 共 6 个模板，其中「Voyage Pack × 小红书 × 种草帖」为故意触发警告的案例。
- Metro Pack / Flex Sleeve 仅作展示卡片，不接入生成流程。
- 6 条审核规则：绝对化用语、品牌禁用词、CTA 强销售、标签数量、Instagram 语言占比、防泼水夸大。
- 产品资料可编辑：品牌名、产品名、产品类型、核心卖点、禁用词。
- 每次生成产出 Session ID，展示在工作台底部用于留档追溯。

第一阶段不做：36 个完整模板、历史记录、localStorage 持久化、PDF/Markdown 导出、暗色模式、多平台并排对比、规则可视化编辑、登录/数据库/真实 AI 调用/多用户协作/支付。

## 虚拟品牌声明

本项目为比赛 / 演示用途的 Demo，所有品牌与产品均为虚构：

- 虚拟品牌：**LumaCarry**
- 虚拟产品：**Voyage Pack** / **Metro Pack** / **Flex Sleeve**

Demo 中不包含任何真实公司、品牌、产品名、ASIN、电商链接或内部资料。页面底部亦标注「本 Demo 所有品牌与产品均为虚构，仅用于比赛展示」。
