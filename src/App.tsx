import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkbenchPage from './pages/WorkbenchPage'

// 根组件：使用 BrowserRouter 配置路由
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workbench" element={<WorkbenchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
