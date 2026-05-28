import React, { useState } from "react";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share,
  Hand,
  UserPlus,
  MoreVertical,
  Copy,
  PhoneOff,
  Circle,
  LayoutGrid,
  FilePenLine,
  Monitor,
  ChevronDown,
  Search,
  X,
  SendHorizontal,
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
  "John",
  "Emma",
  "David",
  "Sophia",
  "Chris",
  "Olivia",
  "Daniel",
  "Mia",
  "Ethan",
  "Lily",
  "Noah",
  "Ava",
];

const Meeting = () => {
  const [showHandRaise, setShowHandRaise] =
    useState(false);

  const [showParticipants, setShowParticipants] =
    useState(false);

  const [showParticipantsGrid, setShowParticipantsGrid] =
    useState(false);

  const [showMenuPage, setShowMenuPage] =
    useState(false);

  const [activeMenu, setActiveMenu] =
    useState("assistance");

  const [transcriptionEnabled, setTranscriptionEnabled] =
    useState(true);

  // CHAT
  const [message, setMessage] = useState("");

  const [chatMessages, setChatMessages] =
    useState([
      {
        sender: "Rahul",
        text: "Can we start the demo?",
      },
      {
        sender: "Anika",
        text: "Sharing the screen now.",
      },
    ]);

  // SEND MESSAGE
  const handleSendMessage = () => {
    if (message.trim() === "") return;

    setChatMessages([
      ...chatMessages,
      {
        sender: "You",
        text: message,
      },
    ]);

    setMessage("");
  };

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

        {/* ================= MAIN AREA ================= */}
        <div
          className={`relative rounded-[28px] overflow-hidden bg-black shadow-sm h-full transition-all duration-300 ${showParticipantsGrid
              ? "w-full"
              : showHandRaise ||
                showParticipants ||
                showMenuPage
                ? "w-[80%]"
                : "w-full"
            }`}
        >

          {/* ================= PARTICIPANTS GRID ================= */}
          {showParticipantsGrid ? (

            <div className="w-full h-full bg-[#0f172a] p-6 overflow-y-auto">

              {/* TOP BAR */}
              <div className="flex items-center justify-between mb-6">

                <h2 className="text-white text-2xl font-bold">
                  All Participants
                </h2>

                <button
                  onClick={() =>
                    setShowParticipantsGrid(false)
                  }
                  className="bg-white text-slate-700 px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-slate-100 transition"
                >
                  Back to Meeting
                </button>

              </div>

              {/* GRID */}
              <div className="grid grid-cols-4 gap-5">

                {participantMembers.map(
                  (member, index) => (

                    <div
                      key={index}
                      className="relative h-[240px] rounded-[28px] overflow-hidden border border-slate-700 bg-slate-900"
                    >

                      <img
                        src={`https://randomuser.me/api/portraits/${index % 2 === 0
                            ? "men"
                            : "women"
                          }/${index + 20}.jpg`}
                        alt={member}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/20"></div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">

                        <div className="bg-black/40 backdrop-blur-xl px-3 py-1 rounded-xl text-white text-sm font-medium">
                          {member}
                        </div>

                        <div className="bg-black/40 p-2 rounded-full">
                          <MicOff
                            size={15}
                            className="text-white"
                          />
                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          ) : (

            <>
              {/* IMAGE */}
              <img
                src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=1600"
                alt="meeting"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-black/5"></div>

              {/* TOP RIGHT */}
              <div className="absolute top-5 right-5 flex flex-col gap-3 z-20">

                {/* PARTICIPANTS */}
                <button
                  onClick={() => {
                    setShowParticipants(
                      !showParticipants
                    );
                    setShowHandRaise(false);
                    setShowMenuPage(false);
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

                {/* HAND RAISE */}
                <button
                  onClick={() => {
                    setShowHandRaise(!showHandRaise);
                    setShowParticipants(false);
                    setShowMenuPage(false);
                  }}
                  className="bg-white/95 backdrop-blur-xl px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg hover:scale-105 transition"
                >

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

                </button>

              </div>

              {/* NAME */}
              <h1 className="absolute bottom-7 left-7 text-white text-[38px] font-bold drop-shadow-lg z-20">
                Andaya
              </h1>

              {/* SMALL VIDEO */}
              <div className="absolute bottom-5 right-5 w-[220px] h-[140px] rounded-[40px] bg-[#1f1f24] backdrop-blur-2xl border border-white/10 flex items-center justify-center z-20 shadow-2xl">

                <div className="text-center">

                  <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center mx-auto font-bold text-lg border border-blue-500">
                    AD
                  </div>

                  <p className="text-white text-sm font-semibold mt-3">
                    Andaya
                  </p>

                </div>

              </div>

            </>
          )}
        </div>

        {/* ================= SIDEBAR ================= */}
        {(showHandRaise || showParticipants) &&
          !showParticipantsGrid &&
          !showMenuPage && (

            <div className="w-[20%] bg-white rounded-[24px] border border-slate-200 p-4 flex flex-col h-full">

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
              <div className="space-y-3 overflow-y-auto flex-1">

                {(showHandRaise
                  ? handRaiseMembers
                  : participantMembers.slice(0, 8)
                ).map((member, index) => (

                  <div
                    key={index}
                    className="border border-slate-300 rounded-xl px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={`https://randomuser.me/api/portraits/${index % 2 === 0
                            ? "men"
                            : "women"
                          }/${index + 20}.jpg`}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {member}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

              {/* VIEW ALL PARTICIPANTS */}
              {!showHandRaise && (

                <button
                  onClick={() =>
                    setShowParticipantsGrid(true)
                  }
                  className="mt-5 bg-[#0f172a] text-white py-3 rounded-2xl text-sm font-semibold hover:bg-slate-800 transition"
                >
                  View All Participants
                </button>

              )}

            </div>

          )}

        {/* ================= MENU PAGE ================= */}
        {showMenuPage && (

          <div className="w-[20%] bg-white rounded-[24px] border border-slate-200 p-4 h-full flex flex-col">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">

              <h2 className="text-[18px] font-semibold text-slate-700">
                Menu
              </h2>

              <button
                onClick={() => setShowMenuPage(false)}
                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100"
              >
                <X size={16} />
              </button>

            </div>

            {/* TABS */}
            <div className="mt-5 bg-[#f3f4f6] rounded-full p-1 flex items-center">

              <button
                onClick={() => setActiveMenu("chat")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeMenu === "chat"
                    ? "bg-[#0f2a78] text-white"
                    : "text-slate-500"
                  }`}
              >
                Chat
              </button>

              <button
                onClick={() => setActiveMenu("notes")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeMenu === "notes"
                    ? "bg-[#0f2a78] text-white"
                    : "text-slate-500"
                  }`}
              >
                Notes
              </button>

              <button
                onClick={() =>
                  setActiveMenu("assistance")
                }
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeMenu === "assistance"
                    ? "bg-[#0f2a78] text-white"
                    : "text-slate-500"
                  }`}
              >
                AI
              </button>

            </div>

            {/* CONTENT */}
            <div className="mt-5 flex-1 overflow-hidden flex flex-col">

              {/* CHAT */}
              {activeMenu === "chat" && (

                <div className="flex flex-col h-full">

                  <div className="flex-1 overflow-y-auto space-y-4">

                    {chatMessages.map((msg, index) => (

                      <div
                        key={index}
                        className={`flex ${msg.sender === "You"
                            ? "justify-end"
                            : "justify-start"
                          }`}
                      >

                        <div
                          className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.sender === "You"
                              ? "bg-[#0f2a78] text-white"
                              : "bg-slate-100 text-slate-700"
                            }`}
                        >

                          <p className="text-xs font-semibold mb-1">
                            {msg.sender}
                          </p>

                          <p className="text-sm">
                            {msg.text}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  {/* INPUT */}
                  <div className="mt-4 flex items-center gap-2">

                    <input
                      type="text"
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      placeholder="Type a message..."
                      className="flex-1 border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none"
                    />

                    <button
                      onClick={handleSendMessage}
                      className="w-12 h-12 rounded-2xl bg-[#0f2a78] text-white flex items-center justify-center"
                    >
                      <SendHorizontal size={18} />
                    </button>

                  </div>

                </div>

              )}

              {/* NOTES */}
              {activeMenu === "notes" && (

                <textarea
                  placeholder="Write meeting notes..."
                  className="w-full h-full border border-slate-300 rounded-2xl p-4 outline-none resize-none"
                ></textarea>

              )}

              {/* AI */}
              {activeMenu === "assistance" && (

                <div className="flex flex-col gap-4">

                  <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between">

                    <div>
                      <p className="font-semibold text-slate-700">
                        AI Transcription
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Live captions enabled
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setTranscriptionEnabled(
                          !transcriptionEnabled
                        )
                      }
                      className={`w-14 h-7 rounded-full flex items-center px-1 transition ${transcriptionEnabled
                          ? "bg-[#0f2a78]"
                          : "bg-slate-300"
                        }`}
                    >

                      <div
                        className={`w-5 h-5 rounded-full bg-white transition ${transcriptionEnabled
                            ? "translate-x-7"
                            : ""
                          }`}
                      ></div>

                    </button>

                  </div>

                  {/* LIVE TRANSCRIPTION */}
                  {transcriptionEnabled && (

                    <div className="space-y-3">

                      <div className="bg-slate-100 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-blue-700 mb-1">
                          LIVE
                        </p>

                        <p className="text-sm text-slate-700">
                          Rahul: Let's begin the sprint review meeting.
                        </p>
                      </div>

                      <div className="bg-slate-100 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-blue-700 mb-1">
                          LIVE
                        </p>

                        <p className="text-sm text-slate-700">
                          Anika: Sharing the analytics dashboard now.
                        </p>
                      </div>

                    </div>

                  )}

                </div>

              )}

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
              <Mic size={18} />
            </button>

            <ChevronDown
              size={15}
              className="text-slate-400 mr-2"
            />

          </div>

          {/* VIDEO */}
          <div className="flex items-center bg-slate-50 rounded-xl px-1">

            <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
              <Video size={18} />
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

          <div className="w-px h-7 bg-slate-200"></div>

          {/* HAND */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-yellow-500 hover:bg-yellow-200 transition">
            <Hand size={18} />
          </button>

          {/* USER PLUS */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
            <UserPlus size={18} />
          </button>

          {/* MORE */}
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-400 transition">
            <MoreVertical size={18} />
          </button>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <button className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-400 transition shadow-sm">
            <FilePenLine size={18} />
          </button>

          {/* MENU */}
          <button
            onClick={() => {
              setShowMenuPage(!showMenuPage);
              setShowParticipants(false);
              setShowHandRaise(false);
            }}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-400 transition shadow-sm"
          >
            <LayoutGrid size={18} />
          </button>

        </div>

      </footer>

    </div>
  );
};

export default Meeting;