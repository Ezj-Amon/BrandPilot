// 核心能力差异化区块：强调"不只是生成，更是完整工作流 + 发布前审核"
interface Capability {
  icon: string
  title: string
  description: string
  isHighlight?: boolean
}

const CAPABILITIES: Capability[] = [
  {
    icon: '📋',
    title: '内容规划',
    description: '产品资料结构化录入，统一卖点与禁用词',
  },
  {
    icon: '🎯',
    title: '平台适配',
    description: '小红书 / Instagram / 公众号 不同风格自动适配',
  },
  {
    icon: '✍️',
    title: '文案生成',
    description: '基于产品事实与内容目标生成标题、正文、标签、CTA',
  },
  {
    icon: '🛡️',
    title: '发布前审核',
    description: '6 条规则检查绝对化用语、禁用词、平台风格、事实一致性',
    isHighlight: true,
  },
]

export default function Differentiators() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* 区块标题 */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          不只是生成文案，更是完整内容工作流
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          核心差异化：把"发布前审核"与"品牌一致性检查"纳入内容生产闭环
        </p>

        {/* 能力卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className={`rounded-lg p-6 border ${
                cap.isHighlight
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="text-3xl mb-3">{cap.icon}</div>
              <h3
                className={`text-base font-semibold mb-2 ${
                  cap.isHighlight ? 'text-emerald-700' : 'text-gray-900'
                }`}
              >
                {cap.title}
                {cap.isHighlight && (
                  <span className="ml-2 text-xs text-emerald-600 font-medium">
                    核心
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
