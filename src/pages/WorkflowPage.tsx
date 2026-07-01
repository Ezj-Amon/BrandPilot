import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AGENT_DEFINITIONS, ARCHITECTURE_NODES, FUTURE_EXTENSIONS } from '@/data/agents';

// /workflow 页面：说明 BrandPilot 的内部 Agent 编排架构
// 目的：让评委清楚看到 BrandPilot 不是普通 prompt 模板，而是一个内容运营 Agent 编排流程
export default function WorkflowPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* 页面头部 */}
        <div>
          <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
            Agent Workflow · 内部架构说明
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            BrandPilot Agent Workflow
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600 leading-relaxed">
            BrandPilot 的内部架构不是普通 prompt 模板，而是一个面向品牌内容运营的
            Agent 编排流程：多个可解释的 Agent 步骤协同完成内容生产与发布前审核。
            本页说明当前 MVP 的状态、核心架构、Agent 说明与未来扩展方向。
          </p>
        </div>

        {/* 模块 1：当前 MVP 状态 */}
        <section className="mt-10 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-amber-900">1. 当前 MVP 状态</h2>
          <p className="mt-3 text-sm text-amber-800 leading-relaxed">
            当前版本为参赛 MVP，使用静态示例数据模拟 AI 内容生成与发布前审核流程，
            <span className="font-semibold">暂未接入真实大模型 API</span>。
            页面中展示的生成结果、Agent 执行链路与审核项均基于静态数据模拟，
            用于表达 BrandPilot 的产品逻辑和未来架构方向。
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-amber-800 list-disc pl-5">
            <li>
              虚构案例品牌与产品：LumaCarry、Voyage Pack、Metro Pack、Flex Sleeve 均为虚构案例。
            </li>
            <li>当前没有接入真实 AI API，生成与审核结果是基于静态示例数据模拟 Agent 工作流。</li>
            <li>页面用于展示 BrandPilot 的产品逻辑和未来架构方向。</li>
          </ul>
        </section>

        {/* 模块 2：核心架构 */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">2. 核心架构</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            从产品资料库与规则库出发，经由内容生成 Agent 与审核 Agent，最终进入人工审核回路。
          </p>

          {/* 流程图：纵向卡片 + 向下箭头 */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <ol className="space-y-3">
              {ARCHITECTURE_NODES.map((node, index) => (
                <li key={node.id}>
                  <div className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-lg p-4">
                    {/* 序号圆点 */}
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {node.label}
                      </div>
                      <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                        {node.desc}
                      </p>
                    </div>
                  </div>

                  {/* 节点间向下的箭头（最后一个节点不显示） */}
                  {index < ARCHITECTURE_NODES.length - 1 && (
                    <div className="flex justify-center py-1.5 text-gray-300" aria-hidden>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="5 12 12 19 19 12" />
                      </svg>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 模块 3：Agent 说明表 */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">3. Agent 说明表</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            当前 MVP 由 5 个 Agent 串联组成内容生产与审核流水线。
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden bg-white">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium border-b border-gray-200">
                    名称
                  </th>
                  <th className="text-left px-4 py-3 font-medium border-b border-gray-200">
                    作用
                  </th>
                  <th className="text-left px-4 py-3 font-medium border-b border-gray-200">
                    输入
                  </th>
                  <th className="text-left px-4 py-3 font-medium border-b border-gray-200">
                    输出
                  </th>
                  <th className="text-left px-4 py-3 font-medium border-b border-gray-200">
                    可扩展方向
                  </th>
                </tr>
              </thead>
              <tbody>
                {AGENT_DEFINITIONS.map((agent) => (
                  <tr key={agent.id} className="align-top">
                    <td className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{agent.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{agent.nameZh}</div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 leading-relaxed">
                      {agent.role}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 leading-relaxed">
                      {agent.input}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 leading-relaxed">
                      {agent.output}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-gray-600 leading-relaxed">
                      {agent.expansion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 模块 4：未来扩展方向 */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">4. 未来扩展方向</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            后续可在当前 Agent 编排基础上，向真实大模型 API 与多 Agent 协作系统演进。
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUTURE_EXTENSIONS.map((item) => (
              <div
                key={item.title}
                className={`rounded-lg p-5 border ${
                  item.primary
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-base font-semibold ${
                      item.primary ? 'text-indigo-700' : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.primary && (
                    <span className="text-xs text-indigo-600 font-medium px-1.5 py-0.5 bg-indigo-100 rounded">
                      近期
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 模块 5：产品资料库说明（轻量） */}
        <section className="mt-10 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900">5. 产品资料库（轻量模块）</h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            产品资料库是 Agent 的输入来源，当前作为轻量模块存在，不做复杂产品管理。
            它保存<span className="font-medium text-gray-800">产品定位、目标用户、使用场景、核心卖点、风险表达</span>，
            当前使用虚构品牌 <span className="font-mono">LumaCarry</span> 的虚拟产品作为演示案例。
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-600 list-disc pl-5">
            <li>
              <span className="font-medium text-gray-800">Voyage Pack</span>：短途旅行背包，第一阶段完整支持生成与审核流程。
            </li>
            <li>
              <span className="font-medium text-gray-800">Metro Pack</span>：城市通勤背包，后续扩展案例。
            </li>
            <li>
              <span className="font-medium text-gray-800">Flex Sleeve</span>：笔记本电脑内胆包，后续扩展案例。
            </li>
            <li>当前 Demo 不新增真实 CRUD、数据库、登录、权限管理。</li>
          </ul>
        </section>

        {/* 模块 6：明确虚拟和模拟状态 */}
        <section className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900">6. 虚拟与模拟状态说明</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc pl-5 leading-relaxed">
            <li>LumaCarry、Voyage Pack、Metro Pack、Flex Sleeve 均为虚构案例。</li>
            <li>当前没有接入真实 AI API。</li>
            <li>当前生成和审核结果是基于静态示例数据模拟 Agent 工作流。</li>
            <li>页面用于展示 BrandPilot 的产品逻辑和未来架构方向。</li>
          </ul>
        </section>

        {/* 底部 CTA：返回工作台或首页 */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/workbench"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            进入工作台体验
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
