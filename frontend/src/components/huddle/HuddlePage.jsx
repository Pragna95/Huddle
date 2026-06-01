import React, { useState } from "react";
import ChatList from "../chat/ChatList";
import SessionCard from "./SessionCard";
import CreateHuddle from "./CreateHuddle";
import MiniCalendar from "../calender/MiniCalender";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const TABS = ["Ongoing", "Scheduled", "Completed"];

const sessions = [
  {
    id: 1,
    project: "PROJECT STARLIGHT",
    title: "Architecture Review",
    description: "Review system design and dependencies.",
    time: "8:00 AM – 10:00 AM",
    participants: 4,
    status: "Ongoing",
  },
  {
    id: 2,
    project: "PROJECT STARLIGHT",
    title: "Design Sync",
    description: "Discuss UI/UX updates for next sprint.",
    time: "11:00 AM – 12:00 PM",
    participants: 6,
    status: "Scheduled",
    date: "2026-05-18",
  },
  {
    id: 3,
    project: "PROJECT STARLIGHT",
    title: "Retrospective",
    description: "Review sprint outcomes and lessons learned.",
    time: "Yesterday 4:00 PM – 5:00 PM",
    participants: 5,
    status: "Completed",
    date: "2026-05-16",
  },
];

export default function HuddlePage() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [meetingId, setMeetingId] = useState("");

  const handleJoinSession = () => {
    if (!meetingId.trim()) {
      alert("Please enter a valid Meeting ID.");
      return;
    }
    console.log("Joining meeting:", meetingId);
  };

  const filteredSessions = sessions.filter((s) => s.status === activeTab);

  return (
    <div className="flex w-[1329px] h-[824px] bg-gray-50 overflow-y-auto mx-auto gap-[24px]">
      
      {/* Left Sidebar */}
        <ChatList />
     

      {/* Middle Section */}
      <main className="flex-1 h-[478px] bg-white p-6 overflow-y-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Huddle</h1>
        <p className="text-gray-500 text-sm mb-5">
          Manage your workspace and upcoming sessions.
        </p>

        {/* Meeting ID input */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Meeting ID (e.g. 123-456-7)"
              className="pl-9 border-gray-200 rounded-lg h-10 text-sm"
            />
          </div>

          <Button
            onClick={handleJoinSession}
            className="bg-[#1e2b72] hover:bg-[#152060] text-white rounded-lg px-5 font-medium"
          >
            Join Session
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-100">
          <div className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium relative ${
                  activeTab === tab
                    ? "text-[#1e2b72]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e2b72]" />
                )}
              </button>
            ))}
          </div>

          <button className="text-sm text-gray-500">Filter ⚙</button>
        </div>

        {/* Session Cards */}
        <div className="flex flex-col gap-4">
          {filteredSessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[478.5px] h-[553px] bg-gray-50 border-l border-gray-100 p-5 flex flex-col gap-5 overflow-y-auto">
        <CreateHuddle />
        <MiniCalendar />
      </aside>
    </div>
  );
}