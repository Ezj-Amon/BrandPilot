// 4 个痛点卡片，网格布局
interface PainPoint {
  icon: string
  title: string
  description: string
}

// 痛点数据
const PAIN_POINTS: PainPoint[] = [
  {
    icon: '🎨',
    title: '多平台风格不一致',
    description:
      '同一产品在小红书、Instagram、公众号需要不同表达，小团队没有统一标准',
  },
  {
    icon: '📝',
    title: '卖点表达不稳定',
    description:
      '每次写文案都重新组织卖点，容易堆砌、与产品事实不符',
  },
  {
    icon: '🔍',
    title: '人工审核成本高',
    description:
      '发布前要检查品牌调性、平台风格、CTA、标签，标准不统一且耗时',
  },
  {
    icon: '🤖',
    title: 'AI 工具不懂审核',
    description:
      '传统 AI 只能生成文字，无法完成"规划—生成—审核"闭环',
  },
]

export default function PainPoints() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* 区块标题 */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        DTC 品牌内容运营的常见痛点
      </h2>

      {/* 痛点卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PAIN_POINTS.map((point) => (
          <div
            key={point.title}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            {/* 图标 */}
            <div className="text-3xl mb-3">{point.icon}</div>
            {/* 标题 */}
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {point.title}
            </h3>
            {/* 描述 */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
