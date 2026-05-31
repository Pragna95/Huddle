/**
 * ChatPanel
 * Dimensions: 981px wide × 817px tall
 *   ├─ ChatHeader:   981 × 80px
 *   └─ MessageList:  981 × 729px  (+ composer overlaid at bottom)
 *
 * This is the right panel of the main content area.
 * It manages message state.
 */

import { useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageComposer from './MessageComposer'

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'inbound',
    avatarInitials: 'JS',
    avatarBg: '#4a8a6a',
    name: 'Jane Smith',
    time: '10:42 AM',
    text: "I've reviewed the portfolio for candidate John Doe. His React architecture patterns are impressive, but we should verify his experience with Micro-frontends.",
  },
  {
    id: 2,
    type: 'outbound',
    time: '10:45 AM',
    text: "Agreed. I'll schedule a technical deep dive. Should I include the Lead Architect for that session?",
  },
  {
    id: 3,
    type: 'inbound',
    avatarInitials: 'JS',
    avatarBg: '#4a8a6a',
    name: 'Jane Smith',
    time: '10:42 AM',
    text: "I've reviewed the portfolio for candidate John Doe. His React architecture patterns are impressive, but we should verify his experience with Micro-frontends.",
  },
  {
    id: 4,
    type: 'file',
    avatarInitials: 'JS',
    avatarBg: '#4a8a6a',
    name: 'Jane Smith',
    time: '10:48 AM',
  },
]

export default function ChatPanel() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  const handleSend = (text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'outbound', time, text },
    ])
  }

  return (
    /**
     * w-[981px] → exact chat panel width (given)
     * h-[817px] → chatting interface including name bar (given)
     * flex-1 allows it to fill remaining space when sidebar is 324px
     */
    <section
      className="flex-1 flex flex-col bg-white overflow-hidden"
      aria-label="Chat panel"
      style={{ minWidth: 0 }}
    >
      {/* Name bar: 981 × 80px */}
      <ChatHeader />

      {/* Messages: 981 × 729px */}
      <MessageList messages={messages} />

      {/* Composer: auto height ~80px */}
      <MessageComposer onSend={handleSend} />
    </section>
  )
}
