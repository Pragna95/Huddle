import { useState } from "react"
import axios from "axios"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Calendar,
  ChevronDown,
} from "lucide-react"

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "Su"]

export default function AdvanceSchedule({ open, setOpen, onAddSession, onCancelSession }) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")

  const [meetingLink, setMeetingLink] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ NEW CHECKBOX STATES
  const [allDay, setAllDay] = useState(false)
  const [neverEnds, setNeverEnds] = useState(true)

  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4])

  const [attendeesList, setAttendeesList] = useState([
    { name: "John Doe", email: "john@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
    { name: "Alice Smith", email: "alice@example.com" },
    { name: "Charlie Brown", email: "charlie@example.com" }
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [attendeeError, setAttendeeError] = useState("");
  const [errors, setErrors] = useState({});

  const handleAddAttendee = () => {
    setAttendeeError("");
    if (!newEmail.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setAttendeeError("Please enter a valid email address");
      return;
    }

    if (attendeesList.some(a => a.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setAttendeeError("This person is already invited");
      return;
    }

    const namePart = newEmail.split("@")[0];
    const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setAttendeesList(prev => [
      ...prev,
      { name: capitalizedName, email: newEmail.trim() }
    ]);
    setNewEmail("");
  };

  const handleRemoveAttendee = (email) => {
    setAttendeesList(prev => prev.filter(a => a.email !== email));
  };

  const toggleDay = (index) => {
    setSelectedDays((prev) =>
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index]
    )
  }

  const handleScheduleMeeting = async () => {
    // Validate inputs
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Meeting title is required";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!endTime) {
      newErrors.endTime = "End time is required";
    } else if (startTime && endTime <= startTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const dataURL = import.meta.env.VITE_DATA_URL || "http://localhost:8000";

      const response = await axios.post(
        `${dataURL}/schedule-meeting/`,
        {
          title,
          description,
          startDate,
          startTime,
          endTime,
          allDay,
          neverEnds,
          selectedDays,
          attendees: attendeesList,
        }
      ).catch(err => {
        console.warn("Backend not running, proceeding with local mock schedule.");
        return {
          data: {
            success: true,
            meeting_link: `https://meet.gadigital.com/${Math.random().toString(36).substring(2, 10)}`
          }
        };
      });

      const data = response.data;
      console.log(data);

      onAddSession({
        title,
        description,
        startDate,
        startTime,
        endTime,
        participants: attendeesList.length,
      });

      setOpen(false);
      // Reset form
      setTitle("");
      setDescription("");
      setStartDate("");
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (error) {
      console.error("Scheduling failed: ", error);
      // Fallback local scheduling
      onAddSession({
        title,
        description,
        startDate,
        startTime,
        endTime,
        participants: attendeesList.length,
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent
  className="
   
    w-[981px]
    max-w-[95vw]

    h-[953.19px]
    max-h-[90vh]

    rounded-[20px]

    border
    border-gray-200
    

    pt-[32px]
    pr-[32px]
    pb-[48px]
    pl-[32px]

    gap-[32px]

    bg-[#f7f7f7]

    opacity-100

    overflow-hidden

    shadow-2xl

    flex
    flex-col

    [&>button]:top-6
    [&>button]:right-6
    [&>button]:w-[24px]
    [&>button]:h-[24px]
    [&>button]:rounded-5px]
    [&>button]:border
    [&>button]:border-gray-400
    [&>button]:text-gray-700
  "
>
        {/* HEADER */}

        <div
  className="
    w-[915px]
    h-[44px]

    flex
    items-center
    justify-space-between

    opacity-100
    rotate-0

    mx-auto
  "
>

          <div
            className="
              bg-blue-100
              p-3
              rounded-2xl
              shrink-0
            "
          >

            <Calendar
              className="
                w-[24px]
                h-[24px]

                text-[#0b2a7a]
              "
            />

          </div>

          <div
  className="
    w-fit
    h-[44px]

    opacity-100
    rotate-0
  "
>

  <h1
    className="
      text-[20px]
      w-[272.7px]
      h-[28px]

      font-bold

      text-[#0f172a]

      whitespace-nowrap

      leading-[44px]
      pl-2
      -mt-2
    "
  >
    Schedule Advanced Session
  </h1>

  <p
    className="
      text-[12px]
      w-[272.7px]
      h-[16px]

      text-gray-500

      mt-1
      pl-3
      
    "
  >
    Set up complex recurring meetings
  </p>

</div>
        </div>

        {/* BODY */}

        <div
  className="
    w-[915px]
max-w-full

h-[795.19px]

    gap-[24px]

    opacity-100
    rotate-0

    overflow-y-auto

    mx-auto

    flex
    flex-col

    px-5
    md:px-3
    pt-0
    pb-0  
    
  "
>
          <div
            className="
              grid

              grid-cols-1
              lg:grid-cols-2

              gap-8
            "
          >

            {/* LEFT SECTION */}

            <div className="space-y-5">

              {/* TITLE */}

              <div className="space-y-2 ">

                <label
                  className="
                    text-[12px]
                    md:text-sm

                    tracking-[2px]

                    font-semibold

                    text-gray-500

                    uppercase
                    mb-2
                    block
                    
                    
                    
                  "
                >
                  Meeting Title
                </label>

                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design Sync"
                  className="
                    h-12

                    rounded-xl

                    bg-[#eef2f7]

                    border
                    border-gray-200

                    text-base

                    px-4
                    
                    
                    
                  "
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.title}
                  </p>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className="space-y-2">

                <label
                  className="
                    text-xs
                    md:text-sm

                    tracking-[2px]

                    font-semibold

                    text-gray-500

                    uppercase
                    mb-2
                    block
                  "
                >
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter meeting description"
                  className="
                    w-full

                    rounded-xl

                    bg-[#eef2f7]

                    border
                    border-gray-200

                    px-4
                    py-3

                    text-base

                    resize-none

                    h-[120px]
                  "
                />

              </div>

              {/* START DATE */}

              <div className="space-y-2">
  <label
    className="
      text-xs
      md:text-sm
      tracking-[2px]
      font-semibold
      text-gray-500
      uppercase
      mb-2
      block
    "
  >
    Start Date
  </label>

  <div className="relative">
    <Input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="
        h-12
        rounded-xl
        bg-[#eef2f7]
        border
        border-gray-200
        text-base

        px-4
        pr-12
        [&::-webkit-calendar-picker-indicator]:opacity-0
        
      "
    />

    <Calendar
      className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        w-5
        h-5
        text-[#0b2a7a]
        pointer-events-none
      "
    />
  </div>
  {errors.startDate && (
    <p className="text-xs text-red-500 mt-1 font-semibold">
      {errors.startDate}
    </p>
  )}
</div>

              {/* TIME */}

              <div
                className="
                  flex

                  flex-col
                  sm:flex-row

                  gap-4
                "
              >

                <div className="flex-1 space-y-2">

                  <label
                    className="
                      text-xs
                      md:text-sm

                      tracking-[2px]

                      font-semibold

                      text-gray-500

                      uppercase
                      mb-2
                    block
                    "
                  >
                    Start Time
                  </label>

                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={allDay}
                    className="
                      h-12

                      rounded-xl

                      bg-[#eef2f7]

                      border
                      border-gray-200

                      text-base

                      px-4
                    "
                  />
                  {errors.startTime && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div className="flex-1 space-y-2">

                  <label
                    className="
                      text-xs
                      md:text-sm

                      tracking-[2px]

                      font-semibold

                      text-gray-500

                      uppercase
                      mb-2
                    block
                    "
                  >
                    End Time
                  </label>

                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={allDay}
                    className="
                      h-12

                      rounded-xl

                      bg-[#eef2f7]

                      border
                      border-gray-200

                      text-base

                      px-4
                    "
                  />
                  {errors.endTime && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {errors.endTime}
                    </p>
                  )}
                </div>

              </div>

              {/* ALL DAY CHECKBOX */}

              <div className="flex items-center gap-2 -mt-3">

                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={() => setAllDay(!allDay)}
                  className="
                   
                    w-4
                    h-4

                    accent-[#0b2a7a]
                  "
                />

                <label className="text-sm text-gray-700">
                  All Day
                </label>

              </div>

              {/* RECURRENCE */}

              <div className="space-y-3">

                <label
                  className="
                    text-xs
                    md:text-sm

                    tracking-[2px]

                    font-semibold

                    text-gray-500

                    uppercase
                    mb-2
                    block
                  "
                >
                  Recurrence
                </label>

                <div
                  className="
                    h-12

                    rounded-xl

                    bg-[#eef2f7]

                    border
                    border-gray-200

                    px-4

                    flex
                    items-center
                    justify-between

                    text-base
                  "
                >

                  <span>
                    Every Weekday (Mon-Fri)
                  </span>

                  <ChevronDown className="w-5 h-5" />

                </div>

              </div>

              {/* DAYS */}

              <div className="space-y-3">

                <label
                  className="
                    text-xs
                    md:text-sm

                    tracking-[2px]

                    font-semibold

                    text-gray-500

                    uppercase
                    mb-2
                    block
                  "
                >
                  Repeat On Days
                </label>

                <div
                  className="
                    flex
                    gap-2
                    flex-wrap
                  "
                >

                  {WEEKDAYS.map((day, i) => (

                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`
                        w-10
                        h-10

                        rounded-xl

                        text-sm
                        font-semibold

                        transition-all

                        ${
                          selectedDays.includes(i)
                            ? "bg-[#0b2a7a] text-white"
                            : "bg-white border border-gray-300 text-gray-500"
                        }
                      `}
                    >
                      {day}
                    </button>

                  ))}

                </div>

              </div>
              {/* END RECURRENCE AFTER */}
<div className="mt-8">
  <label
    className="
      block
      text-[14px]
      font-semibold
      tracking-[2px]
      uppercase
      text-[#64748b]
      mb-2
    "
  >
    End Recurrence After
  </label>

  <div className="flex items-center gap-3">
    
    {/* Number Box */}
    <input
      type="number"
      defaultValue={10}
      className="
        w-[96px]
        h-[42px]
        rounded-[12px]
        border
        border-[#d9e0ea]
        bg-[#eef2f6]
        px-4
        text-[16px]
        text-[#0f172a]
        outline-none
      "
    />

    {/* Dropdown */}
    <select
      className="
        w-[110px]
        h-[42px]
        rounded-[12px]
        border
        border-[#d9e0ea]
        bg-[#eef2f6]
        px-3
        text-[16px]
        text-[#0f172a]
        outline-none
        cursor-pointer
      "
    >
      <option>Weeks</option>
      <option>Days</option>
      <option>Months</option>
    </select>

    {/* Text */}
    <span className="text-[16px] text-[#64748b]">
      occurrences
    </span>
  </div>

  {/* Never Checkbox */}
  <div className="flex items-center gap-2 mt-3">
    <input
      type="checkbox"
      className="w-5 h-5 rounded border-[#cbd5e1]"
    />

    <span className="text-[16px] text-[#64748b]">
      Never
    </span>
  </div>
</div>

              {/* BUTTONS */}

              <div
                className="
                  flex

                  flex-col
                  sm:flex-row

                  gap-4

                  pt-4
                "
              >

                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    onCancelSession();
                  }}
                  className="
                    h-12

                    w-full
                    sm:w-[150px]

                    rounded-xl

                    text-base

                    bg-white
                  "
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleScheduleMeeting}

                  disabled={loading}

                  className="
                    bg-[#002266]
                    hover:bg-[#09205e]

                    text-white

                    h-12

                    w-full
                    sm:w-[190px]

                    rounded-xl

                    text-base
                  "
                >
                  {
                    loading
                      ? "Scheduling..."
                      : "Schedule Now"
                  }
                </Button>

              </div>

              {
                meetingLink && (

                  <div
                    className="
                      mt-6

                      bg-green-50

                      border
                      border-green-200

                      rounded-2xl

                      p-4
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Meeting Link
                    </p>

                    <a
                      href={meetingLink}
                      target="_blank"
                      rel="noreferrer"

                      className="
                        text-[#0b2a7a]
                        font-semibold
                        break-all
                      "
                    >
                      {meetingLink}
                    </a>

                  </div>
                )
              }

            </div>

            {/* RIGHT SECTION */}

            <div className="space-y-5">

              {/* INVITE */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm tracking-[2px] font-bold text-gray-505 text-gray-500 uppercase mb-2 block">
                  Add People To Invite
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address (e.g. user@example.com)"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAttendee();
                      }
                    }}
                    className="h-12 rounded-xl bg-[#eef2f7] border border-gray-200 text-base px-4 flex-1 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all duration-200"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAttendee}
                    className="h-12 bg-[#0b2a7a] hover:bg-[#081e59] text-white px-5 rounded-xl font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    Add
                  </Button>
                </div>
                {attendeeError && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{attendeeError}</p>
                )}
              </div>

              {/* ATTENDEE LIST */}
              <div className="border border-gray-100 rounded-2xl overflow-y-auto max-h-[300px] bg-white divide-y divide-gray-100 shadow-inner">
                {attendeesList.map((attendee, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/100?u=${attendee.email}`}
                        alt=""
                        className="w-10 h-10 rounded-full border border-gray-250 border-gray-200 object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {attendee.name}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(attendee.email)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove attendee"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  )
}