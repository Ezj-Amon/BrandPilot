// 5 步进度条组件，显示当前步骤
// 已完成的前置步骤可点击返回，当前步骤和后续步骤不可点击
interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onStepClick?: (step: 1 | 2 | 3 | 4 | 5) => void;
}

// 5 个步骤标签
const STEPS = [
  '产品资料',
  '选择平台',
  '内容目标',
  '生成内容',
  '发布前审核',
]

export default function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3 | 4 | 5
          const isCurrent = step === currentStep
          const isCompleted = step < currentStep
          // 只有已完成的前置步骤可点击
          const isClickable = isCompleted && !!onStepClick

          const circleClass = isCurrent
            ? 'bg-indigo-600 text-white'
            : isCompleted
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-400'

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
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${circleClass} ${
                    isClickable
                      ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300 hover:ring-offset-1 transition'
                      : isCurrent
                        ? 'cursor-default'
                        : 'cursor-not-allowed'
                  }`}
                  aria-disabled={!isClickable}
                  title={
                    isClickable
                      ? `返回第 ${step} 步：${label}`
                      : isCurrent
                        ? `当前步骤：${label}`
                        : '尚未到达'
                  }
                >
                  {step}
                </button>
                <span
                  className={`text-xs whitespace-nowrap ${labelClass} ${
                    isClickable ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => isClickable && onStepClick?.(step)}
                >
                  {label}
                </span>
              </div>

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
