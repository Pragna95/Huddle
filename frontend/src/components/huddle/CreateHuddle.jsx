import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";

export default function CreateHuddle() {
  return (
    <div className="bg-[#1e2b72] rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-5 h-5 text-blue-300" />
        <h2 className="font-bold text-lg">Create a Huddle</h2>
      </div>
      <p className="text-blue-200 text-sm mb-4">
        You can schedule your customized huddle at any time.
      </p>
      <Button
        variant="outline"
        className="w-full border-white/30 text-white bg-white/5 hover:bg-white/15 rounded-xl font-semibold flex items-center gap-2 h-11"
      >
        <Plus className="w-4 h-4" />
            CREATE A MEET   
      </Button>
    </div>
  );
}