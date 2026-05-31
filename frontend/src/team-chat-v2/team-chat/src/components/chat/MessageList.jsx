/**
 * MessageList
 * Dimensions: 981px wide × 729px tall (chat interface without name bar)
 * Contains all message rows and date divider
 */

import { CheckCheck, FileText } from 'lucide-react'
import { useEffect, useRef } from 'react'

/* ── Sub-components ── */

function Avatar({ initials, bg }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold text-white"
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}

function DateDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-[#e5e7eb]" />
      <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest whitespace-nowrap px-1">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#e5e7eb]" />
    </div>
  )
}

export function InboundMessage({ avatarBg = '#4a8a6a', avatarInitials = 'JS', name, time, children }) {
  return (
    <div className="flex gap-3 items-start">
      <Avatar initials={avatarInitials} bg={avatarBg} />
      <div className="max-w-[65%]">
        <p className="text-[12px] text-[#9ca3af] mb-[4px]">
          {name} <span className="mx-0.5">•</span> {time}
        </p>
        <div className="bg-[#f0f2f5] rounded-2xl rounded-tl-sm px-4 py-[10px] text-[13.5px] leading-[1.55] text-[#111827]">
          {children}
        </div>
      </div>
    </div>
  )
}

export function OutboundMessage({ time, children }) {
  return (
    <div className="flex gap-3 items-start flex-row-reverse">
      <Avatar initials="You" bg="#1a3060" />
      <div className="max-w-[65%]">
        <p className="text-[12px] text-[#9ca3af] mb-[4px] text-right flex items-center justify-end gap-1">
          You <span className="mx-0.5">•</span> {time}
          <CheckCheck size={14} className="text-[#3a7bd5]" strokeWidth={2} />
        </p>
        <div className="bg-[#1a3060] rounded-2xl rounded-tr-sm px-4 py-[10px] text-[13.5px] leading-[1.55] text-[#dbeafe]">
          {children}
        </div>
      </div>
    </div>
  )
}

export function FileMessage({ avatarBg = '#4a8a6a', avatarInitials = 'JS', name, time }) {
  return (
    <div className="flex gap-3 items-start">
      <Avatar initials={avatarInitials} bg={avatarBg} />
      <div>
        <p className="text-[12px] text-[#9ca3af] mb-[4px]">
          {name} <span className="mx-0.5">•</span> {time}
        </p>
        {/* File card */}
        <div className="bg-[#f0f2f5] border border-[#e2e8f0] rounded-xl p-3 w-[260px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1a3060] rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-[#5a9fe8]" strokeWidth={1.8} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-semibold text-[#111827] truncate">
                John_Doe_Resume_2024.pdf
              </p>
              <p className="text-[11px] text-[#6b7280] mt-0.5">2.4 MB • Shared just now</p>
            </div>
          </div>
          <button className="w-full bg-[#1a3060] hover:bg-[#1f3d7a] text-[#5a9fe8] text-[13px] font-semibold py-[8px] rounded-lg transition-colors tracking-wide">
            VIEW
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Message list ── */

export default function MessageList({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    /**
     * h-[729px] → chat interface without the name bar (given)
     * width fills the remaining 981px from the parent ChatPanel
     */
    <div className="flex-1 h-[729px] overflow-y-auto scroll-light px-6 py-4 flex flex-col gap-4 bg-white">
      <DateDivider label="Today, Oct 24" />

      {messages.map((msg) => {
        if (msg.type === 'inbound') {
          return (
            <InboundMessage
              key={msg.id}
              avatarInitials={msg.avatarInitials}
              avatarBg={msg.avatarBg}
              name={msg.name}
              time={msg.time}
            >
              {msg.text}
            </InboundMessage>
          )
        }
        if (msg.type === 'outbound') {
          return (
            <OutboundMessage key={msg.id} time={msg.time}>
              {msg.text}
            </OutboundMessage>
          )
        }
        if (msg.type === 'file') {
          return (
            <FileMessage
              key={msg.id}
              avatarInitials={msg.avatarInitials}
              avatarBg={msg.avatarBg}
              name={msg.name}
              time={msg.time}
            />
          )
        }
        return null
      })}

      <div ref={bottomRef} />
    </div>
  )
}
