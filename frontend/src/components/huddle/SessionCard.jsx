import React from "react";

function handleTranscript(session) {
    // Call your backend API to get transcript
    fetch(`/api/transcripts/${session.id}`)
        .then((res) => res.json())
        .then((data) => {
            // For now, just show it in an alert
            alert(`Transcript for "${session.title}":\n\n${data.transcript}`);
        })
        .catch((err) => {
            console.error("Error fetching transcript:", err);
            alert("Sorry, transcript could not be generated.");
        });
}

export default function SessionCard({ session }) {
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
            <h2 className="text-sm font-bold text-gray-900 mb-0.5">{session.title}</h2>
            <p className="text-xs text-gray-600 mb-2">{session.description}</p>

            {/* Participants & Time */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1.5">
                    <img src="/avatars/avatar1.png" alt="participant" className="w-5 h-5 rounded-full" />
                    <img src="/avatars/avatar2.png" alt="participant" className="w-5 h-5 rounded-full" />
                    <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full">
                        +{session.participants}
                    </span>
                    <span className="ml-1">{session.time}</span>
                </div>

                {(session.status === "Scheduled" || session.status === "Completed") &&
                    session.date && <span className="text-gray-400">{session.date}</span>}
            </div>

            {/* Action Buttons */}
            <div className="mt-1">
                {session.status === "Ongoing" && (
                    <button className="bg-[#1e2b72] hover:bg-[#152060] text-white w-full py-1.5 rounded-md text-xs font-medium">
                        Join Room
                    </button>
                )}

                {session.status === "Scheduled" && session.date && (
                    <p className="text-gray-500 italic text-xs">Scheduled for {session.date}</p>
                )}

                {session.status === "Completed" && (
                    <div className="flex justify-between gap-3">
                        <button className="border border-[#1e2b72] text-[#1e2b72] hover:bg-[#1e2b72] hover:text-white px-3 py-1 rounded-md text-sm font-medium">
                            AI Summary
                        </button>
                        <button
                            onClick={() => handleTranscript(session)}
                            className="border border-[#1e2b72] text-[#1e2b72] hover:bg-[#1e2b72] hover:text-white px-3 py-1 rounded-md text-sm font-medium text-center"
                        >
                            View Transcript
                        </button>
                        <button className="border border-[#1e2b72] text-[#1e2b72] hover:bg-[#1e2b72] hover:text-white px-3 py-1 rounded-md text-sm font-medium">
                            View Recording
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}