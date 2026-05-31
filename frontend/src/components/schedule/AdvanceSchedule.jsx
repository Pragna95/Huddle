import { useState } from "react"

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

export default function AdvanceSchedule({ open, setOpen }) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")

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

                </div>

              </div>

              {/* ✅ ALL DAY CHECKBOX */}

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
                  Schedule Now
                </Button>

              </div>

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
                    mb-2
                    block
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
                border-b
              border-gray-100
                  
                 
              

                  

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