/**
 * MessageComposer
 * Full width of chat panel (981px), auto height ~80px
 * Background: #ffffff  Border-top: 1px #e8ecf0
 */

import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Link2, List, AtSign, Smile, PlusCircle, Send } from 'lucide-react'

export default function MessageComposer({ onSend }) {
  const [text, setText] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = Math.min(ref.current.scrollHeight, 100) + 'px'
  }, [text])

  const send = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  return (
    <div className="w-full bg-white border-t border-[#e8ecf0] px-4 pt-3 pb-3 flex-shrink-0">
      {/* Formatting toolbar */}
      <div className="flex items-center gap-3 mb-2 px-1">
        {[
          { Icon: Bold,   title: 'Bold'   },
          { Icon: Italic, title: 'Italic' },
          { Icon: Link2,  title: 'Link'   },
          { Icon: List,   title: 'List'   },
        ].map(({ Icon, title }) => (
          <button
            key={title}
            title={title}
            className="text-[#9ca3af] hover:text-[#4b5563] transition-colors"
          >
            <Icon size={15} strokeWidth={2} />
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Message #General"
          rows={1}
          className="flex-1 border border-[#e2e8f0] rounded-xl px-4 py-[9px] text-[13.5px] text-[#374151] placeholder:text-[#9ca3af] outline-none focus:border-[#c0cfe0] resize-none min-h-[40px] max-h-[100px] font-[inherit] transition-colors"
        />

        {/* Right-side action icons */}
        <div className="flex items-center gap-2 pb-[9px]">
          <button className="text-[#9ca3af] hover:text-[#4b5563] transition-colors" title="Mention">
            <AtSign size={18} strokeWidth={1.8} />
          </button>
          <button className="text-[#9ca3af] hover:text-[#4b5563] transition-colors" title="Emoji">
            <Smile size={18} strokeWidth={1.8} />
          </button>
          <button className="text-[#9ca3af] hover:text-[#4b5563] transition-colors" title="Attach">
            <PlusCircle size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Send button */}
        <button
          onClick={send}
          title="Send"
          className="w-9 h-9 rounded-xl bg-[#1a3060] hover:bg-[#1f3d7a] flex items-center justify-center flex-shrink-0 transition-colors mb-[1px]"
        >
          <Send size={15} className="text-[#5a9fe8]" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
