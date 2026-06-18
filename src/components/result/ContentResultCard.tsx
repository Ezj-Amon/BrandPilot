import { GeneratedContent } from '@/engine/types';
import CopyButton from '@/components/result/CopyButton';

interface ContentResultCardProps {
  content: GeneratedContent;
}

// 生成结果展示卡片，分块展示标题/正文/标签/CTA
export default function ContentResultCard({ content }: ContentResultCardProps) {
  // 标签用空格连接，用于复制
  const tagsText = content.tags.join(' ');
  // 生成时间格式化为本地时间
  const createdAtText = new Date(content.createdAt).toLocaleString('zh-CN');

  return (
    <div className="max-w-3xl bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
      {/* 标题区 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">标题</span>
          <CopyButton text={content.title} />
        </div>
        <p className="mt-1 text-lg font-semibold text-gray-900">{content.title}</p>
      </div>

      {/* 正文区 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">正文</span>
          <CopyButton text={content.body} />
        </div>
        <p className="mt-1 whitespace-pre-wrap text-gray-700 leading-relaxed">{content.body}</p>
      </div>

      {/* 标签区 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">标签</span>
          <CopyButton text={tagsText} />
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA 区 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">行动号召 (CTA)</span>
          <CopyButton text={content.cta} />
        </div>
        <p className="mt-1 text-gray-700">{content.cta}</p>
      </div>

      {/* 底部元信息 */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">元信息</span>
          <CopyButton text={content.sessionId} />
        </div>
        <div className="mt-1 text-sm text-gray-600 space-y-1">
          <div>生成时间：{createdAtText}</div>
          <div>
            Session ID：<span className="font-mono text-xs">{content.sessionId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
