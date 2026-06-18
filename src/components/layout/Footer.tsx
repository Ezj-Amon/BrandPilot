// 底部页脚：左侧版权，右侧声明
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* 左侧：版权 */}
        <span>© 2026 BrandPilot Demo</span>
        {/* 右侧：声明 */}
        <span className="text-gray-400">
          本 Demo 所有品牌与产品均为虚构，仅用于比赛展示
        </span>
      </div>
    </footer>
  )
}
