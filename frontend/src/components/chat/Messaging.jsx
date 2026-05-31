import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Messaging() {
  return (
    <div className="flex flex-col w-[1440px] h-[900px] bg-gray-50">
      {/* 🔝 Top Bar */}
      <div className="w-[1440px] h-[76px] border-b flex items-center justify-between px-6">
        <span className="text-sm">My work plan today</span>
        <Button>Upgrade ⚡921</Button>
      </div>

      <div className="flex">
        {/* 🚀 Sidebar */}
        <div className="w-[68px] h-[941px] bg-gray-900">
          <ScrollArea className="h-full flex flex-col items-center py-4 space-y-6">
            <div className="w-6 h-6 bg-white rounded-md" />
            <div className="w-6 h-6 bg-white rounded-md" />
            <div className="w-6 h-6 bg-white rounded-md" />
          </ScrollArea>
        </div>

        {/* 💬 Remaining Layout */}
        <div className="w-[1329px] h-[824px] flex flex-col">
          {/* Chat Header */}
          <div className="w-full h-[80px] border-b flex items-center px-6">
            <h2 className="font-semibold">Senior Frontend Engineer</h2>
          </div>

          {/* Message List */}
          <div className="h-[729px] overflow-y-auto p-6 space-y-4">
            <div className="bg-white p-4 rounded-md shadow-sm w-fit">
              <p className="text-sm text-gray-700">
                Example message content goes here.
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="w-full h-[132px] border-t p-4 flex gap-3">
            <Input placeholder="Message #General" className="flex-1" />
            <Button>➤</Button>
          </div>
        </div>
      </div>
    </div>
  )
}