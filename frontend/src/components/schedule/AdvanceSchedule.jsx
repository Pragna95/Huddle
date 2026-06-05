import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createMeeting } from "@/services/meetingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUsers } from "@/services/UserService";
import { Calendar, ChevronDown } from "lucide-react";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "Su"];

export default function AdvanceSchedule({ open, setOpen }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const [allDay, setAllDay] = useState(false);
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4]);

  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");

  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = (await fetchUsers()) || [];

      console.log("Fetched Users:", users);

      const formatted = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        selected: false,
      }));

      console.log("Formatted Users:", formatted);

      setParticipants(formatted);
    } catch (error) {
      console.error(error);
    }
  };
  const filteredParticipants = participants.filter((p) => {
    const q = search.toLowerCase();

    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    );
  });

  const toggleDay = (index) => {
    setSelectedDays((prev) =>
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index]
    );
  };

  const toggleParticipant = (id) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const handleSchedule = async () => {
    try {
      if (!title.trim()) {
        alert("Please enter a meeting title");
        return;
      }

      const selectedUsers = participants.filter((p) => p.selected);

      if (selectedUsers.length === 0) {
        alert("Please select at least one participant");
        return;
      }

      setLoading(true);

      // const payload = {
      //   title,
      //   description,
      //   attendees: selectedUsers.map((p) => ({
      //     email: p.email,
      //   })),
      // };
      const payload = {
        title,
        description,

        start_date: startDate,
        start_time: startTime,
        end_time: endTime,

        all_day: allDay,

        recurrence_type: "weekly",

        weekdays: selectedDays,

        attendees: selectedUsers.map((p) => ({
          email: p.email,
        })),
      };
      console.log(payload);
      const result = await createMeeting(payload);

      setMeetingLink(result.meeting_link);

      alert("Meeting created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
    w-full
    h-full
    pt-8
    pr-8
    pb-12
    pl-8
    flex
    flex-col
    gap-8
  "
      >
        {/* HEADER */}
        <div className="
    w-[915px]
    h-[44px]
    flex
    items-center
    justify-between
    shrink-0
  ">
          <div className="flex items-center gap-4">
            <div className="
    w-12
    h-12
    rounded-xl
    bg-[#EEF4FF]
    flex
    items-center
    justify-center
  ">
              <Calendar className="w-6 h-6 text-[#032B7A]" />
            </div>

            <div>
              <h1 className="text-[18px] font-semibold text-[#111827]">
                Schedule Advanced Session
              </h1>

              <p className="text-sm text-[#6B7280]">
                Set up complex recurring meetings
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="
    w-[915px]
    h-[795px]
    grid
    grid-cols-2
    gap-6
    overflow-hidden
  ">
          {/* LEFT SECTION */}
          <div className="
    flex
    flex-col
    overflow-hidden
  ">
            {/* Meeting Title */}
            <div className="space-y-2">
              <label
                className="
    text-[14px]
    font-semibold
    uppercase
    tracking-[2px]
    text-[#64748B]
  "
              >
                Meeting Title
              </label>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Sync"
                className="
                  h-[56px]
                  rounded-[14px]
                  border-[#E5E7EB]
                  bg-[#F7F9FC]
                "
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Design Sync"
                className="
                  w-full
                  h-[135px]
                  rounded-[14px]
                  border
                  border-[#E5E7EB]
                  bg-[#F7F9FC]
                  p-4
                  resize-none
                  outline-none
                "
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                Start Time
              </label>

              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="
                    h-[56px]
                    rounded-[14px]
                    border-[#E5E7EB]
                    bg-[#F7F9FC]
                  "
                />

                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              </div>
            </div>

            {/* All Day */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allDay}
                onChange={() => setAllDay(!allDay)}
                className="w-5 h-5 rounded"
              />

              <span className="text-[#64748B] text-[15px]">
                All Day
              </span>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                  Start Time
                </label>

                <Input
                  type="time"
                  value={startTime}
                  disabled={allDay}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="
                    h-[56px]
                    rounded-[14px]
                    border-[#E5E7EB]
                    bg-[#F7F9FC]
                  "
                />
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                  End Time
                </label>

                <Input
                  type="time"
                  value={endTime}
                  disabled={allDay}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="
                    h-[56px]
                    rounded-[14px]
                    border-[#E5E7EB]
                    bg-[#F7F9FC]
                  "
                />
              </div>
            </div>

            {/* Recurrence */}
            <div className="space-y-2">
              <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                Recurrence
              </label>

              <button
                className="
                  h-[60px]
                  w-full
                  rounded-[14px]
                  border
                  border-[#E5E7EB]
                  bg-[#F7F9FC]
                  px-4
                  flex
                  items-center
                  justify-between
                "
              >
                <span>Every Weekday (Mon-Fri)</span>
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Repeat Days */}
            <div className="space-y-4">
              <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                Repeat On Days
              </label>

              <div className="flex gap-3">
                {WEEKDAYS.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDay(index)}
                    className={`
                      w-[52px]
                      h-[52px]
                      rounded-[14px]
                      border
                      font-medium
                      transition-all
                      ${selectedDays.includes(index)
                        ? "bg-[#032B7A] text-white border-[#032B7A]"
                        : "bg-white border-[#E5E7EB] text-[#64748B]"
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* End Recurrence */}
            <div className="space-y-3">
              <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                End Recurrence After
              </label>

              <div className="flex items-center gap-4">
                <Input
                  value="10"
                  className="
                    w-[100px]
                    h-[48px]
                    rounded-[14px]
                    bg-[#F7F9FC]
                  "
                />

                <button
                  className="
                    h-[48px]
                    px-5
                    rounded-[14px]
                    border
                    border-[#E5E7EB]
                    bg-[#F7F9FC]
                    flex
                    items-center
                    gap-2
                  "
                >
                  Weeks
                  <ChevronDown size={16} />
                </button>

                <span className="text-[#64748B]">
                  occurrences
                </span>
              </div>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                <span className="text-[#64748B]">Never</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="
                  w-[208px]
                  h-[54px]
                  rounded-[14px]
                  border-[#DDE3EC]
                  bg-white
                "
              >
                Cancel
              </Button>

              <Button
                onClick={handleSchedule}
                disabled={loading}
                className="
                  w-[208px]
                  h-[54px]
                  rounded-[14px]
                  bg-[#032B7A]
                  hover:bg-[#02245F]
                "
              >
                {loading ? "Scheduling..." : "Schedule Now"}
              </Button>
            </div>

            {meetingLink && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                {meetingLink}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col h-full">
            <div className="space-y-2 mb-4">
              <label className="text-[14px] font-semibold uppercase tracking-[2px] text-[#64748B]">
                Add People To Invite
              </label>
              <p className="text-sm text-[#032B7A] font-semibold">
                Selected: {
                  participants.filter(
                    (p) => p.selected
                  ).length
                }
              </p>

              <Input
                placeholder="Drop the mail id or search for member"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  h-[56px]
                  rounded-[14px]
                  border-[#E5E7EB]
                  bg-[#F7F9FC]
                "
              />
            </div>

            <div
              className="
                flex-1
                overflow-y-auto
                rounded-[14px]
                border
                border-[#EEF2F7]
                bg-white
              "
            >
              {filteredParticipants.map((p) => (
                <div
                  key={p.id}
                  onClick={() => toggleParticipant(p.id)}
                  className={`
    flex
    items-center
    justify-between
    px-4
    py-3
    cursor-pointer
    transition-all
    duration-200
    border-b
    border-[#EEF2F7]
${p.selected
                      ? `
      bg-gradient-to-r
      from-[#032B7A]
      to-[#0A4BB3]
      text-white
      border-l-[6px]
      border-l-green-500
      shadow-xl
      scale-[1.01]
    `
                      : `
      bg-white
      hover:bg-[#F8FAFC]
    `
                    }
  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          p.avatar_url ||
                          `https://ui-avatars.com/api/?name=${p.name}`
                        }
                        alt={p.name}
                        className={`
        w-10
        h-10
        rounded-full
        object-cover
        border-2
        ${p.selected
                            ? "border-green-400"
                            : "border-gray-200"
                          }
      `}
                      />

                      <div>
                        <p
                          className={`font-semibold ${p.selected
                            ? "text-white"
                            : "text-[#111827]"
                            }`}
                        >
                          {p.name}
                        </p>

                        <p
                          className={`text-sm ${p.selected
                            ? "text-blue-100"
                            : "text-[#6B7280]"
                            }`}
                        >
                          {p.email}
                        </p>
                      </div>
                    </div>

                    {p.selected && (
                      <div
                        className="
        w-8
        h-8
        rounded-full
        bg-green-500
        flex
        items-center
        justify-center
        text-white
        font-bold
        shadow-lg
      "
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </div>

              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
}