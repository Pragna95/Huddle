import { Mic, X } from "lucide-react";

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
            <div className="bg-white w-full max-w-6xl rounded-3xl border-2 border-blue-500 p-6 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center mb-8">

                    <div className="flex items-center gap-3">

                        <Mic className="text-blue-700 w-10 h-10" />

                        <h1 className="text-4xl font-bold text-blue-700">
                            Meet transcript
                        </h1>

                    </div>

                    {/* Close Button */}
                    <button
                        onClick={closeTranscript}
                        className="ml-auto border-2 border-gray-500 rounded-xl p-2 hover:bg-gray-100"
                    >
                        <X className="w-6 h-6" />
                    </button>

                </div>

                {/* Transcript List */}
                <div className="space-y-8">

                    {transcripts.map((item, index) => (

                        <div key={index} className="flex gap-5">

                            {/* Avatar */}
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="avatar"
                                className="w-14 h-14 rounded-lg"
                            />

                            {/* Message Section */}
                            <div className="flex-1">

                                <h2 className="text-2xl font-semibold text-gray-600 mb-3">
                                    {item.name}
                                </h2>

                                <div className="bg-gray-100 rounded-3xl p-6">

                                    <p className="text-2xl text-gray-700 leading-relaxed">
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