/**
 * TopBar
 * Dimensions: 1440px wide × 75.59px tall (rounded → h-[76px])
 * Background: #1e2433
 * Contains: Upgrade button (right-aligned), Bell icon, Message icon
 */

import { Bell, MessageCircle, Zap } from 'lucide-react'

export default function TopBar() {
  return (
    <header
      className="w-full h-[76px] bg-[#1e2433] flex items-center justify-end px-6 gap-3 flex-shrink-0"
      aria-label="Top bar"
    >
      {/* Upgrade button */}
      <button className="flex items-center gap-2 bg-[#1a3060] hover:bg-[#1f3d7a] border border-[#2a4580] text-white text-sm font-semibold px-5 py-[9px] rounded-xl transition-colors duration-150">
        Upgrade
        <span className="flex items-center gap-1 text-[#4a8fe8] font-bold">
          <Zap size={13} fill="#4a8fe8" strokeWidth={0} />
          921
        </span>
      </button>

      {/* Bell */}
      <button className="w-10 h-10 rounded-xl bg-[#253250] hover:bg-[#2d3f6b] flex items-center justify-center text-[#7c8db0] hover:text-white transition-colors duration-150">
        <Bell size={19} strokeWidth={1.8} />
      </button>

      {/* Message */}
      <button className="w-10 h-10 rounded-xl bg-[#253250] hover:bg-[#2d3f6b] flex items-center justify-center text-[#7c8db0] hover:text-white transition-colors duration-150">
        <MessageCircle size={19} strokeWidth={1.8} />
      </button>
    </header>
  )
}
