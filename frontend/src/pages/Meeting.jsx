import React, { useState } from "react";

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
  ChevronDown,
  Search,
} from "lucide-react";

const handRaiseMembers = [
  "Rahul",
  "Anika",
  "James",
  "Priya",
  "Michael",
  "Fatima",
  "Kevin",
  "Sofia",
];

const participantMembers = [
  "Rahul",
  "Anika",
  "James",
  "Priya",
  "Michael",
  "Fatima",
  "Kevin",
  "Sofia",
];

const Meeting = () => {
  const [showHandRaise, setShowHandRaise] =
    useState(false);

  const [showParticipants, setShowParticipants] =
    useState(false);

  return (
    <div className="h-screen w-screen bg-[#f4f4f5] flex flex-col overflow-hidden font-sans">

      {/* ================= HEADER ================= */}
      <header className="h-[78px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-sm">

            <Monitor size={22} fill="white" />

          </div>

          <div className="leading-tight">

            <h2 className="text-[17px] font-bold text-slate-800">
              Huddle_Name
            </h2>

            <p className="text-[12px] text-slate-400 mt-1">
              Tuesday, 07-04-2026
            </p>

          </div>

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

          Leave Huddle

          <PhoneOff size={18} />

        </button>

      </header>

      {/* ================= BODY ================= */}
      <main className="flex-1 p-4 flex gap-4 min-h-0 overflow-hidden">

        {/* ================= MAIN VIDEO ================= */}
        <div
          className={`relative rounded-[28px] overflow-hidden bg-black shadow-sm h-full transition-all duration-300 ${
            showHandRaise || showParticipants
              ? "w-[75%]"
              : "w-full"
          }`}
        >

          {/* IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=1600"
            alt="meeting"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/5"></div>

          {/* ================= TOP RIGHT ================= */}
          {!showParticipants && (

            <div className="absolute top-5 right-5 flex flex-col gap-3 z-20">

              {/* PARTICIPANTS BUTTON */}
              <button
                onClick={() => {
                  setShowParticipants(
                    !showParticipants
                  );
                  setShowHandRaise(false);
                }}
                className="bg-black/35 backdrop-blur-xl px-3 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-lg hover:scale-105 transition"
              >

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

              </button>

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

          )}

          {/* NAME */}
          <h1 className="absolute bottom-7 left-7 text-white text-[38px] font-bold drop-shadow-lg z-20">
            Sam
          </h1>

          {/* PIP */}
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

        {/* ================= RIGHT SIDEBAR ================= */}
        {(showHandRaise || showParticipants) && (

          <div className="w-[25%] bg-white rounded-[24px] border border-slate-200 p-4 flex flex-col h-full">

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h2 className="text-[17px] font-semibold text-slate-700">
                {showHandRaise
                  ? "Hand Raise"
                  : "Participants"}
              </h2>

              <button
                onClick={() => {
                  setShowHandRaise(false);
                  setShowParticipants(false);
                }}
                className="w-6 h-6 border border-slate-300 rounded flex items-center justify-center text-slate-500"
              >
                ×
              </button>

            </div>

            {/* SEARCH */}
            <div className="relative mb-4">

              <Search
                size={15}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                placeholder="search"
                className="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
              />

            </div>

            {/* COUNT */}
            <p className="text-sm text-slate-500 mb-4">
              {showHandRaise
                ? "12 Members"
                : "40 Participants"}
            </p>

            {/* MEMBERS */}
            <div className="space-y-3 overflow-y-auto">

              {(showHandRaise
                ? handRaiseMembers
                : participantMembers
              ).map((member, index) => (

                <div
                  key={index}
                  className="border border-slate-300 rounded-xl px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition"
                >

                  <div className="flex items-center gap-3">

                    <img
                      src={`https://randomuser.me/api/portraits/${
                        index % 2 === 0
                          ? "men"
                          : "women"
                      }/${index + 20}.jpg`}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {member}
                    </span>

                  </div>

                  {!showHandRaise &&
                    index === 0 && (

                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-semibold">
                        Host
                      </span>

                    )}

                </div>

              ))}

            </div>

          </div>

        )}

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

            <ChevronDown
              size={15}
              className="text-slate-400 mr-2"
            />

          </div>

          {/* VIDEO */}
          <div className="flex items-center bg-slate-50 rounded-xl px-1">

            <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">

              <VideoOff size={18} />

            </button>

            <ChevronDown
              size={15}
              className="text-slate-400 mr-2"
            />

          </div>

          {/* SHARE */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">

            <Share size={18} />

          </button>

          {/* DIVIDER */}
          <div className="w-px h-7 bg-slate-200"></div>

          {/* HAND */}
          <button
            onClick={() => {
              setShowHandRaise(!showHandRaise);
              setShowParticipants(false);
            }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-yellow-500 hover:bg-yellow-200 transition"
          >

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