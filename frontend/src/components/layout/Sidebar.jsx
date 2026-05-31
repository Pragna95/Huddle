import { useState } from "react";
import {
  LayoutDashboard, MessageSquare, Calendar,
  Zap, Megaphone, Monitor, RefreshCw, User
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: MessageSquare,   label: "Messages" },
  { icon: Calendar,        label: "Calendar" },
  { icon: Zap,             label: "Integrations" },
  { icon: Megaphone,       label: "Announcements" },
  { icon: Monitor,         label: "Screens" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Messages");

  return (
    <aside className="w-[68px] h-[941px] bg-[#1a1f3c] flex flex-col items-center py-4 gap-6 z-10">
      {/* Refresh button */}
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
        <RefreshCw className="w-4 h-4 text-white" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            title={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              active === label
                ? "bg-white/20 text-white"
                : "text-white/40 hover:text-white/70 hover:bg-white/10"
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      {/* User avatar */}
      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 cursor-pointer">
        <div className="w-full h-full bg-amber-400 flex items-center justify-center">
          <User className="w-4 h-4 text-amber-800" />
        </div>
      </div>
    </aside>
  );
}