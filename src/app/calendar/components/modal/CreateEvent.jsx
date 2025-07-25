"use client"

import { useState, useCallback } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parse } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  Strikethrough,
  CalendarIcon,
  MapPin,
  Bell,
  ChevronDown,
  X,
  Mail,
  User,
  Upload,
  Plus,
} from "lucide-react"
import { calendarColors, timeOptions, timezoneOptions } from "@/utils/dateFormat"

// Validation Schema
const validationSchema = Yup.object({
  summary: Yup.string().required("Title is required"),
  description: Yup.string(),
  location: Yup.string(),
  startDateTime: Yup.string().required("Start date is required"),
  endDateTime: Yup.string().required("End date is required"),
  timeZone: Yup.string().when("allDay", {
    is: false,
    then: (schema) => schema.required("Timezone is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  attendees: Yup.array().of(
    Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      optional: Yup.boolean(),
    }),
  ),
  maxAttendees: Yup.number().min(1, "Must be at least 1").nullable(),
  sendUpdates: Yup.string().oneOf(["all", "externalOnly", "none"]),
  sendNotifications: Yup.boolean(),
  meetingType: Yup.boolean(),
  attachments: Yup.array().of(
    Yup.object({
      fileUrl: Yup.string().required(),
      title: Yup.string().required(),
      mimeType: Yup.string().required(),
    }),
  ),
  colorId: Yup.string(),
  visibility: Yup.string().oneOf(["default", "public", "private", "confidential"]),
  transparency: Yup.string().oneOf(["opaque", "transparent"]),
  status: Yup.string().oneOf(["confirmed", "tentative", "cancelled"]),
  eventType: Yup.string().oneOf(["default", "focusTime", "outOfOffice", "workingLocation", "birthday"]),
  reminders: Yup.array().of(
    Yup.object({
      method: Yup.string().oneOf(["email", "popup"]).required(),
      minutes: Yup.number().min(0).required(),
    }),
  ),
  recurrence: Yup.array().of(Yup.string()),
  guestsCanInviteOthers: Yup.boolean(),
  guestsCanModify: Yup.boolean(),
  guestsCanSeeOtherGuests: Yup.boolean(),
  anyoneCanAddSelf: Yup.boolean(),
})



// Options
const repeatOptions = [
  { value: "none", label: "Does not repeat" },
  { value: "RRULE:FREQ=DAILY;COUNT=5", label: "Daily" },
  { value: "RRULE:FREQ=WEEKLY;COUNT=5", label: "Weekly" },
  { value: "RRULE:FREQ=MONTHLY;COUNT=5", label: "Monthly" },
  { value: "RRULE:FREQ=YEARLY;COUNT=5", label: "Yearly" },
]

const sendUpdatesOptions = [
  { value: "all", label: "All guests" },
  { value: "externalOnly", label: "External guests only" },
  { value: "none", label: "None" },
]

const visibilityOptions = [
  { value: "default", label: "Default visibility" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "confidential", label: "Confidential" },
]

const transparencyOptions = [
  { value: "opaque", label: "Busy" },
  { value: "transparent", label: "Free" },
]

const statusOptions = [
  { value: "confirmed", label: "Confirmed" },
  { value: "tentative", label: "Tentative" },
]

const eventTypeOptions = [
  { value: "default", label: "Default" },
  { value: "focusTime", label: "Focus Time" },
  { value: "outOfOffice", label: "Out of Office" },
  { value: "workingLocation", label: "Working Location" },
  { value: "birthday", label: "Birthday" },
]

const reminderMethods = [
  { value: "email", label: "Email" },
  { value: "popup", label: "Notification" },
]


const CreateEvent = ({
  isOpen,
  onOpenChange,
  selectedRange,
  selectedDate,
  initialData,
  onSubmit,
}) => {
  console.log("selectedRange:", selectedRange , "selectedDate:", selectedDate, "initialData:", initialData)
  const [activeTab, setActiveTab] = useState("event-details")
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Initialize form data
  const getInitialValues = useCallback(() => {
    let startDate = new Date()
    let endDate = new Date()
    let allDay = true

    if (selectedRange) {
      startDate = new Date(selectedRange.start)
      endDate = new Date(selectedRange.end)
      allDay = selectedRange.start !== selectedRange.end
    } else if (selectedDate) {
      startDate = new Date(selectedDate)
      endDate = new Date(selectedDate)
      allDay = false
    }

    // If we have initial data (update mode), use it
    if (initialData) {
      return {
        summary: initialData.summary || "",
        description: initialData.description || "",
        location: initialData.location || "",
        startDateTime: initialData.startDateTime || startDate.toISOString(),
        endDateTime: initialData.endDateTime || endDate.toISOString(),
        timeZone: initialData.timeZone || "Asia/Kolkata",
        attendees: initialData.attendees || [],
        maxAttendees: initialData.maxAttendees || null,
        sendUpdates: initialData.sendUpdates || "all",
        sendNotifications: initialData.sendNotifications || false,
        meetingType: initialData.meetingType || false,
        attachments: initialData.attachments || [],
        colorId: initialData.colorId || "1",
        visibility: initialData.visibility || "default",
        transparency: initialData.transparency || "opaque",
        status: initialData.status || "confirmed",
        eventType: initialData.eventType || "default",
        reminders: initialData.reminders || [],
        recurrence: initialData.recurrence || [],
        guestsCanInviteOthers: initialData.guestsCanInviteOthers ?? true,
        guestsCanModify: initialData.guestsCanModify ?? false,
        guestsCanSeeOtherGuests: initialData.guestsCanSeeOtherGuests ?? true,
        anyoneCanAddSelf: initialData.anyoneCanAddSelf ?? false,
        // Helper fields
        allDay: initialData.startDateTime ? !initialData.startDateTime.includes("T") : allDay,
        startDate: initialData.startDateTime ? new Date(initialData.startDateTime) : startDate,
        endDate: initialData.endDateTime ? new Date(initialData.endDateTime) : endDate,
        startTime: "10:00am",
        endTime: "11:30am",
        newGuestEmail: "",
      }
    }

    return {
      summary: "",
      description: "",
      location: "",
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      timeZone: "Asia/Kolkata",
      attendees: [],
      maxAttendees: null,
      sendUpdates: "all",
      sendNotifications: false,
      meetingType: false,
      attachments: [],
      colorId: "1",
      visibility: "default",
      transparency: "opaque",
      status: "confirmed",
      eventType: "default",
      reminders: [],
      recurrence: [],
      guestsCanInviteOthers: true,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: true,
      anyoneCanAddSelf: false,
      // Helper fields
      allDay,
      startDate,
      endDate,
      startTime: "10:00am",
      endTime: "11:30am",
      newGuestEmail: "",
    }
  }, [selectedRange, selectedDate, initialData])

  // Format datetime for submission
  const formatDateTime = (date, time, allDay, timeZone) => {
    if (allDay) {
      return format(date, "yyyy-MM-dd")
    }

    // Parse time and combine with date
    const [timeStr, period] = time.split(/(?=[ap]m)/i)
    const [hours, minutes] = timeStr.split(":").map(Number)
    const hour24 =
      period.toLowerCase() === "pm" && hours !== 12
        ? hours + 12
        : period.toLowerCase() === "am" && hours === 12
          ? 0
          : hours

    const dateTime = new Date(date)
    dateTime.setHours(hour24, minutes, 0, 0)

    return dateTime.toISOString()
  }

  const handleFormSubmit = async (values) => {
    // Format the data
    const formattedData = {
      ...values,
      action: "create-full-featured-event",
      calendarId: "primary",
   
      startDateTime: formatDateTime(values.startDate, values.startTime, values.allDay, values.timeZone),
      endDateTime: formatDateTime(values.endDate, values.endTime, values.allDay, values.timeZone),
    };

    // Remove helper fields
    const { startDate, endDate, startTime, endTime, newGuestEmail, ...submitData } = formattedData;

    console.log("Submitting data:", submitData);

    try {
      const res = await fetch("/api/calendar/event/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        // Optionally show toast/alert to user
        return;
      }

      const data = await res.json();
      console.log("Event created:", data);
      // Optionally show success toast / redirect user

      onOpenChange(false);
    } catch (error) {
      console.error("Request failed:", error);
      // Optionally show error toast
    }
  };


  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} className="border-0">
      <DrawerContent className="h-[95%] bg-gray-50 p-0 m-0">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form className="h-full flex flex-col ">
              <DrawerHeader className="py-0 w-[60%] flex flex-row mt-2 ">
                <h2 className="text-xl font-semibold mr-auto text-[#1e1e1e]">Event Details</h2>
                <Button
                  type="submit"
                  className="px-6 py-2 rounded-full font-medium text-[14px] text-white bg-[#0b57d0] hover:bg-[#0a47b0]"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DrawerHeader>
              <div className="w-[100%] h-full flex gap-[10px]">
                <div className="w-[60%] h-full border-r flex flex-col">
                  {/* EVENT DETAILS */}
                  <div className="p-4 flex flex-col gap-3 h-fit flex-shrink-0">
                    <Field name="summary">
                      {({ field, meta }) => (
                        <div>
                          <Input
                            {...field}
                            placeholder="Title"
                            className="my-custom-input  text-2xl"
                          />
                          {meta.touched && meta.error && <div className="text-red-500 text-[10px] absolute mt-1 "></div>}
                        </div>
                      )}
                    </Field>

                    {/* Date and Time Selection */}
                    <div className="flex items-center justify-start gap-[10px]">
                      <div className="relative flex justify-center">
                        <Input
                          value={format(formik.values.startDate, "d MMM yyyy")}
                          onChange={(e) => {
                            try {
                              const parsedDate = parse(e.target.value, "d MMM yyyy", new Date())
                              if (!isNaN(parsedDate.getTime())) {
                                formik.setFieldValue("startDate", parsedDate)
                              }
                            } catch (error) {

                            }
                          }}
                          className="w-[140px] custom-input"
                          placeholder="Start date"
                        />
                        <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute  right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formik.values.startDate}
                              onSelect={(date) => {
                                if (date) {
                                  formik.setFieldValue("startDate", date)
                                  setShowStartDatePicker(false)
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {!formik.values.allDay && (
                        <div className="relative">
                          <Input
                            value={formik.values.startTime}
                            onChange={(e) => formik.setFieldValue("startTime", e.target.value)}
                            className="w-[100px] custom-input"
                            placeholder="Start time"
                          />
                          <Popover open={showStartTimePicker} onOpenChange={setShowStartTimePicker}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <div className="max-h-[300px] overflow-auto p-1">
                                {timeOptions.map((time) => (
                                  <div
                                    key={time}
                                    className={cn(
                                      "px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted",
                                      time === formik.values.startTime && "bg-muted",
                                    )}
                                    onClick={() => {
                                      formik.setFieldValue("startTime", time)
                                      setShowStartTimePicker(false)
                                    }}
                                  >
                                    {time}
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                      <p className="font-normal text-[13px]">to</p>

                      <div className="relative">
                        <Input
                          value={format(formik.values.endDate, "d MMM yyyy")}
                          onChange={(e) => {
                            try {
                              const parsedDate = parse(e.target.value, "d MMM yyyy", new Date())
                              if (!isNaN(parsedDate.getTime())) {
                                formik.setFieldValue("endDate", parsedDate)
                              }
                            } catch (error) {
                            }
                          }}
                          className="w-[140px] custom-input"
                          placeholder="End date"
                        />
                        <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formik.values.endDate}
                              onSelect={(date) => {
                                if (date) {
                                  formik.setFieldValue("endDate", date)
                                  setShowEndDatePicker(false)
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {!formik.values.allDay && (
                        <div className="relative">
                          <Input
                            value={formik.values.endTime}
                            onChange={(e) => formik.setFieldValue("endTime", e.target.value)}
                            className="w-[100px] custom-input"
                            placeholder="End time"
                          />
                          <Popover open={showEndTimePicker} onOpenChange={setShowEndTimePicker}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <div className="max-h-[300px] overflow-auto p-1">
                                {timeOptions.map((time) => (
                                  <div
                                    key={time}
                                    className={cn(
                                      "px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted",
                                      time === formik.values.endTime && "bg-muted",
                                    )}
                                    onClick={() => {
                                      formik.setFieldValue("endTime", time)
                                      setShowEndTimePicker(false)
                                    }}
                                  >
                                    {time}
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                    </div>

                    {/* All day and Repeat options */}
                    <div className="flex items-center justify-start gap-[20px] ">
                      <div className="flex items-center space-x-2 ">
                        <Field name="allDay">
                          {({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="all-day"
                                checked={field.value}
                                onCheckedChange={(checked) => formik.setFieldValue("allDay", !!checked)}
                                className="h-4 w-4 border-gray-500 border-[1.5px] rounded-[2px]"
                              />
                              <label htmlFor="all-day" className="text-sm font-medium">
                                All day
                              </label>
                            </div>
                          )}
                        </Field>
                      </div>
                      <Field name="recurrence" >
                        {({ field }) => (
                          <Select
                            value={field.value[0] || "none"}
                            onValueChange={(value) =>
                              formik.setFieldValue("recurrence", value === "none" ? [] : [value])
                            }
                          >
                            <SelectTrigger className="w-fit custom-input ">
                              <SelectValue placeholder="Does not repeat" />
                            </SelectTrigger>
                            <SelectContent>
                              {repeatOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      {!formik.values.allDay && (
                        <Field name="timeZone">
                          {({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => formik.setFieldValue("timeZone", value)}
                            >
                              <SelectTrigger className="w-fit custom-select ">
                                <SelectValue placeholder="Time zone" />
                              </SelectTrigger>
                              <SelectContent>
                                {timezoneOptions.map((tz) => (
                                  <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                              <p className="text-sm font-semibold text-[#0b57d0]">Time zone</p>
                            </Select>
                          )}
                        </Field>
                      )}

                    </div>
                  </div>
                  {/* EVENT BODY */}
                  <div className="px-4 space-y-4  flex-grow ">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[100%] h-[100%]">
                      <div className=" h-fit flex-shrink-0 ">
                        <TabsList className="flex gap-2 items-center justify-start w-full  p-0 bg-transparent border-b-2 rounded-none shadow-none">
                          <TabsTrigger value="event-details"
                            className="max-w-fit data-[state=active]:bg-transparent  data-[state=active]:shadow-none data-[state=active]:border-b-[#0b57d0] border-b-2  data-[state=active]:text-[#0b57d0] m-0 rounded-none shadow-none"
                          >Event details</TabsTrigger>
                          <TabsTrigger value="guests" className="max-w-fit data-[state=active]:bg-transparent  data-[state=active]:shadow-none data-[state=active]:border-b-[#0b57d0] border-b-2  data-[state=active]:text-[#0b57d0] m-0 rounded-none shadow-none"
                          >Guests</TabsTrigger>
                        </TabsList>
                      </div>

                      <div className=" h-[320px] overflow-y-auto custom-scrollbar ">
                        <TabsContent value="event-details" className="space-y-4 pt-4">
                          {/* Google Meet */}
                          <Field name="meetingType">
                            {({ field }) => (
                              <div className="flex items-center space">
                                {field.value ? (
                                  <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-md">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 48 48"
                                      >
                                        <rect
                                          width="16"
                                          height="16"
                                          x="12"
                                          y="16"
                                          fill="#fff"
                                          transform="rotate(-90 20 24)"
                                        ></rect>
                                        <polygon fill="#1e88e5" points="3,17 3,31 8,32 13,31 13,17 8,16"></polygon>
                                        <path
                                          fill="#4caf50"
                                          d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                                        ></path>
                                        <path
                                          fill="#fbc02d"
                                          d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                                        ></path>
                                        <path fill="#1565c0" d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"></path>
                                        <polygon fill="#e53935" points="13,7 13,17 3,17"></polygon>
                                        <polygon fill="#2e7d32" points="38,24 37,32.45 27,24 37,15.55"></polygon>
                                        <path
                                          fill="#4caf50"
                                          d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                                        ></path>
                                      </svg>
                                    </div>
                                    <span className="text-green-700 text-sm font-semibold">Meeting Added</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => formik.setFieldValue("meetingType", false)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div
                                    className="flex items-center space-x-2 p-2 cursor-pointer rounded-2xl"
                                    onClick={() => formik.setFieldValue("meetingType", true)}
                                  >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 48 48"
                                      >
                                        <rect
                                          width="16"
                                          height="16"
                                          x="12"
                                          y="16"
                                          fill="#fff"
                                          transform="rotate(-90 20 24)"
                                        ></rect>
                                        <polygon fill="#1e88e5" points="3,17 3,31 8,32 13,31 13,17 8,16"></polygon>
                                        <path
                                          fill="#4caf50"
                                          d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                                        ></path>
                                        <path
                                          fill="#fbc02d"
                                          d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                                        ></path>
                                        <path fill="#1565c0" d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"></path>
                                        <polygon fill="#e53935" points="13,7 13,17 3,17"></polygon>
                                        <polygon fill="#2e7d32" points="38,24 37,32.45 27,24 37,15.55"></polygon>
                                        <path
                                          fill="#4caf50"
                                          d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                                        ></path>
                                      </svg>
                                    </div>
                                    <span className="text-gray-600 hover:text-blue-700 text-sm font-medium ">Add Google Meet video conferencing</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>

                          {/* Location */}
                          <Field name="location">
                            {({ field }) => (
                              <div className="flex items-center space-x-2 px-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <Input {...field} placeholder="Add location" className="flex-1 custom-input" />
                              </div>
                            )}
                          </Field>
                          {/* Reminders */}
                          <FieldArray name="reminders">
                            {({ push, remove }) => (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Bell className="w-5 h-5 text-gray-500" />
                                  <span className="text-sm font-medium">Reminders</span>
                                </div>
                                {formik.values.reminders.map((reminder, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <Select
                                      value={reminder.method}
                                      onValueChange={(value) => formik.setFieldValue(`reminders.${index}.method`, value)}
                                    >
                                      <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {reminderMethods.map((method) => (
                                          <SelectItem key={method.value} value={method.value}>
                                            {method.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      value={reminder.minutes}
                                      onChange={(e) =>
                                        formik.setFieldValue(
                                          `reminders.${index}.minutes`,
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                      className="w-[80px]"
                                      placeholder="Minutes"
                                    />
                                    <span className="text-sm">minutes before</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(index)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-blue-600"
                                  onClick={() => push({ method: "email", minutes: 30 })}
                                >
                                  Add reminder
                                </Button>
                              </div>
                            )}
                          </FieldArray>

                          {/* Max Attendees */}
                          <Field name="maxAttendees">
                            {({ field }) => (
                              <div className="flex items-center space-x-2 px-2">
                                <User className="w-5 h-5 text-gray-500" />
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Maximum attendees"
                                  className="w-[200px] custom-input"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      "maxAttendees",
                                      e.target.value ? Number.parseInt(e.target.value) : null,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </Field>

                          {/* Send Updates */}
                          <Field name="sendUpdates">
                            {({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => formik.setFieldValue("sendUpdates", value)}
                                >
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Send updates" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sendUpdatesOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </Field>

                          {/* Send Notifications */}
                          <Field name="sendNotifications">
                            {({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="send-notifications"
                                  checked={field.value}
                                  onCheckedChange={(checked) => formik.setFieldValue("sendNotifications", !!checked)}
                                />
                                <label htmlFor="send-notifications" className="text-sm font-medium">
                                  Send notifications to attendees
                                </label>
                              </div>
                            )}
                          </Field>

                          {/* Attachments */}
                          <FieldArray name="attachments">
                            {({ push, remove }) => (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Upload className="w-5 h-5 text-gray-500" />
                                  <span className="text-sm font-medium">Attachments</span>
                                </div>
                                {formik.values.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                                    <span className="flex-1 text-sm">{attachment.title}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(index)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    push({ fileUrl: "", title: "New Attachment", mimeType: "application/pdf" })
                                  }
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Attachment
                                </Button>
                              </div>
                            )}
                          </FieldArray>



                          {/* Calendar/Color */}
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-5 h-5 text-gray-500" />
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">Calendar</span>
                              <Field name="colorId">
                                {({ field }) => (
                                  <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="h-8 px-2 flex items-center space-x-2 bg-transparent"
                                      >
                                        <div
                                          className="w-5 h-5 rounded-full"
                                          style={{
                                            backgroundColor: calendarColors[field.value]?.background || "#5484ed",
                                          }}
                                        />
                                        <span>color</span>
                                        <ChevronDown className="w-4 h-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-2">
                                      <div className="grid grid-cols-6 gap-1">
                                        {Object.entries(calendarColors).map(([id, color]) => (
                                          <div
                                            key={id}
                                            className={cn(
                                              "w-6 h-6 rounded-full cursor-pointer",
                                              field.value === id && "ring-2 ring-offset-1 ring-black",
                                            )}
                                            style={{ backgroundColor: color.background }}
                                            onClick={() => {
                                              formik.setFieldValue("colorId", id)
                                              setShowColorPicker(false)
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </Field>
                            </div>
                          </div>

                          {/* Event Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <Field name="transparency">
                                {({ field }) => (
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => formik.setFieldValue("transparency", value)}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {transparencyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </Field>

                              <Field name="visibility">
                                {({ field }) => (
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => formik.setFieldValue("visibility", value)}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {visibilityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </Field>
                            </div>

                            <div className="flex items-center space-x-4">
                              <Field name="status">
                                {({ field }) => (
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => formik.setFieldValue("status", value)}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </Field>

                              <Field name="eventType">
                                {({ field }) => (
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => formik.setFieldValue("eventType", value)}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Event Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {eventTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </Field>
                            </div>
                          </div>

                          {/* Description */}
                          <Field name="description">
                            {({ field }) => (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 border-b pb-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Bold className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Italic className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <List className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ListOrdered className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <LinkIcon className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Strikethrough className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Textarea {...field} placeholder="Add description" className="min-h-[100px]" />
                              </div>
                            )}
                          </Field>
                        </TabsContent>

                        <TabsContent value="guests" className="space-y-4 pt-4">
                          <FieldArray name="attendees">
                            {({ push, remove }) => (
                              <div className="space-y-4">
                                {/* Guest input form */}
                                <div className="bg-gray-100 rounded-md p-4">
                                  <div className="flex space-x-2">
                                    <Field name="newGuestEmail">
                                      {({ field, form }) => (
                                        <Input
                                          {...field}
                                          placeholder="Add guests"
                                          className="bg-white flex-1"
                                          onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault()
                                              const email = field.value?.trim()
                                              if (email) {
                                                push({ email, optional: false })
                                                form.setFieldValue("newGuestEmail", "")
                                              }
                                            }
                                          }}
                                        />
                                      )}
                                    </Field>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const email = formik.values.newGuestEmail?.trim()
                                        if (email) {
                                          push({ email, optional: false })
                                          formik.setFieldValue("newGuestEmail", "")
                                        }
                                      }}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </div>

                                {/* Guest list */}
                                {formik.values.attendees.length > 0 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">{formik.values.attendees.length} guests</p>
                                        <p className="text-sm text-gray-500">
                                          {formik.values.attendees.filter((g) => g.optional).length} optional
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      {formik.values.attendees.map((attendee, index) => (
                                        <div key={index} className="flex items-center justify-between py-2 border-b">
                                          <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                              <User className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="flex-1">
                                              <Field name={`attendees.${index}.email`}>
                                                {({ field, meta }) => (
                                                  <div>
                                                    <Input
                                                      {...field}
                                                      className="border-none p-0 h-auto font-medium bg-transparent focus-visible:ring-0 shadow-none"
                                                      placeholder="Enter email"
                                                    />
                                                    {meta.touched && meta.error && (
                                                      <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                                                    )}
                                                  </div>
                                                )}
                                              </Field>
                                              <Field name={`attendees.${index}.optional`}>
                                                {({ field }) => (
                                                  <p className="text-sm text-gray-500">
                                                    {field.value ? "Optional" : "Required"}
                                                    {!field.value && <span className="text-red-500 ml-1">*</span>}
                                                  </p>
                                                )}
                                              </Field>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Field name={`attendees.${index}.optional`}>
                                              {({ field }) => (
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    formik.setFieldValue(`attendees.${index}.optional`, !field.value)
                                                  }
                                                >
                                                  {field.value ? "Mark as required" : "Mark as optional"}
                                                </Button>
                                              )}
                                            </Field>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => remove(index)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </FieldArray>

                          {/* Guest permissions */}
                          <div className="space-y-4 pt-4">
                            <h3 className="text-base font-medium">Guest permissions</h3>
                            <div className="space-y-2">
                              <Field name="guestsCanModify">
                                {({ field }) => (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="modify-event"
                                      checked={field.value}
                                      onCheckedChange={(checked) => formik.setFieldValue("guestsCanModify", !!checked)}
                                    />
                                    <label htmlFor="modify-event" className="text-sm font-medium">
                                      Modify event
                                    </label>
                                  </div>
                                )}
                              </Field>

                              <Field name="guestsCanInviteOthers">
                                {({ field }) => (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="invite-others"
                                      checked={field.value}
                                      onCheckedChange={(checked) =>
                                        formik.setFieldValue("guestsCanInviteOthers", !!checked)
                                      }
                                    />
                                    <label htmlFor="invite-others" className="text-sm font-medium">
                                      Invite others
                                    </label>
                                  </div>
                                )}
                              </Field>

                              <Field name="guestsCanSeeOtherGuests">
                                {({ field }) => (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="see-guest-list"
                                      checked={field.value}
                                      onCheckedChange={(checked) =>
                                        formik.setFieldValue("guestsCanSeeOtherGuests", !!checked)
                                      }
                                    />
                                    <label htmlFor="see-guest-list" className="text-sm font-medium">
                                      See guest list
                                    </label>
                                  </div>
                                )}
                              </Field>

                              <Field name="anyoneCanAddSelf">
                                {({ field }) => (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="anyone-can-add-self"
                                      checked={field.value}
                                      onCheckedChange={(checked) => formik.setFieldValue("anyoneCanAddSelf", !!checked)}
                                    />
                                    <label htmlFor="anyone-can-add-self" className="text-sm font-medium">
                                      Anyone can add themselves
                                    </label>
                                  </div>
                                )}
                              </Field>
                            </div>
                          </div>
                        </TabsContent>
                      </div>

                    </Tabs>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateEvent
