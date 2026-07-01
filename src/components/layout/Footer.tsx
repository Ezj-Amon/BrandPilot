// 底部页脚：左侧版权，右侧声明
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* 左侧：版权 */}
        <span>© 2026 BrandPilot Demo</span>
        {/* 右侧：声明 */}
        <span className="text-gray-400">
          页面中的品牌与产品均为虚构案例，仅用于展示 BrandPilot 的内容运营工作流
        </span>
      </div>
    </footer>
  )
}
