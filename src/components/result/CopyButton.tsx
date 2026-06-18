import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;  // 默认"复制"
}

// 复制按钮组件，点击复制文本到剪贴板
export default function CopyButton({ text, label = '复制' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // 2 秒后恢复
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时静默忽略
    }
  };

  // 已复制态 / 默认态样式
  const buttonClass = copied
    ? 'text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded'
    : 'text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200';

  return (
    <button type="button" onClick={handleCopy} className={buttonClass}>
      {copied ? '已复制' : label}
    </button>
  );
}
