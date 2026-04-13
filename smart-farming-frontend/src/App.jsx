import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import FarmForm from './pages/FarmForm'
import WeatherPage from './pages/WeatherPage'
import RecommendPage from './pages/RecommendPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#0a1628] text-white overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/farm"        element={<FarmForm />} />
            <Route path="/weather"     element={<WeatherPage />} />
            <Route path="/recommend"   element={<RecommendPage />} />
            <Route path="/chat"        element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App