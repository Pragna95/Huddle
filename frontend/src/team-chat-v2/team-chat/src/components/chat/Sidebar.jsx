/**
 * Sidebar  (left panel of main content area)
 * Dimensions: 324px × 824px
 * Background: #1e2d4a
 * Contains: Announcements, Huddles, Channels list, General chats DM list
 */

import { Bell, Users, Plus, Search, Hash, FileText, Image, Video, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHANNELS = [
  { name: 'General',      active: true  },
  { name: 'UX & UI Team', active: false },
  { name: 'Meme',         active: false },
  { name: 'Meme',         active: false },
]

const DMS = [
  { id: 1, name: 'GA Domes',      time: '10:30 AM', preview: 'Status updated', PreviewIcon: RefreshCw, bg: '#3b5ea6', initials: 'GA' },
  { id: 2, name: 'Sky Towers',    time: '11:00 AM', preview: 'File.ext',        PreviewIcon: FileText,  bg: '#3d7a5e', initials: 'ST' },
  { id: 3, name: 'Forest Retreat',time: '12:00 PM', preview: '1photo',          PreviewIcon: Image,     bg: '#5a4a8a', initials: 'FR' },
  { id: 4, name: 'Mountain Peaks',time: '12:30 PM', preview: 'Arjun:hello',     PreviewIcon: null,      bg: '#7a5a4a', initials: 'MP' },
  { id: 5, name: 'Urban Jungle',  time: '1:00 PM',  preview: '1video',          PreviewIcon: Video,     bg: '#2e6e6a', initials: 'UJ' },
]

function SearchInput({ placeholder }) {
  return (
    <div className="relative mx-3 mb-1">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7090] pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-[#253250] border border-[#2e3f5c] rounded-lg pl-8 pr-3 py-[7px] text-[13px] text-[#c0d0e8] placeholder:text-[#5a7090] outline-none focus:border-[#3a5070] transition-colors"
      />
    </div>
  )
}

export default function Sidebar() {
  return (
    /**
     * w-[324px] → exact sidebar width
     * h-[824px] → main content height (below topbar)
     * flex-shrink-0 — never compress
     */
    <aside
      className="w-[324px] h-full bg-[#1e2d4a] flex flex-col flex-shrink-0 border-r border-[#1a2740] overflow-hidden"
      aria-label="Channels and direct messages"
    >
      {/* ── Top items: Announcements + Huddles ── */}
      <div className="px-3 pt-4 pb-2 flex flex-col gap-0.5">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a0b0cc] text-[14px] hover:bg-[#253657] hover:text-white transition-colors w-full text-left">
          <Bell size={16} strokeWidth={1.8} className="flex-shrink-0" />
          <span>Announcements</span>
          <span className="ml-auto bg-[#3a7bd5] text-white text-[10px] font-bold rounded-full px-[7px] py-[1px] leading-[16px]">
            01
          </span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a0b0cc] text-[14px] hover:bg-[#253657] hover:text-white transition-colors w-full text-left">
          <Users size={16} strokeWidth={1.8} className="flex-shrink-0" />
          <span>Huddles</span>
        </button>
      </div>

      {/* ── Channels section ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-[11px] font-semibold text-[#5a7090] uppercase tracking-[0.06em]">
          Channels
        </span>
        <button className="text-[#5a7090] hover:text-[#a0b0cc] transition-colors">
          <Plus size={15} strokeWidth={2} />
        </button>
      </div>

      <SearchInput placeholder="search" />

      {/* Channel list */}
      <div className="px-2 pb-1">
        {CHANNELS.map((ch, i) => (
          <button
            key={`${ch.name}-${i}`}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-[7px] rounded-lg text-[14px] text-left transition-colors',
              ch.active
                ? 'bg-[#1f3d6e] text-[#4a90d9] font-medium'
                : 'text-[#a0b0cc] hover:bg-[#253657] hover:text-white'
            )}
          >
            <Hash
              size={14}
              strokeWidth={2}
              className={ch.active ? 'text-[#4a90d9]' : 'text-[#5a7090]'}
            />
            {ch.name}
          </button>
        ))}
        <button className="text-[13px] text-[#5a7090] hover:text-[#a0b0cc] px-3 py-1.5 transition-colors block">
          View All
        </button>
      </div>

      {/* ── General chats section ── */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <Users size={13} className="text-[#5a7090]" />
        <span className="text-[11px] font-semibold text-[#5a7090] uppercase tracking-[0.06em]">
          General chats
        </span>
      </div>

      <SearchInput placeholder="search" />

      {/* DM list — scrollable */}
      <div className="flex-1 overflow-y-auto scroll-dark">
        {DMS.map((dm) => (
          <button
            key={dm.id}
            className="flex items-center gap-3 w-full px-4 py-[9px] hover:bg-[#253250] transition-colors text-left"
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold text-white"
              style={{ backgroundColor: dm.bg }}
            >
              {dm.initials}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="text-[14px] font-medium text-[#c0d0e8] truncate">{dm.name}</span>
                <span className="text-[11px] text-[#5a7090] ml-2 flex-shrink-0">{dm.time}</span>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-[#5a7090] mt-0.5">
                {dm.PreviewIcon && (
                  <dm.PreviewIcon size={11} className="flex-shrink-0" />
                )}
                <span className="truncate">{dm.preview}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
