import { Card, CardContent } from "@/components/ui/card";
import { Mic, Sparkles, X } from "lucide-react";

export default function AISummaryCard({ closeCard }) {

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

            <Card className="w-[80%] max-w-5xl rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-full">
                        <Mic className="text-blue-700 w-7 h-7" />
                    </div>

                    <div className="flex items-center gap-2">

                        <Sparkles className="text-blue-700 w-5 h-5" />

                        <h1 className="text-4xl font-bold text-blue-700">
                            AI Summary
                        </h1>

                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={closeCard}
                        className="ml-auto border rounded-xl p-2 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>

                </div>

                <CardContent className="p-0">

                    <p className="text-2xl leading-relaxed">

                        In a recent meeting, our team discussed the upcoming
                        summer project initiatives.

                    </p>

                </CardContent>

            </Card>

        </div>
    );
}