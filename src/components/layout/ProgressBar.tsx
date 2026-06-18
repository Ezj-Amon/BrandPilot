// 5 步进度条组件，显示当前步骤
interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5
}

// 5 个步骤标签
const STEPS = [
  '产品资料',
  '选择平台',
  '内容目标',
  '生成内容',
  '发布前审核',
]

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3 | 4 | 5
          // 判断步骤状态：当前 / 已完成 / 未到达
          const isCurrent = step === currentStep
          const isCompleted = step < currentStep

          // 圆形数字样式
          const circleClass = isCurrent
            ? 'bg-indigo-600 text-white'
            : isCompleted
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-400'

          // 文字标签样式
          const labelClass = isCurrent
            ? 'text-indigo-600 font-medium'
            : isCompleted
              ? 'text-indigo-700'
              : 'text-gray-400'

          return (
            <div
              key={label}
              className="flex items-center"
              style={{ flex: index === STEPS.length - 1 ? '0 0 auto' : '1 1 auto' }}
            >
              {/* 单个步骤：圆形数字 + 文字标签 */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${circleClass}`}
                >
                  {step}
                </div>
                <span className={`text-xs whitespace-nowrap ${labelClass}`}>
                  {label}
                </span>
              </div>

              {/* 步骤之间的连接线（最后一步不显示） */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-3 mb-5 ${
                    isCompleted ? 'bg-indigo-200' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
