/**
 * ChatPage  — the complete page
 *
 * Full layout dimensions:
 *   ┌─────────────────────────────────────────────────── 1440px ──┐
 *   │  TopBar                                             h: 76px  │
 *   ├──────────┬──────────────────────────────────────────────────┤
 *   │ IconRail │  Sidebar (324px) │  ChatPanel (981px)            │
 *   │  68px    │                  │                               │
 *   │          │     824px tall (main content below topbar)       │
 *   └──────────┴──────────────────────────────────────────────────┘
 *
 * INTEGRATION GUIDE (for connecting to your existing router):
 *
 *   1. Copy src/components/chat/ into your project
 *   2. Add this route in your router:
 *        import ChatPage from './pages/ChatPage'
 *        <Route path="/chat" element={<ChatPage />} />
 *   3. Link from other pages:
 *        import { Link } from 'react-router-dom'
 *        <Link to="/chat">Open Chat</Link>
 */

import IconRail from '../components/chat/IconRail'
import TopBar from '../components/chat/TopBar'
import Sidebar from '../components/chat/Sidebar'
import ChatPanel from '../components/chat/ChatPanel'

export default function ChatPage() {
  return (
    /**
     * h-screen  → fills full viewport height (941px on 1080p screens)
     * overflow-hidden → no page scroll; internal panels scroll individually
     */
    <div className="flex h-screen overflow-hidden bg-[#1e2433]">

      {/* Icon rail: 68px × full height */}
      <IconRail />

      {/* Right side: TopBar + main content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* TopBar: full width × 76px */}
        <TopBar />

        {/* Main content row: Sidebar + ChatPanel, height = screen - topbar */}
        <main className="flex flex-1 overflow-hidden">

          {/* Sidebar: 324px × 824px */}
          <Sidebar />

          {/* Chat panel: 981px × 817px (fills remaining width) */}
          <ChatPanel />

        </main>
      </div>
    </div>
  )
}
