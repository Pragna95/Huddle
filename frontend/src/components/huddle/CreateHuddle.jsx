import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Video, Plus, Calendar, Zap } from "lucide-react";
import AdvanceSchedule from "@/components/schedule/AdvanceSchedule";

export default function CreateHuddle() {
  const [openSchedule, setOpenSchedule] = useState(false);

  const handleInstantMeeting = () => {
    const instantLink = `https://meet.gadigital.com/${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    alert(`Instant Meeting Created!\n${instantLink}`);
  };

  return (
    <>
      <div className="bg-[#1e2b72] rounded-2xl p-5 text-white shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Video className="w-5 h-5 text-blue-300" />
          <h2 className="font-bold text-lg">Create a Huddle</h2>
        </div>

        <p className="text-blue-200 text-sm mb-4">
          You can schedule your customized huddle at any time.
        </p>

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
className="
  w-full
  bg-white
  text-black
  border-white
  hover:bg-gray-100
  rounded-xl
  font-semibold
  flex items-center gap-2
  h-11
  transition-all"
            >
              <Plus className="w-4 h-4" />
              CREATE A MEET
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
  align="center"
  sideOffset={10}
  className="
    w-[var(--radix-dropdown-menu-trigger-width)]
    rounded-3xl
    border border-slate-200/70
    bg-white
    shadow-[0_20px_60px_rgba(0,0,0,0.18)]
    p-3
    animate-in fade-in-0 zoom-in-95
  "
>
  {/* Title */}
  <div className="px-3 py-2 border-b mb-2">
    <p className="font-bold text-gray-800 text-sm">
      Create a new meeting
    </p>
    <p className="text-xs text-gray-500">
      Choose how you want to start
    </p>
  </div>

  {/* Instant Meeting */}
  <DropdownMenuItem
    onClick={handleInstantMeeting}
    className="
      rounded-2xl
      p-4
      cursor-pointer
      hover:bg-[#eef2ff]
      transition-all
      flex items-center gap-4
      mb-2
    "
  >
    <div className="p-3 bg-[#e0e7ff] rounded-2xl shadow-sm">
      <Zap className="w-5 h-5 text-[#1e2b72]" />
    </div>

    <div>
      <p className="font-semibold text-gray-800">
        Instant Meeting
      </p>
      <p className="text-xs text-gray-500">
        Start right now with one click
      </p>
    </div>
  </DropdownMenuItem>

  {/* Scheduled Meeting */}
  <DropdownMenuItem
    onClick={() => setOpenSchedule(true)}
    className="
      rounded-2xl
      p-4
      cursor-pointer
      hover:bg-[#eef2ff]
      transition-all
      flex items-center gap-4
    "
  >
    <div className="p-3 bg-[#e0e7ff] rounded-2xl shadow-sm">
      <Calendar className="w-5 h-5 text-[#1e2b72]" />
    </div>

    <div>
      <p className="font-semibold text-gray-800">
        Scheduled Meeting
      </p>
      <p className="text-xs text-gray-500">
        Plan and invite attendees
      </p>
    </div>
  </DropdownMenuItem>
</DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Advanced schedule dialog */}
      <AdvanceSchedule
        open={openSchedule}
        setOpen={setOpenSchedule}
      />
    </>
  );
}