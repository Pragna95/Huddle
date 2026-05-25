import React from "react";
import {
  MicOff,
  VideoOff,
  Share,
  Hand,
  Users,
  MoreVertical,
  Copy,
  PhoneOff,
  Circle,
  LayoutGrid,
  FileText,
  Monitor,
  ChevronDown
} from "lucide-react";

const participants = [
  {
    id: 1,
    name: "Shilpa",
    avatar: "https://randomuser.me/api/portraits/women/49.jpg",
    muted: true,
  },
  {
    id: 2,
    name: "Jack",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    muted: true,
  },
  {
    id: 3,
    name: "Alexa",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    muted: true,
  },
];

const Meeting = () => {
  return (
    <div className="h-screen w-screen bg-[#f4f4f5] flex flex-col overflow-hidden font-sans">

      {/* ================= HEADER ================= */}
      <header className="h-[78px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* LOGO */}
          <div className="w-11 h-11 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-sm">
            <Monitor size={22} fill="white" />
          </div>

          {/* MEETING INFO */}
          <div className="leading-tight">
            <h2 className="text-[17px] font-bold text-slate-800">
              Huddle_Name
            </h2>

            <p className="text-[12px] text-slate-400 mt-1">
              Tuesday, 07-04-2026
            </p>
          </div>

          {/* RECORD BUTTON */}
          <button className="ml-4 flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2 rounded-2xl text-[13px] font-semibold bg-red-50/30 hover:bg-red-50 transition">

            <Circle
              size={10}
              fill="#ef4444"
              color="#ef4444"
            />

            Start Recording

          </button>

        </div>

        {/* RIGHT */}
        <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-5 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-sm">

          leave Huddle

          <PhoneOff size={18} />

        </button>

      </header>

      {/* ================= BODY ================= */}
      <main className="flex-1 p-4 flex gap-4 min-h-0 overflow-hidden">

        {/* ================= MAIN VIDEO ================= */}
        <div className="flex-1 relative rounded-[28px] overflow-hidden bg-black shadow-sm h-full">
          {/* IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=1600"
            alt="meeting"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* LIGHT OVERLAY */}
          <div className="absolute inset-0 bg-black/5"></div>

          {/* ================= TOP RIGHT STATS ================= */}
          <div className="absolute top-5 right-5 flex flex-col gap-3 z-20">

            {/* USERS */}
            <div className="bg-black/35 backdrop-blur-xl px-3 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-lg">

              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                className="w-7 h-7 rounded-lg border border-white/20"
              />

              <img
                src="https://randomuser.me/api/portraits/men/60.jpg"
                className="w-7 h-7 rounded-lg border border-white/20"
              />

              <span className="text-white/80 text-xs font-medium px-1">
                +3
              </span>

            </div>

            {/* HANDS */}
            <div className="bg-white/95 backdrop-blur-xl px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg">

              <span className="text-[15px] font-bold text-slate-700">
                ✋ 12
              </span>

              <img
                src="https://randomuser.me/api/portraits/women/33.jpg"
                className="w-7 h-7 rounded-lg"
              />

              <img
                src="https://randomuser.me/api/portraits/men/33.jpg"
                className="w-7 h-7 rounded-lg"
              />

              <span className="text-slate-400 text-xs font-semibold">
                +3
              </span>

            </div>

          </div>

          {/* ================= NAME ================= */}
          <h1 className="absolute bottom-7 left-7 text-white text-[38px] font-bold drop-shadow-lg z-20">
            Sam
          </h1>

          {/* ================= PIP ================= */}
          <div className="absolute bottom-5 right-5 w-[170px] h-[110px] rounded-[55px] bg-slate-800/75 backdrop-blur-2xl border border-white/10 flex items-center justify-center z-20 shadow-2xl">

            <div className="text-center">

              <div className="w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center mx-auto font-bold text-sm">
                SM
              </div>

              <p className="text-white text-xs font-semibold mt-2">
                Sam
              </p>

            </div>

          </div>

        </div>

        {/* ================= SIDEBAR ================= */}
        <div className="w-[280px] flex flex-col gap-4 shrink-0">

          {participants.map((user) => (
            <div
              key={user.id}
              className="bg-slate-500/95 backdrop-blur-xl border border-white/5 rounded-[24px] p-4 flex items-center gap-4 shadow-lg hover:-translate-y-1 transition duration-300"
            >

              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-[18px] object-cover"
              />

              <div className="flex-1 flex items-center justify-between">

                <h4 className="text-white font-semibold text-[15px]">
                  {user.name}
                </h4>

                {user.muted && (
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center text-sm">
                    🔇
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="h-[95px] bg-[#f8fafc] border-t border-slate-200 flex items-center justify-between px-6 shrink-0">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
            Meet ID
          </span>

          <div className="bg-slate-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">

            NFT-rdtve9

            <Copy size={14} />

          </div>

        </div>

        {/* CENTER */}
        <div className="bg-white px-5 py-3 rounded-[24px] shadow-md flex items-center gap-3 border border-slate-100">

          {/* MIC */}
          <div className="flex items-center bg-slate-50 rounded-xl px-1">

            <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
              <MicOff size={18} />
            </button>

            <ChevronDown size={15} className="text-slate-400 mr-2" />

          </div>

          {/* VIDEO */}
          <div className="flex items-center bg-slate-50 rounded-xl px-1">

            <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
              <VideoOff size={18} />
            </button>

            <ChevronDown size={15} className="text-slate-400 mr-2" />

          </div>

          {/* SHARE */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
            <Share size={18} />
          </button>

          {/* DIVIDER */}
          <div className="w-px h-7 bg-slate-200"></div>

          {/* HAND */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-yellow-500 hover:bg-yellow-100 transition">
            <Hand size={18} />
          </button>

          {/* USERS */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
            <Users size={18} />
          </button>

          {/* MORE */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
            <MoreVertical size={18} />
          </button>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <button className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-400 transition shadow-sm">

            <FileText size={18} />

          </button>

          <button className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-400 transition shadow-sm">

            <LayoutGrid size={18} />

          </button>

        </div>

      </footer>

    </div>
  );
};

export default Meeting;