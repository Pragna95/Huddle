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
    <div className="w-[324px] h-[824px] flex flex-col bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
      {/* Announcements */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Bell className="w-4 h-4 text-gray-600" />
        </div>
        <span className="flex-1 text-sm font-medium text-gray-700">Announcements</span>
        <span className="w-5 h-5 bg-[#1e2b72] text-white text-xs rounded-full flex items-center justify-center font-bold">
          01
        </span>
      </div>

      {/* Huddles */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1e2b72] cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <span className="text-white text-sm">🎥</span>
        </div>
        <span className="flex-1 text-sm font-semibold text-white">Huddles</span>
      </div>

      {/* Channels */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Channels</span>
          <button className="text-gray-400 hover:text-gray-600">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
            placeholder="search"
            className="pl-8 h-8 text-sm border-gray-200 bg-gray-50 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          {channels
            .filter((c) => c.toLowerCase().includes(channelSearch.toLowerCase()))
            .map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveChannel(c)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
                  activeChannel === c
                    ? "bg-blue-50 text-[#1e2b72] font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
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
            className="pl-8 h-8 text-sm border-gray-200 bg-gray-50 rounded-lg"
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