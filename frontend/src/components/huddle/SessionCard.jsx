import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AISummaryCard from "@/components/chat/AISummaryCard";
import TranscriptModal from "@/components/chat/TranscriptModal";

function handleTranscript(session) {
  fetch(`/api/transcripts/${session.id}`)
    .then((res) => res.json())
    .then((data) => {
      alert(`Transcript for "${session.title}":\n\n${data.transcript}`);
    })
    .catch((err) => {
      console.error("Error fetching transcript:", err);
      alert("Sorry, transcript could not be generated.");
    });
}

export default function SessionCard({ session }) {
  const [showSummary, setShowSummary] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`rounded-lg border ${["Ongoing", "Scheduled", "Completed"].includes(session.status)
        ? "border-[#1e2b72]"
        : "border-gray-200"
        } bg-white p-3 shadow-sm`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-0.5">
        <p className="text-[11px] font-semibold text-[#1e2b72] uppercase tracking-wide">
          {session.project}
        </p>

        {session.status === "Ongoing" && (
          <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
            ● LIVE
          </span>
        )}
      </div>

      {/* Title & Description */}
      <h2 className="text-sm font-bold text-gray-900 mb-0.5">
        {session.title}
      </h2>

      <p className="text-xs text-gray-600 mb-2">
        {session.description}
      </p>

      {/* Participants & Time */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1.5">
          <img
            src="/avatars/avatar1.png"
            alt="participant"
            className="w-5 h-5 rounded-full"
          />
          <img
            src="/avatars/avatar2.png"
            alt="participant"
            className="w-5 h-5 rounded-full"
          />

          <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full">
            +{session.participants}
          </span>

          <span className="ml-1">{session.time}</span>
        </div>

        {(session.status === "Scheduled" ||
          session.status === "Completed") &&
          session.date && (
            <span className="text-gray-400">{session.date}</span>
          )}
      </div>

      {/* Action Buttons */}
      <div className="mt-1">
        {session.status === "Ongoing" && (
          <button
            onClick={() => navigate("/meeting")}
            className="bg-[#002266] hover:bg-[#152060] text-white w-full py-1.5 rounded-md text-xs font-medium"
          >
            Join Room
          </button>
        )}

        {session.status === "Scheduled" && session.date && (
          <p className="text-gray-500 italic text-xs">
            Scheduled for {session.date}
          </p>
        )}

        {session.status === "Completed" && (
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* AI SUMMARY */}
            <div
              className="
                                p-[1px]
                                rounded-[13px]
                                bg-[linear-gradient(90deg,#ff7a18,#ff4fd8,#3b82f6,#1d4ed8)]
                            "
            >
              <button
                onClick={() => setShowSummary(true)}
                className="
    h-[36px]
    min-w-[110px]
    px-3
    rounded-[12px]
    bg-white
    text-[#0046BB]
    text-[13px]
    font-semibold
    flex
    items-center
    justify-center
    transition-all
    duration-300
    whitespace-nowrap
    hover:bg-[#152060]
    hover:text-white"
              >
                AI Summary
              </button>
            </div>

            {showSummary && (
              <AISummaryCard
                closeCard={() => setShowSummary(false)}
              />
            )}

            {/* VIEW TRANSCRIPT */}
            <button
              onClick={() => setShowTranscript(true)}
              className="
    shadow-[0_8px_25px_rgba(29,78,216,0.25)]
    h-[36px]
    min-w-[110px]
    px-3
    rounded-[13px]
    bg-white
    border
    border-[#002266]
    text-[#002266]
    text-[13px]
    font-semibold
    flex
    items-center
    justify-center
    transition-all
    duration-300
    whitespace-nowrap
    hover:bg-[#152060]
    hover:text-white
  "
            >
              View Transcript
            </button>

            {showTranscript && (
              <TranscriptModal
                closeTranscript={() =>
                  setShowTranscript(false)
                }
              />
            )}

            {/* VIEW RECORDING */}
            <button
              className="
    shadow-[0_5px_15px_rgba(29,78,216,0.25)]
    h-[36px]
    min-w-[110px]
    px-3
    rounded-[13px]
    bg-white
    border
    border-[#002266]
    text-[#002266]
    text-[13px]
    font-semibold
    flex
    items-center
    justify-center
    transition-all
    duration-300
    whitespace-nowrap
    hover:bg-[#152060]
    hover:text-white
  "
            >
              View Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
}