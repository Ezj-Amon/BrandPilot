import { Platform } from '@/engine/types';
import { platforms } from '@/data/platforms';

interface PlatformStepProps {
  selectedPlatformId: string;
  onSelect: (platform: Platform) => void;
  onNext: () => void;
  onBack: () => void;
}

// 语言文案映射
const languageText: Record<Platform['language'], string> = {
  zh: '中文',
  en: '英文',
};

// emoji 策略文案映射
const emojiPolicyText: Record<Platform['emojiPolicy'], string> = {
  encouraged: '鼓励使用',
  moderate: '适度使用',
  minimal: '尽量少用',
};

// Step 2：选择发布平台
export default function PlatformStep({
  selectedPlatformId,
  onSelect,
  onNext,
  onBack,
}: PlatformStepProps) {
  const selectedPlatform = platforms.find((p) => p.id === selectedPlatformId);

  return (
    <div>
      {/* 标题 */}
      <h2 className="text-xl font-bold text-gray-900">第二步：选择发布平台</h2>

      {/* 平台 Tab 横向排列 */}
      <div className="mt-6 flex border-b border-gray-200">
        {platforms.map((platform) => {
          const isSelected = platform.id === selectedPlatformId;
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => onSelect(platform)}
              className={`px-4 py-2 text-sm border-b-2 ${
                isSelected
                  ? 'border-indigo-600 text-indigo-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {platform.name}
            </button>
          );
        })}
      </div>

      {/* 选中平台信息卡片 */}
      {selectedPlatform && (
        <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">{selectedPlatform.name}</h3>
          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* 语言 */}
            <div>
              <dt className="text-gray-500">语言</dt>
              <dd className="mt-1 text-gray-900">
                {languageText[selectedPlatform.language]}
              </dd>
            </div>
            {/* 标签数量要求 */}
            <div>
              <dt className="text-gray-500">标签数量要求</dt>
              <dd className="mt-1 text-gray-900">
                {selectedPlatform.tagRange.min}-{selectedPlatform.tagRange.max}
              </dd>
            </div>
            {/* 正文长度要求 */}
            <div>
              <dt className="text-gray-500">正文长度要求</dt>
              <dd className="mt-1 text-gray-900">
                {selectedPlatform.bodyLengthRange.min}-{selectedPlatform.bodyLengthRange.max} 字
              </dd>
            </div>
            {/* emoji 策略 */}
            <div>
              <dt className="text-gray-500">emoji 策略</dt>
              <dd className="mt-1 text-gray-900">
                {emojiPolicyText[selectedPlatform.emojiPolicy]}
              </dd>
            </div>
            {/* CTA 风格 */}
            <div>
              <dt className="text-gray-500">CTA 风格</dt>
              <dd className="mt-1 text-gray-900">{selectedPlatform.ctaStyle}</dd>
            </div>
          </dl>
        </div>
      )}

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
