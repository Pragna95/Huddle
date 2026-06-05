import { useState } from "react";
import { Redo2 } from "lucide-react";

const navItems = [
  { image: "/LayoutDashboard.svg", label: "Dashboard" },
  { image: "/MessageSquare.svg", label: "Messages" },
  { image: "/Calendar.svg", label: "Calendar" },
  { image: "/Zap.svg", label: "Integrations" },
  { image: "/Megaphone.svg", label: "Announcements" },
  { image: "/Monitor.svg", label: "Screens" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Messages");

  return (
    <aside className="w-16 bg-gradient-to-b from-[#001744] via-[#002266] to-[#001030] flex flex-col items-center py-4 gap-6 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.15)] transition-all duration-300">
      
      {/* Top Button */}
      <div className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:scale-105 active:scale-95 hover:rotate-18 transition-all duration-300 shadow-sm">
        <Redo2 className="w-[20px] h-[20px] text-black" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2.5 flex-1">
        {navItems.map(({ image, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              title={label}
              className={`w-[44px] h-[44px] rounded-xl flex items-center justify-center transition-all duration-300 relative group cursor-pointer ${
                isActive
                  ? "bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)] scale-105"
                  : "hover:bg-white/10 hover:scale-105 active:scale-95"
              }`}
            >
              {/* Active indicator bar on the very left edge, taking no extra layout space */}
              {isActive && (
                <span className="absolute left-0 w-[3px] h-[16px] bg-white rounded-r-full transition-all duration-300" />
              )}
              
              <img
                src={image}
                alt={label}
                className={`w-[20px] h-[20px] transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-115"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Profile Section - Enhanced but same bounds */}
      <div className="w-[64px] h-[64px] flex items-center justify-center overflow-hidden cursor-pointer group">
        <div className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:scale-105 group-hover:ring-2 group-hover:ring-blue-400 group-hover:ring-offset-2 group-hover:ring-offset-[#001030] transition-all duration-300">
          <img
            src="profile.svg"
            alt="profile"
            className="w-[32px] h-[32px] rounded-full object-cover"
          />
        </div>
      </div>

    </aside>
  );
}