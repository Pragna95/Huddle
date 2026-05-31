/**
 * App.jsx — Root router
 *
 * To connect your other pages:
 *   1. Import them here
 *   2. Add a <Route> for each
 *
 * Example:
 *   import DashboardPage from './pages/DashboardPage'
 *   <Route path="/dashboard" element={<DashboardPage />} />
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <Routes>
      {/* Chat page */}
      <Route path="/chat" element={<ChatPage />} />

      {/* Default: redirect to /chat */}
      <Route path="*" element={<Navigate to="/chat" replace />} />

      {/* ── Add your other pages below ── */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      {/* <Route path="/profile"   element={<ProfilePage />}   /> */}
      {/* <Route path="/settings"  element={<SettingsPage />}  /> */}
    </Routes>
  )
}
