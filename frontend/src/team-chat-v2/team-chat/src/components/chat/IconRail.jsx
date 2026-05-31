/**
 * IconRail
 * Dimensions: 68px × 941px (full app height)
 * Background: #1e2433
 */

import { RotateCcw, LayoutGrid, MessageSquare, Calendar, Zap, Megaphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: RotateCcw,    label: 'Refresh',        active: false },
  { icon: LayoutGrid,   label: 'Apps',            active: false },
  { icon: MessageSquare,label: 'Messages',        active: true  },
  { icon: Calendar,     label: 'Calendar',        active: false },
  { icon: Zap,          label: 'Sparks',          active: false },
  { icon: Megaphone,    label: 'Announcements',   active: false },
  { icon: Monitor,      label: 'Screen',          active: false },
]

export default function IconRail() {
  return (
    /**
     * w-[68px]  → 68 px wide  (given)
     * h-[941px] → full app height (given)
     * When used inside a flex layout with flex-col + h-screen it fills naturally
     */
    <aside
      className="flex flex-col items-center w-[68px] h-full bg-[#1e2433] py-3 gap-5 flex-shrink-0"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          title={label}
          className={cn(
            'w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150',
            active
              ? 'bg-[#2d3f6b] text-white'
              : 'text-[#7c8db0] hover:bg-[#253657] hover:text-white'
          )}
        >
          <Icon size={19} strokeWidth={1.8} />
        </button>
      ))}

      {/* User avatar — pinned to bottom */}
      <div className="mt-auto mb-1 w-9 h-9 rounded-full bg-[#c9873a] flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0">
        {/* Replace with <img src={userAvatar} /> when available */}
        <span className="text-[11px] font-bold text-white select-none">U</span>
      </div>
    </aside>
  )
}
