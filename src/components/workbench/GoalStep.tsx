import { ContentGoal } from '@/engine/types';
import { goals } from '@/data/goals';

interface GoalStepProps {
  selectedGoalId: string;
  onSelect: (goal: ContentGoal) => void;
  onNext: () => void;
  onBack: () => void;
}

// Step 3：选择内容目标
export default function GoalStep({ selectedGoalId, onSelect, onNext, onBack }: GoalStepProps) {
  return (
    <div>
      {/* 标题 */}
      <h2 className="text-xl font-bold text-gray-900">第三步：选择内容目标</h2>

      {/* 目标卡片网格 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const isSelected = goal.id === selectedGoalId;
          // 选中态 / 未选中态样式
          const cardClass = isSelected
            ? 'bg-indigo-50 rounded-lg p-6 border border-indigo-600 ring-2 ring-indigo-200 shadow-sm cursor-pointer'
            : 'bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:border-indigo-400 cursor-pointer';

          return (
            <div key={goal.id} className={cardClass} onClick={() => onSelect(goal)}>
              {/* 目标名（大字） */}
              <h3 className="text-lg font-bold text-gray-900">{goal.name}</h3>
              {/* 描述 */}
              <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
              {/* focusPoints 列表（小标签） */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {goal.focusPoints.map((point) => (
                  <span
                    key={point}
                    className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部上一步 / 下一步按钮 */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          上一步
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
