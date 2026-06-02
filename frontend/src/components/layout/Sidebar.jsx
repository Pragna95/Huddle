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
    <aside className="min-w-[68px] max-w-[68px] h-[941px] bg-[#1a1f3c] flex flex-col items-center py-4 gap-6 z-10">
      
      {/* Top Button */}
      <div className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
        <Redo2 className="w-[20px] h-[20px] text-black" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ image, label }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            title={label}
            className={`w-[44px] h-[44px] rounded-xl flex items-center justify-center transition-all ${
              active === label
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            <img
              src={image}
              alt={label}
              className="w-[20px] h-[20px]"
            />
          </button>
        ))}
      </nav>

      {/* Profile Section - Unchanged */}
      <div className="w-[64px] h-[64px] overflow-hidden border- cursor-pointer">
        <div className="w-[64px] h-[64px] flex items-center justify-center">
          <img
            src="profile.svg"
            alt="profile"
            className="w-[40px] h-[40px]"
          />
        </div>
      </div>

    </aside>
  );
}