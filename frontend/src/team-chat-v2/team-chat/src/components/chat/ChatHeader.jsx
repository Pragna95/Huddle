/**
 * ChatHeader  (name bar)
 * Dimensions: 981px wide × 80px tall
 * Background: #ffffff
 * Border-bottom: 1px solid #e8ecf0
 */

import { Phone, Video } from 'lucide-react'

export default function ChatHeader() {
  return (
    <div
      className="w-full h-[80px] bg-white border-b border-[#e8ecf0] flex items-center px-6 gap-4 flex-shrink-0"
      aria-label="Chat header"
    >
      {/* Stacked avatars */}
      <div className="flex items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#5a8a6a] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold z-10 relative">
          J
        </div>
        <div className="w-8 h-8 rounded-full bg-[#7a5a9a] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold -ml-2 z-20 relative">
          A
        </div>
        <div className="w-8 h-8 rounded-full bg-[#3a7bd5] border-2 border-white flex items-center justify-center text-white text-[10px] font-extrabold -ml-2 z-30 relative">
          +3
        </div>
      </div>

      {/* Title + meta */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[15px] font-semibold text-[#111827] leading-tight">
          Senior Frontend Engineer
        </h1>
        <div className="flex items-center gap-1.5 mt-[2px]">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-[12px] text-[#6b7280]">ID: 1024</span>
          <span className="text-[12px] text-[#6b7280]">•</span>
          <span className="text-[12px] text-[#6b7280]">Active job post</span>
        </div>
      </div>

      {/* Action icons — pinned right */}
      <div className="ml-auto flex items-center gap-4">
        <button className="text-[#3a7bd5] hover:text-[#2a5fb5] transition-colors" title="Audio call">
          <Phone size={20} strokeWidth={1.8} />
        </button>
        <button className="text-[#3a7bd5] hover:text-[#2a5fb5] transition-colors" title="Video call">
          <Video size={20} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
