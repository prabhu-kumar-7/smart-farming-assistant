import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import FarmForm from './pages/FarmForm'
import WeatherPage from './pages/WeatherPage'
import RecommendPage from './pages/RecommendPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// ── Protected Route — redirects to login if not logged in ──
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes — no sidebar */}
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected routes — with sidebar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-[#0a1628]
              text-white overflow-hidden">
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
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App