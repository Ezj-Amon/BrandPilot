import { useMemo } from 'react';
import { Brand, Product, Platform, ContentGoal, GeneratedContent, ReviewResult } from '@/engine/types';
import { WorkbenchStep } from '@/store/workbenchStore';
import { ProductBrief, PlatformBrief, ContentStrategy } from '@/agents/types';
import { AgentStatus, getAgentStatuses, AGENT_DEFINITIONS } from '@/data/agents';

interface CurrentAgentCardProps {
  step: WorkbenchStep;
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  productBrief: ProductBrief | null;
  platformBrief: PlatformBrief | null;
  contentStrategy: ContentStrategy | null;
  generatedContent: GeneratedContent | null;
  reviewResult: ReviewResult | null;
  contentGenerated: boolean;
  loading: boolean;
  reviewing: boolean;
}

// 状态徽章样式映射
const STATUS_BADGE: Record<AgentStatus, { label: string; dotClass: string; badgeClass: string }> = {
  pending: {
    label: '未开始',
    dotClass: 'bg-gray-300',
    badgeClass: 'bg-gray-100 text-gray-500',
  },
  waiting: {
    label: '等待输入',
    dotClass: 'bg-gray-400',
    badgeClass: 'bg-gray-100 text-gray-600',
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
// 展示对应 Agent 的真实输出摘要，而不是纯静态说明
export default function CurrentAgentCard({
  step,
  productBrief,
  platformBrief,
  contentStrategy,
  generatedContent,
  reviewResult,
  contentGenerated,
  loading,
  reviewing,
}: CurrentAgentCardProps) {
  const agentDef = AGENT_DEFINITIONS[step - 1];

  const status = useMemo(() => {
    const statuses = getAgentStatuses(step, contentGenerated, loading);
    return statuses[step - 1];
  }, [step, contentGenerated, loading]);

  const badge = STATUS_BADGE[status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      {/* 标题行：Agent 名称 + 状态徽章 */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {agentDef.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {agentDef.nameZh}
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
        <p className="mt-0.5 text-xs text-gray-700 leading-relaxed">{agentDef.role}</p>
      </div>

      {/* 输入 / 输出 */}
      <div className="mt-2 space-y-1.5">
        <div>
          <span className="text-xs font-medium text-gray-400">输入：</span>
          <span className="text-xs text-gray-600">{agentDef.input}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-400">输出：</span>
          <span className="text-xs text-gray-600">{agentDef.output}</span>
        </div>
      </div>

      {/* 真实输出摘要：每一步展示对应 Agent 的输出 */}
      <AgentOutputSummary
        step={step}
        productBrief={productBrief}
        platformBrief={platformBrief}
        contentStrategy={contentStrategy}
        generatedContent={generatedContent}
        reviewResult={reviewResult}
        loading={loading}
        reviewing={reviewing}
      />

      {/* 简短说明 */}
      <p className="mt-2 text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-2">
        本地 Agent Engine 实时运行（规则驱动，未接入真实大模型 API）。
      </p>
    </div>
  );
}

// 根据 step 展示对应 Agent 的真实输出摘要
function AgentOutputSummary({
  step,
  productBrief,
  platformBrief,
  contentStrategy,
  generatedContent,
  reviewResult,
  loading,
  reviewing,
}: {
  step: WorkbenchStep;
  productBrief: ProductBrief | null;
  platformBrief: PlatformBrief | null;
  contentStrategy: ContentStrategy | null;
  generatedContent: GeneratedContent | null;
  reviewResult: ReviewResult | null;
  loading: boolean;
  reviewing: boolean;
}) {
  if (step === 1) {
    return (
      <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
        <div className="text-xs font-medium text-indigo-600 uppercase mb-1">Product Brief 摘要</div>
        {loading ? (
          <p className="text-xs text-gray-500">生成中…</p>
        ) : productBrief ? (
          <div className="text-xs text-gray-800 leading-relaxed space-y-1">
            <p><span className="text-gray-500">定位：</span>{productBrief.positioning}</p>
            <p><span className="text-gray-500">场景：</span>{productBrief.scenarios.join('、')}</p>
            <p><span className="text-gray-500">卖点：</span>{productBrief.coreSellingPoints.join('、')}</p>
            {productBrief.riskExpressions.length > 0 && (
              <p><span className="text-red-500">风险词：</span>{productBrief.riskExpressions.join('、')}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400">选择产品后将自动生成</p>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
        <div className="text-xs font-medium text-indigo-600 uppercase mb-1">Platform Brief 摘要</div>
        {platformBrief ? (
          <div className="text-xs text-gray-800 leading-relaxed space-y-1">
            <p><span className="text-gray-500">风格：</span>{platformBrief.styleKeywords.join('、')}</p>
            <p><span className="text-gray-500">长度：</span>{platformBrief.bodyLengthAdvice}</p>
            <p><span className="text-gray-500">标签：</span>{platformBrief.tagAdvice}</p>
            <p><span className="text-gray-500">CTA：</span>{platformBrief.ctaStyleAdvice}</p>
          </div>
        ) : (
          <p className="text-xs text-gray-400">选择平台后将自动生成</p>
        )}
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
        <div className="text-xs font-medium text-indigo-600 uppercase mb-1">Content Strategy 摘要</div>
        {contentStrategy ? (
          <div className="text-xs text-gray-800 leading-relaxed space-y-1">
            <p><span className="text-gray-500">主线：</span>{contentStrategy.mainThread}</p>
            <p><span className="text-gray-500">切口：</span>{contentStrategy.angle}</p>
            <p><span className="text-gray-500">排序：</span>{contentStrategy.messageOrder.slice(0, 3).join(' › ')}…</p>
          </div>
        ) : (
          <p className="text-xs text-gray-400">选择内容目标后将自动生成</p>
        )}
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
        <div className="text-xs font-medium text-indigo-600 uppercase mb-1">上游输入 / 生成结果</div>
        {loading ? (
          <p className="text-xs text-gray-500">ContentGenerationAgent 运行中…</p>
        ) : generatedContent ? (
          <div className="text-xs text-gray-800 leading-relaxed space-y-1">
            <p><span className="text-gray-500">已用输入：</span>Product Brief · Platform Brief · Content Strategy</p>
            <p className="truncate"><span className="text-gray-500">标题：</span>{generatedContent.title}</p>
            <p><span className="text-gray-500">标签数：</span>{generatedContent.tags.length} 个</p>
          </div>
        ) : (
          <p className="text-xs text-gray-400">点击「生成内容」后展示</p>
        )}
      </div>
    );
  }

  // step === 5
  return (
    <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
      <div className="text-xs font-medium text-indigo-600 uppercase mb-1">审核依据</div>
      {reviewing ? (
        <p className="text-xs text-gray-500">ReviewAgent 运行中…</p>
      ) : reviewResult ? (
        <div className="text-xs text-gray-800 leading-relaxed space-y-1">
          <p><span className="text-gray-500">总分：</span>{reviewResult.score} / 100</p>
          <p>
            <span className="text-gray-500">通过：</span>{reviewResult.summary.pass} ·
            <span className="text-amber-600"> 建议 {reviewResult.summary.warning}</span> ·
            <span className="text-red-600"> 严重 {reviewResult.summary.error}</span>
          </p>
          <p><span className="text-gray-500">检查维度：</span>品牌一致性 · 平台风格 · 卖点数量 · 事实风险 · CTA · 标签</p>
        </div>
      ) : (
        <p className="text-xs text-gray-400">进入审核后将基于生成内容生成报告</p>
      )}
    </div>
  );
}
