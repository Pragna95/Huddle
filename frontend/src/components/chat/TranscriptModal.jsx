import {  X } from "lucide-react";

export default function TranscriptModal({ closeTranscript }) {
  const transcripts = [
    {
      name: "Jane Smith",
      message:
        "I've reviewed the portfolio for candidate John Doe. His React architecture patterns are impressive.",
    },
    {
      name: "Michael Johnson",
      message:
        "I analyzed the work samples of Sara Lee. Her UI designs are user-centric and visually appealing.",
    },
    {
      name: "Emily Davis",
      message:
        "I've assessed the project submissions of Alex Brown. His attention to detail in animation is commendable.",
    },
    {
      name: "David Wilson",
      message:
        "After going through the portfolio of Maria Garcia, I found her accessibility practices to be quite advanced.",
    },
    {
      name: "Sophia Turner",
      message:
        "I evaluated the case studies of Chris White. His data visualization skills are particularly strong.",
    },
    {
      name: "Daniel Martinez",
      message:
        "I reviewed the design frameworks used by Olivia Thompson. Her approach to prototyping is highly efficient.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      {/* Main Modal */}
      <div
        className="
          bg-white

          w-[650px]
          h-[714px]

          rounded-[12px]

          border
          border-blue-500

          pt-[21px]
          pr-[16px]
          pb-[21px]
          pl-[16px]

          flex
          flex-col

          gap-[10px]

          shadow-2xl

          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-3">
          <img
              src="/mic-icon.svg"
              alt="Mic"
              className="w-[28px] h-[28px] pl-2"
            />

            <h1 className="text-[14px] font-bold text-[#0046BB]">
              Meet transcript
            </h1>
          </div>

          {/* Close Button */}
          <button
            onClick={closeTranscript}
            className="
              ml-auto

              w-[24px]
              h-[24px]

              border-2
              border-gray-500

              rounded-[5px]

              hover:bg-gray-100

              flex
              items-center
              justify-center
            "
          >
            <X className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* Transcript List */}
        <div
          className="
            flex-1
            overflow-y-auto

            space-y-10

            pr-2
            -mt-4
            
          "
        >
          {transcripts.map((item, index) => (
            <div key={index} className="flex gap-4 w-[600px] h-[98px] ">
              {/* Avatar */}
              <img
                src="https://i.pravatar.cc/100"
                alt="avatar"
                className="w-[32px] h-[36px] rounded-lg shrink-0"
              />

              {/* Message Section */}
              <div className="flex-1 w-[552px] h-[98px]  ">
                <h2 className="text-[14px] font-semibold text-gray-500 mb-1">
                  {item.name}
                </h2>

                <div className="bg-gray-100 rounded-2xl p-2 ">
                  <p className="text-normal text-[#434655] leading-relaxed w-[540px] h-[78px]">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}