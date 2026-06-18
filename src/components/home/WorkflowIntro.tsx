// 5 步工作流示意，id="workflow"
interface WorkflowStep {
  title: string
  description: string
  isReview?: boolean
}

// 工作流步骤数据
const STEPS: WorkflowStep[] = [
  {
    title: '产品资料录入',
    description: '结构化录入产品基础信息与卖点',
  },
  {
    title: '选择发布平台',
    description: '适配小红书、Instagram、公众号等',
  },
  {
    title: '选择内容目标',
    description: '种草、转化、品牌曝光等不同目标',
  },
  {
    title: 'AI 生成内容',
    description: '基于资料与目标生成多平台文案',
  },
  {
    title: '发布前审核',
    description: '审核品牌调性、平台风格、合规性',
    isReview: true,
  },
]

export default function WorkflowIntro() {
  return (
    <section id="workflow" className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          BrandPilot 工作流
        </h2>

        {/* 5 个步骤横向排列，用箭头连接 */}
        <div className="flex items-stretch justify-center gap-2 overflow-x-auto">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex items-stretch">
              {/* 单个步骤卡片 */}
              <div
                className={`flex flex-col items-center w-44 p-4 rounded-lg border ${
                  step.isReview
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* 圆形数字 */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-3 ${
                    step.isReview
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {index + 1}
                </div>
                {/* 标题 */}
                <h3
                  className={`text-sm font-semibold text-center mb-1 ${
                    step.isReview ? 'text-emerald-700' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </h3>
                {/* 一句话描述 */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  {step.description}
                </p>
                {/* 审核步骤强调标识 */}
                {step.isReview && (
                  <span className="mt-2 text-xs text-emerald-600 font-medium">
                    核心环节
                  </span>
                )}
              </div>

              {/* 步骤之间的箭头（最后一步不显示） */}
              {index < STEPS.length - 1 && (
                <div className="flex items-center px-1 text-gray-300">
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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
