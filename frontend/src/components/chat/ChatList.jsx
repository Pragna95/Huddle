import { useState } from "react";
import { Bell, Plus, Search, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";

const channels = ["General", "UX & UI Team", "Meme", "Meme"];

const chats = [
  { id: 1, name: "GA Domes",       time: "10:30 AM", sub: "Status updated", color: "from-blue-400 to-indigo-500" },
  { id: 2, name: "Sky Towers",     time: "11:00 AM", sub: "📄 File.ext",    color: "from-green-400 to-teal-500" },
  { id: 3, name: "Forest Retreat", time: "12:00 PM", sub: "📷 1 photo",     color: "from-amber-400 to-orange-500" },
  { id: 4, name: "Mountain Peaks", time: "12:30 PM", sub: "Arjunchello",    color: "from-rose-400 to-pink-500" },
  { id: 5, name: "Urban Jungle",   time: "1:05 PM",  sub: "🎥 1 video",    color: "from-violet-400 to-purple-500" },
];

export default function ChatList() {
  const [activeChannel, setActiveChannel] = useState("General");
  const [channelSearch, setChannelSearch] = useState("");
  const [chatSearch, setChatSearch] = useState("");

  return (
    <div className="w-[324px] h-[824px] flex flex-col bg-white border border-gray-100 rounded-[12px] overflow-y-auto flex-shrink-0">
      
      {/* Announcements */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 cursor-pointer border-b border-gray-100 rounded-[6px] w-full h-[48px]">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Bell className="w-[16px] h-[20px] text-gray-600" />
        </div>
        <span className="flex-1 text-[14px] font-medium text-gray-700">Announcements</span>
        <span className="w-[24px] h-[24px] bg-[#0046BB] text-white text-[12px] rounded-full flex items-center justify-center font-bold">
          01
        </span>
      </div>

      {/* Huddles */}
      <div className="w-full h-[48px] rounded-[6px] bg-[#002266] flex items-center gap-3 px-4 py-3 cursor-pointer">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <img src="mon.svg" alt="Dash" className="w-[20px] h-[20px]" />
        </div>
        <span className="flex-1 text-sm font-semibold text-white">Huddles</span>
      </div>

      {/* Channels */}
      <div className="px-4 pt-4 pb-2 h-[304px] w-full">
        <div className="flex items-center justify-between mb-3 h-[36px] w-full">
          <span className="text-[12px] text-[#001744] tracking-wider">Channels</span>
          <button className="text-[#28303F] hover:text-gray-600 h-[20px] w-[20px]">
            <Plus className="w-[13px] h-[13px]" />
          </button>
        </div>

        <div className="relative mb-3 h-[40px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400" />
          <Input
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
            placeholder="search"
            className="pl-8 h-8 text-[12px] border-gray-300 bg-gray-50 rounded-lg w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          {channels
            .filter((c) => c.toLowerCase().includes(channelSearch.toLowerCase()))
            .map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveChannel(c)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left w-full ${
                  activeChannel === c
                    ? "bg-blue-50 text-[#38427c] font-semibold"
                    : "text-[#475569] hover:bg-gray-50"
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                {c}
              </button>
            ))}
        </div>

        <button className="text-xs text-gray-400 mt-2 hover:text-gray-600 ml-2">
          View All
        </button>
      </div>

      {/* Chats */}
      <div className="px-4 pt-3 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          General chats
        </p>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
            placeholder="search"
            className="pl-8 h-8 text-sm border-gray-200 bg-gray-50 rounded-lg w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          {chats
            .filter((c) => c.name.toLowerCase().includes(chatSearch.toLowerCase()))
            .map((chat) => (
              <button
                key={chat.id}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors text-left w-full"
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${chat.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {chat.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.sub}</p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}