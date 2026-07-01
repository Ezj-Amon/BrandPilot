import { useMemo } from 'react';
import {
  Brand,
  Product,
  Platform,
  ContentGoal,
  ProductBrief,
  PlatformBrief,
  ContentStrategy,
  GeneratedContent,
  ReviewResult,
} from '@/engine/types';
import { WorkbenchStep } from '@/store/workbenchStore';
import { AgentStatus, buildAgentRunNodes } from '@/data/agents';

interface CurrentAgentCardProps {
  step: WorkbenchStep;
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  statuses: AgentStatus[]; // 来自 per-step 状态机（唯一真相源）
  // 真实 Agent 中间产物
  productBrief: ProductBrief | null;
  platformBrief: PlatformBrief | null;
  contentStrategy: ContentStrategy | null;
  generatedContent: GeneratedContent | null;
  reviewResult: ReviewResult | null;
}

// 状态徽章样式映射（5 态）
const STATUS_BADGE: Record<AgentStatus, { label: string; dotClass: string; badgeClass: string }> = {
  pending: {
    label: '未开始',
    dotClass: 'bg-gray-300',
    badgeClass: 'bg-gray-100 text-gray-500',
  },
  pending_confirm: {
    label: '待确认',
    dotClass: 'bg-gray-400',
    badgeClass: 'bg-gray-100 text-gray-600',
  },
  ready: {
    label: '输入就绪',
    dotClass: 'bg-indigo-500',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  running: {
    label: '运行中',
    dotClass: 'bg-amber-500 animate-pulse',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  completed: {
    label: '已完成',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
};

// 当前步骤对应 Agent 的轻量辅助卡片（侧边栏）
// 仅作为辅助说明，不抢占主体视觉；状态来自 store 的 stepStatuses
export default function CurrentAgentCard({
  step,
  brand,
  product,
  platform,
  goal,
  statuses,
  productBrief,
  platformBrief,
  contentStrategy,
  generatedContent,
  reviewResult,
}: CurrentAgentCardProps) {
  const node = useMemo(() => {
    const nodes = buildAgentRunNodes(brand, product, platform, goal, statuses);
    return nodes[step - 1];
  }, [step, brand, product, platform, goal, statuses]);

  const badge = STATUS_BADGE[node.status];

  // 根据 step 渲染真实 Agent 中间产物摘要
  function renderRealOutput() {
    if (step === 1) {
      if (!productBrief) return <ComputingText />;
      return (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-gray-400">Product Brief</div>
          <Field label="产品定位" value={productBrief.positioning} />
          <Field label="核心卖点" value={productBrief.coreSellingPoints.join('、')} />
          <Field
            label="风险约束"
            value={productBrief.riskConstraints.length > 0 ? productBrief.riskConstraints.join('；') : '无'}
          />
        </div>
      );
    }
    if (step === 2) {
      if (!platformBrief) return <ComputingText />;
      return (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-gray-400">Platform Brief</div>
          <Field label="表达风格" value={platformBrief.expressionStyle} />
          <Field label="长度建议" value={platformBrief.bodyLengthAdvice} />
          <Field label="标签建议" value={platformBrief.tagAdvice} />
          <Field label="CTA 风格" value={platformBrief.ctaStyleAdvice} />
        </div>
      );
    }
    if (step === 3) {
      if (!contentStrategy) return <ComputingText />;
      return (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-gray-400">Content Strategy</div>
          <Field label="内容主线" value={contentStrategy.mainThread} />
          <Field label="表达切口" value={contentStrategy.angle} />
          <Field label="信息排序" value={contentStrategy.infoOrder.join(' → ')} />
          <Field label="结构建议" value={contentStrategy.structureAdvice} />
        </div>
      );
    }
    if (step === 4) {
      if (!generatedContent) {
        return (
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-gray-400">已生成内容</div>
            <p className="text-xs text-gray-400">等待生成内容</p>
          </div>
        );
      }
      return (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-gray-400">已生成内容</div>
          <Field label="标题" value={generatedContent.title} />
          <Field label="生成时间" value={generatedContent.createdAt} />
          <Field label="Session ID" value={generatedContent.sessionId} />
        </div>
      );
    }
    if (step === 5) {
      if (!reviewResult) {
        return (
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-gray-400">审核依据</div>
            <p className="text-xs text-gray-400">等待审核结果</p>
          </div>
        );
      }
      return (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-gray-400">审核依据</div>
          <Field label="通过" value={`${reviewResult.summary.pass} 项`} />
          <Field label="警告" value={`${reviewResult.summary.warning} 项`} />
          <Field label="错误" value={`${reviewResult.summary.error} 项`} />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      {/* 标题行：Agent 名称 + 状态徽章 */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {node.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {node.nameZh}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${badge.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
          {badge.label}
        </span>
      </div>

      {/* 职责 */}
      <div className="mt-3">
        <div className="text-xs font-medium text-gray-400">职责</div>
        <p className="mt-0.5 text-xs text-gray-700 leading-relaxed">{node.role}</p>
      </div>

      {/* 输入 / 输出 */}
      <div className="mt-2 space-y-1.5">
        <div>
          <span className="text-xs font-medium text-gray-400">输入：</span>
          <span className="text-xs text-gray-600">{node.input}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-400">输出：</span>
          <span className="text-xs text-gray-600">{node.output}</span>
        </div>
      </div>

      {/* 真实输出摘要 */}
      <div className="mt-2 border-t border-gray-100 pt-2">{renderRealOutput()}</div>

      {/* 简短说明 */}
      <p className="mt-2 text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-2">
        {node.note}
      </p>
    </div>
  );
}

// 字段：标签 + 值
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-400">{label}：</span>
      <span className="text-xs text-gray-700">{value}</span>
    </div>
  );
}

// 计算中占位
function ComputingText() {
  return <p className="text-xs text-gray-400">正在计算...</p>;
}
