import { Link } from 'react-router-dom'

// 首页 Hero 区域：产品定位 + 大标题 + 一句话定位 + 差异化提示 + 主次按钮 + 虚拟声明
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 text-center">
        {/* 产品定位标签 */}
        <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
          AI 内容运营工作台 · 比赛 Demo
        </span>

        {/* 大标题 */}
        <h1 className="mt-4 text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
          BrandPilot
        </h1>

        {/* 副标题 */}
        <p className="mt-4 text-xl sm:text-2xl text-indigo-600 font-medium">
          面向早期 DTC 品牌与小团队的内容运营工作台
        </p>

        {/* 一句话定位 */}
        <p className="mt-6 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
          不是单纯的 AI 文案生成器，而是把内容规划、平台适配、文案生成、发布前审核串成一条可复用的内容生产流程
        </p>

        {/* 差异化提示 */}
        <p className="mt-3 max-w-2xl mx-auto text-sm text-emerald-700 font-medium">
          差异化重点：发布前审核 + 品牌一致性检查
        </p>

        {/* MVP 状态提示 */}
        <p className="mt-3 max-w-2xl mx-auto text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 inline-block">
          当前为参赛 MVP：使用静态示例数据模拟 Agent 工作流，暂未接入真实大模型 API
        </p>

        {/* 主次按钮 */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/workbench"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            进入工作台
          </Link>
          <Link
            to="/workflow"
            className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            查看 Agent Workflow
          </Link>
        </div>

        {/* 虚拟案例提示 */}
        <p className="mt-8 text-xs text-gray-400">
          页面中的品牌与产品（LumaCarry、Voyage Pack、Metro Pack、Flex Sleeve）均为虚构案例，仅用于展示 BrandPilot 的内容运营工作流
        </p>
      </div>
    </section>
  )
}
