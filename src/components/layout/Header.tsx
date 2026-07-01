import { Link } from 'react-router-dom'

// 顶部导航栏：固定在顶部，左侧 logo，右侧导航链接
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 左侧：BrandPilot logo */}
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-indigo-600">BrandPilot</span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            DTC 品牌 AI 内容运营工作台
          </span>
        </Link>

        {/* 右侧：导航链接 */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
            首页
          </Link>
          <Link
            to="/workbench"
            className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
            工作台
          </Link>
          <Link
            to="/workflow"
            className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Agent Workflow
          </Link>
        </nav>
      </div>
    </header>
  )
}
