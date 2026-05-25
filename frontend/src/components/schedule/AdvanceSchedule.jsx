import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Clock,
  Repeat,
  Globe,
  Bell,
  Video,
  Users,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function AdvanceSchedule({ open, setOpen }) {
  const [openSchedule, setOpenSchedule] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [timezone, setTimezone] = useState("(GMT+05:30) India Standard Time - Asia/Kolkata")
  const [frequency, setFrequency] = useState("weekly")
  const [selectedDays, setSelectedDays] = useState([1, 3, 5])
  const [interval, setInterval] = useState(1)
  const [endRepeat, setEndRepeat] = useState("never")
  const [reminders, setReminders] = useState([{ time: 30, unit: "minutes" }])
  const [attendees, setAttendees] = useState([{ name: "", email: "" }])
  const [meetLink, setMeetLink] = useState("")

  const toggleDay = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    )
  }

  const addReminder = () => {
    setReminders([...reminders, { time: 15, unit: "minutes" }])
  }

  const removeReminder = (index) => {
    setReminders(reminders.filter((_, i) => i !== index))
  }

  const addAttendee = () => {
    setAttendees([...attendees, { name: "", email: "" }])
  }

  const removeAttendee = (index) => {
    setAttendees(attendees.filter((_, i) => i !== index))
  }

  const updateAttendee = (index, field, value) => {
    const updated = [...attendees]
    updated[index][field] = value
    setAttendees(updated)
  }
  const [scheduledMeetings, setScheduledMeetings] = useState([])

  const generateMeetingLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10)
    return `https://meet.yourapp.com/${randomId}`
  }
  const submitMeeting = async () => {
    if (!title || !startDate || !startTime) {
      alert("Please fill required fields")
      return
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/meetings/create/",
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
            timezone,
            attendees,
          }),
        }
      )

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        console.log(data)

        setMeetLink(data.meeting_link)
      
        alert("Meeting Created Successfully")


        // optional: close dialog after success
        // setOpen(false)
      }
    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
  className="
    max-w-[1400px]
    w-[98vw]
    h-[95vh]
    p-0
    bg-white
    rounded-2xl
    overflow-hidden
    shadow-2xl
    border-0
    flex flex-col

    [&>button]:top-5
    [&>button]:right-6
    [&>button]:h-10
    [&>button]:w-10
    [&>button]:rounded-xl
    [&>button]:bg-indigo-50
    [&>button]:border
    [&>button]:border-indigo-100
    [&>button]:text-indigo-600
    [&>button]:shadow-sm
    [&>button:hover]:bg-indigo-100
    [&>button:hover]:scale-105
  "
>
        {/* ===== HEADER ===== */}
        <div className="border-b border-gray-200 px-8 py-5 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <CalendarDays className="text-indigo-600 size-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight text-gray-900">
                Schedule Advanced Session
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Set up complex recurring meetings
              </p>
            </div>
          </div>

         
        </div>

        {/* ===== BODY ===== */}
        <div className="grid grid-cols-[1fr_1fr] divide-x divide-gray-200 overflow-y-auto flex-1">
          {/* ---------- LEFT COLUMN ---------- */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Session Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter session title"
                className="h-11 rounded-xl border-gray-300 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add session description..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none placeholder:text-gray-400"
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 rounded-xl border-gray-300 w-full sm:w-auto"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-11 rounded-xl border-gray-300 flex-1 sm:w-auto"
                  />
                  <span className="text-gray-400 font-medium shrink-0">to</span>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-11 rounded-xl border-gray-300 flex-1 sm:w-auto"
                  />
                </div>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Timezone</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm appearance-none cursor-pointer focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="(GMT+05:30) India Standard Time - Asia/Kolkata">
                    (GMT+05:30) India Standard Time - Asia/Kolkata
                  </option>
                  <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                  <option value="(GMT-05:00) Eastern Time - US/Canada">
                    (GMT-05:00) Eastern Time - US/Canada
                  </option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Recurrence */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Repeat className="size-4 text-gray-400" />
                Recurrence
              </label>
              <div className="flex gap-2">
                {["daily", "weekly", "monthly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${frequency === freq
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>

              {frequency === "weekly" && (
                <div className="flex gap-1.5 flex-wrap">
                  {WEEKDAYS.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(i)}
                      className={`w-10 h-10 rounded-xl text-xs font-semibold transition-colors ${selectedDays.includes(i)
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Every</span>
                <Input
                  type="number"
                  min={1}
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-20 h-10 rounded-xl text-center border-gray-300"
                />
                <span className="text-sm text-gray-500">
                  {frequency === "daily" ? "day(s)" : frequency === "weekly" ? "week(s)" : "month(s)"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">End repeat:</span>
                <select
                  value={endRepeat}
                  onChange={(e) => setEndRepeat(e.target.value)}
                  className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm appearance-none cursor-pointer focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="never">Never</option>
                  <option value="after">After occurrences</option>
                  <option value="on">On date</option>
                </select>
              </div>
            </div>

            {/* Video Conferencing */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Video className="size-4 text-gray-400" />
                Video Conferencing
              </label>
              <Input
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder="Paste meeting link or leave empty for auto-generate"
                className="h-11 rounded-xl border-gray-300 placeholder:text-gray-400"
              />
              {meetLink && (
                <p className="text-green-600 text-sm mt-2">
                  Generated Link: {meetLink}
                </p>
              )}
            </div>
          </div>

          {/* ---------- RIGHT COLUMN ---------- */}
          <div className="p-8 space-y-6 bg-gray-50/30">
            {/* Reminders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Bell className="size-4 text-gray-400" />
                  Reminders
                </label>
                <button
                  onClick={addReminder}
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={reminder.time}
                      onChange={(e) => {
                        const updated = [...reminders]
                        updated[index].time = Number(e.target.value)
                        setReminders(updated)
                      }}
                      className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm appearance-none cursor-pointer focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={60}>60</option>
                    </select>
                    <select
                      value={reminder.unit}
                      onChange={(e) => {
                        const updated = [...reminders]
                        updated[index].unit = e.target.value
                        setReminders(updated)
                      }}
                      className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm appearance-none cursor-pointer focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value="minutes">minutes before</option>
                      <option value="hours">hours before</option>
                      <option value="days">days before</option>
                    </select>
                    <button
                      onClick={() => removeReminder(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendees */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="size-4 text-gray-400" />
                  Attendees
                </label>
                <button
                  onClick={addAttendee}
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={attendee.name}
                      onChange={(e) => updateAttendee(index, "name", e.target.value)}
                      placeholder="Name"
                      className="flex-1 h-10 rounded-xl border-gray-300 text-sm placeholder:text-gray-400"
                    />
                    <Input
                      value={attendee.email}
                      onChange={(e) => updateAttendee(index, "email", e.target.value)}
                      placeholder="Email"
                      className="flex-1 h-10 rounded-xl border-gray-300 text-sm placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => removeAttendee(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="size-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Badge */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Summary</label>
              <div className="flex flex-wrap gap-2">
                {title && (
                  <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border-0">
                    {title}
                  </Badge>
                )}
                {startDate && (
                  <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border-0">
                    {startDate}
                  </Badge>
                )}
                {startTime && (
                  <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border-0">
                    <Clock className="size-3 mr-1 inline" />
                    {startTime} - {endTime}
                  </Badge>
                )}
                {frequency && (
                  <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 border-0">
                    <Repeat className="size-3 mr-1 inline" />
                    {frequency}
                  </Badge>
                )}
                {attendees.some((a) => a.email) && (
                  <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 border-0">
                    <Users className="size-3 mr-1 inline" />
                    {attendees.filter((a) => a.email).length} attendee(s)
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="border-t border-gray-200 px-8 py-4 flex items-center justify-between bg-white shrink-0">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="size-3" />
            All times are in {timezone.split(")")[0] + ")"}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl px-6 h-11 border-gray-300 text-gray-600 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={submitMeeting}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 h-11 font-medium shadow-sm"
              disabled={!title || !startDate || !startTime}
            >
              Schedule Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 