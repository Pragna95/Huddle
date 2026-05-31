import { useState } from "react"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  CalendarDays,
  ChevronDown,
} from "lucide-react"

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "Su"]

export default function AdvanceSchedule({ open, setOpen }) {

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

  const attendees = [
    {
      name: "John Doe",
      email: "john@example.com",
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
    },
    {
      name: "Alice Smith",
      email: "alice@example.com",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
    },
  ]

  const toggleDay = (index) => {
    setSelectedDays((prev) =>
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index]
    )
  }

  const handleScheduleMeeting = async () => {

    try {

      setLoading(true)

      const response = await fetch(
        "http://localhost:8000/schedule-meeting/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            description,
            startDate,
            startTime,
            endTime,
            allDay,
            neverEnds,
            selectedDays,
            attendees,
          }),
        }
      )

      const data = await response.json()

      console.log(data)

      setMeetingLink(data.meeting_link)

      alert("Meeting Scheduled Successfully")

    } catch (error) {

      console.error(error)

      alert("Failed to schedule meeting")

    } finally {

      setLoading(false)

    }
  }

  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent
        className="
          w-[90vw]

          sm:w-[85vw]

          md:w-[78vw]

          lg:w-[950px]

          xl:w-[1000px]

          max-h-[82vh]

          bg-[#f7f7f7]

          rounded-[28px]

          p-0

          overflow-hidden

          border-none

          shadow-2xl

          flex
          flex-col

          [&>button]:top-4
          [&>button]:right-4
          [&>button]:w-10
          [&>button]:h-10
          [&>button]:rounded-xl
          [&>button]:border
          [&>button]:border-gray-400
          [&>button]:text-gray-700
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            gap-4

            px-5
            md:px-8

            pt-6
            pb-4
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

            <CalendarDays
              className="
                w-7
                h-7
                text-[#0b2a7a]
              "
            />

          </div>

          <div>

            <h1
              className="
                text-[24px]
                md:text-[34px]

                font-bold

                text-[#0f172a]

                whitespace-nowrap
              "
            >
              Schedule Advanced Session
            </h1>

            <p
              className="
                text-[14px]
                md:text-[16px]

                text-gray-500

                mt-1
              "
            >
              Set up complex recurring meetings
            </p>

          </div>

        </div>

        {/* BODY */}

        <div
          className="
            flex-1

            overflow-y-auto

            px-5
            md:px-8

            pb-6
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

              <div className="space-y-2">

                <label
                  className="
                    text-xs
                    md:text-sm

                    tracking-[2px]

                    font-semibold

                    text-gray-500

                    uppercase
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
                    "
                  />

                  <CalendarDays
                    className="
                      absolute

                      right-4
                      top-1/2

                      -translate-y-1/2

                      text-gray-500

                      w-5
                      h-5
                    "
                  />

                </div>

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

                </div>

              </div>

              {/* ALL DAY CHECKBOX */}

              <div className="flex items-center gap-3">

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

              {/* NEVER CHECKBOX */}

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={neverEnds}
                  onChange={() => setNeverEnds(!neverEnds)}
                  className="
                    w-4
                    h-4

                    accent-[#0b2a7a]
                  "
                />

                <label className="text-sm text-gray-700">
                  Never
                </label>

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
                  onClick={() => setOpen(false)}
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
                    bg-[#0b2a7a]
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

                <label
                  className="
                    text-xs
                    md:text-sm

                    tracking-[2px]

                    font-semibold

                    text-gray-500

                    uppercase
                  "
                >
                  Add People To Invite
                </label>

                <Input
                  placeholder="Drop mail or search member"
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

              </div>

              {/* ATTENDEE LIST */}

              <div
                className="
                  border
                  border-gray-200

                  rounded-2xl

                  overflow-hidden

                  bg-white
                "
              >

                {attendees.map((attendee, index) => (

                  <div
                    key={index}
                    className="
                      flex
                      items-center

                      gap-3

                      px-4
                      py-3

                      border-b
                      border-gray-100
                    "
                  >

                    <img
                      src="https://i.pravatar.cc/100"
                      alt=""
                      className="
                        w-10
                        h-10

                        rounded-full
                      "
                    />

                    <div>

                      <h3
                        className="
                          text-base

                          font-semibold

                          text-gray-800
                        "
                      >
                        {attendee.name}
                      </h3>

                      <p
                        className="
                          text-gray-500

                          text-xs
                        "
                      >
                        {attendee.email}
                      </p>

                    </div>

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