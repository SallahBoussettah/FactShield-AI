import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleBasedRoute from './components/auth/RoleBasedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {/* Dashboard will be implemented in a future task */}
                <div className="p-8">Dashboard coming soon</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Role-based routes - require specific roles */}
          <Route 
            path="/admin" 
            element={
              <RoleBasedRoute roles={['admin']}>
                {/* Admin dashboard will be implemented in a future task */}
                <div className="p-8">Admin Dashboard coming soon</div>
              </RoleBasedRoute>
            } 
          />
          
          {/* Catch-all route for 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="mb-6">The page you're looking for doesn't exist.</p>
                <a 
                  href="/" 
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[color-mix(in_srgb,var(--color-primary),black_10%)]"
                >
                  Go Home
                </a>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
