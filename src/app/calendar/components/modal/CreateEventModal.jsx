"use client"

import React, { useState } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parseISO, addHours } from "date-fns";
import { cn } from "@/lib/utils"
import {
  CalendarIcon,
  MapPin,
  ChevronDown,
  X,
  User2,
  BellRingIcon,
  Settings,
  TimerIcon,
} from "lucide-react"
import { timezoneOptions } from "@/utils/dateFormat"
import { useCreateEventMutation, useGetEventQuery, useUpdateEventMutation } from "@/redux/service/api/eventApiSlice"
import { calendarColors } from "@/utils/CalendarColors"
import moment from "moment-timezone";
import { GoogleMeetIcon } from "@/public/logos/GoogleMeetIcon"

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

const eventTypeOptions = [
  { value: "birthday", label: "Birthday" },
  { value: "default", label: "Default" },
  { value: "focusTime", label: "Focus Time" },
  { value: "outOfOffice", label: "Out of Office" },
  { value: "workingLocation", label: "Working Location" },
];


const reminderMethods = [
  { value: "email", label: "Email" },
  { value: "popup", label: "Notification" },
]

const CreateEventModal = ({
  isOpen,
  isEditMode,
  eventId,
  onOpenChange,
  selectedRange,
}) => {
  const { data: eventData } = useGetEventQuery(eventId, { skip: !isEditMode });
  console.log(eventData, "eventData");
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formatDateTimeValues = (selectedRange) => {
    let startDate = "";
    let endDate = "";
    let startTime = "";
    let endTime = "";
    let timeZone = "";
    let allDay = true;

    const now = new Date();

    if (!selectedRange || (!selectedRange.start && !selectedRange.end)) {
      startDate = format(now, "yyyy-MM-dd");
      endDate = format(now, "yyyy-MM-dd");
      startTime = format(now, "HH:mm");
      endTime = format(addHours(now, 1), "HH:mm");
      timeZone = moment.tz.guess();
      allDay = false;
    } else if (
      selectedRange.start?.includes("T") &&
      selectedRange.end?.includes("T")
    ) {
      const start = parseISO(selectedRange.start);
      const end = parseISO(selectedRange.end);
      startDate = format(start, "yyyy-MM-dd");
      endDate = format(end, "yyyy-MM-dd");
      startTime = format(start, "HH:mm");
      endTime = format(end, "HH:mm");
      timeZone = format(start, "xxx");
      allDay = false;
    } else {
      startDate = selectedRange.start;
      endDate = selectedRange.end;
      timeZone = "";
      allDay = true;
    }

    return {
      startDate,
      endDate,
      startTime,
      endTime,
      timeZone,
      allDay,
    };
  };

  const {
    startDate,
    endDate,
    startTime,
    endTime,
    timeZone,
    allDay,
  } = formatDateTimeValues(selectedRange);
  const initialData = {
    reqParams: {
      calendarId: "primary",
      conferenceDataVersion: 0,
      maxAttendees: 20,
      sendNotifications: true,
      sendUpdates: "all",
      supportsAttachments: false,
    },
    summary: "",
    location: "",
    startDate,
    endDate,
    startTime,
    endTime,
    timeZone,
    allDay,
    isMeeting: false,
    description: "",
    visibility: "default",
    eventType: "default",
    colorId: "1",
    reminders: {
      useDefault: true,
      overrides: [],
    },
    guestsCanModify: false,
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
    sequence: 0,
    attendees: [

    ],
  };
  const validationSchema = Yup.object({

  });

  const handleFormSubmit = async (values) => {
    console.log(values);
    const eventData = values;
    try {
      if (!isEditMode) {
        await createEvent({ eventData }).unwrap();
      } else {
        await updateEvent(values).unwrap();
      }
    } catch (error) {
      console.log(error)
    }
  };
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} className="border-0">
      <DrawerContent className="h-[99%] bg-gray-50 p-0 m-0">
        <Formik
          initialValues={eventData || initialData}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form className="h-full flex flex-col ">
              <div className="w-[100%] h-full flex ">
                {/* EVENT SECTION */}
                <div className="w-[60%] h-[100%] border-r flex flex-col">
                  <DrawerHeader className="py-0 w-[100%] flex flex-row mt-2 ">
                    <h2 className="text-xl font-semibold mr-auto text-[#1e1e1e]">Event Details</h2>
                    <Button
                      type="submit"
                      className="px-6 py-2 rounded-full font-medium text-[14px] text-white bg-[#0b57d0] hover:bg-[#0a47b0]"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </DrawerHeader>
                  <div className="p-4 flex flex-col gap-3 h-fit  flex-shrink-0">
                    <Field name="summary">
                      {({ field, meta }) => (
                        <div>
                          <Input
                            {...field}
                            placeholder="Title"
                            className="my-custom-input text-2xl h-fit"
                          />
                        </div>
                      )}
                    </Field>

                  </div>
                  <div className="px-4 pb-4 overflow-y-scroll  flex flex-col  gap-3 h-[calc(100vh-27vh)] custom-scrollbar  flex-shrink-0">
                    <div className="flex px-2 gap-3 items-start ">
                      <TimerIcon className="w-5 h-5 text-gray-500 mt-3" />
                      <div>
                        <div className=" flex  gap-3 h-fit flex-shrink-0">
                          <Field name="startDate">
                            {({ field, meta }) => (
                              <div>
                                <Input
                                  type={"date"}
                                  {...field}
                                  placeholder="start date"
                                  className="custom-input text-2xl"
                                />
                              </div>
                            )}
                          </Field>
                          {!formik.values.allDay ? (
                            <Field name="startTime">
                              {({ field, meta }) => (
                                <div>
                                  <Input
                                    type={"time"}
                                    {...field}
                                    placeholder="start time"
                                    className="custom-input text-2xl"
                                  />
                                </div>
                              )}
                            </Field>) : <></>
                          }

                          <Field name="endDate">
                            {({ field, meta }) => (
                              <div>
                                <Input
                                  type={"date"}
                                  {...field}
                                  placeholder="end date"
                                  className="custom-input text-2xl"
                                />
                              </div>
                            )}
                          </Field>
                          {!formik.values.allDay ? (

                            <Field name="endTime">
                              {({ field, meta }) => (
                                <div>
                                  <Input
                                    type={"time"}
                                    {...field}
                                    placeholder="end time"
                                    className="custom-input text-2xl"
                                  />
                                </div>
                              )}
                            </Field>) : <></>
                          }
                        </div>
                        <div className="pt-4  flex  gap-3 h-fit flex-shrink-0">
                          <Field name="allDay">
                            {({ field, form }) => (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="checkbox"
                                  id="allDay"
                                  checked={field.value}
                                  onChange={() => form.setFieldValue("allDay", !field.value)}
                                  className="w-4 h-4"
                                />
                                <label htmlFor="allDay" className="text-sm">All day</label>
                              </div>
                            )}
                          </Field>
                          <Field name="timeZone" as="select" className="custom-scrollbar min-w-[300px] outline-none  text-sm custom-input">
                            {timezoneOptions?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 gap-3 items-center ">
                      <CalendarIcon className="w-5 h-5 text-gray-500" />
                      <Field name="colorId">
                        {({ field }) => (
                          <Popover
                            open={showColorPicker}
                            onOpenChange={setShowColorPicker}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-7 custom-input px-2 flex items-center w-fit gap-1.5 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-md"
                              >
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor:
                                      calendarColors[field.value]?.background ||
                                      "#a4bdfc",
                                  }}
                                />
                                <span className="text-sm mx-2 text-gray-600">color</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                              <div className="grid grid-cols-6 gap-1.5">
                                {Object.entries(calendarColors)?.map(([id, color]) => (
                                  <div
                                    key={id}
                                    className={cn(
                                      "w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform",
                                      field.value === id && "ring-2 ring-blue-500 ring-offset-1"
                                    )}
                                    style={{ backgroundColor: color.background }}
                                    onClick={() => {
                                      formik.setFieldValue("colorId", id);
                                      setShowColorPicker(false);
                                    }}
                                  >
                                    {field.value === id && (
                                      <div className="flex items-center justify-center w-full h-full">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </Field>
                      <Field name="isMeeting">
                        {({ field }) => (
                          <div className="flex items-center space">
                            {field.value ? (
                              <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-md">
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <GoogleMeetIcon />
                                </div>
                                <span className="text-green-700 text-sm font-semibold">
                                  Meeting Added
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => formik.setFieldValue("isMeeting", false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="flex items-center space-x-2 p-2 cursor-pointer rounded-2xl"
                                onClick={() => formik.setFieldValue("isMeeting", true)}
                              >
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <GoogleMeetIcon />
                                </div>
                                <span className="text-gray-600 hover:text-blue-700 text-sm font-medium ">
                                  Add Google Meet video conferencing
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                    <Field name="location">
                      {({ field }) => (
                        <div className="flex items-center space-x-2 px-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <Input
                            {...field}
                            placeholder="Add location"
                            className="flex-1 custom-input"
                          />
                        </div>
                      )}
                    </Field>
                    <FieldArray name="reminders.overrides">
                      {({ push, remove }) => (
                        <div className="space-y-2 flex items-start">
                          <div className="flex items-center mt-2 space-x-2 px-2">
                            <BellRingIcon className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex flex-col space-y-2 items-start">
                            {formik.values.reminders.overrides?.map((reminder, index) => (
                              <div key={index} className="flex items-center gap-[10px]">
                                <Select
                                  value={reminder.method}
                                  onValueChange={(value) =>
                                    formik.setFieldValue(`reminders.overrides.${index}.method`, value)
                                  }
                                >
                                  <SelectTrigger className="w-[150px] custom-input">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {reminderMethods?.map((method) => (
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
                                      `reminders.overrides.${index}.minutes`,
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="w-[95px] custom-input"
                                  placeholder="Minutes"
                                />

                                <span className="text-sm">Minutes before</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => remove(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto hover:no-underline  bg-blue-50 text-blue-600 rounded-2xl "
                              onClick={() => push({ method: "email", minutes: 30 })}
                            >
                              Add notification
                            </Button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                    <div className="flex items-center space-x-2 px-2">
                      <Settings className="w-5 h-5 text-gray-500" />
                      <div className="flex  gap-3">
                        <Field name="eventType">
                          {({ field, form }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => form.setFieldValue(field.name, value)}
                            >
                              <SelectTrigger className="w-[200px] custom-input">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {eventTypeOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <Field name="visibility">
                          {({ field, form }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => form.setFieldValue(field.name, value)}
                            >
                              <SelectTrigger className="w-[200px] custom-input">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {visibilityOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                      </div>

                    </div>
                    <Field name="description">
                      {({ field, meta }) => (
                        <div>
                          <textarea
                            {...field}
                            placeholder="Description"
                            className="custom-input text-base min-h-[150px] outline-none w-full  overflow-y-auto"
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
                {/* GUEST SECTION */}
                <div className="w-[40%] p-[.7rem] h-full flex flex-col gap-[10px]">
                  <div className=" p-1 flex flex-col gap-3">
                    <h3 className="text-sm font-medium">Guest permissions</h3>

                    <div className=" flex  gap-3 h-fit flex-shrink-0"><Field name="reqParams.maxAttendees">
                      {({ field, form }) => (
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            form.setFieldValue(
                              field.name,
                              Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                            )
                          }
                          className="w-[150px] custom-input"
                          placeholder="Max Attendees"
                        />
                      )}
                    </Field>
                      <Field name="reqParams.sendUpdates">
                        {({ field, form }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => form.setFieldValue(field.name, value)}
                          >
                            <SelectTrigger className="w-[150px] custom-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sendUpdatesOptions?.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <Field name="reqParams.sendNotifications">
                        {({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="reqParams.sendNotifications"
                              {...field}
                              checked={field.value}
                              className="w-4 h-4"
                            />
                            <label htmlFor="reqParams.sendNotifications" className="text-sm">
                              Send notifications
                            </label>
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex p-1 gap-3 h-fit flex-shrink-0">
                      <Field name="guestsCanModify">
                        {({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="guestsCanModify"
                              {...field}
                              checked={field.value}
                              className="w-4 h-4"
                            />
                            <label htmlFor="guestsCanModify" className="text-sm">
                              Modify event
                            </label>
                          </div>
                        )}
                      </Field>

                      <Field name="guestsCanInviteOthers">
                        {({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="guestsCanInviteOthers"
                              {...field}
                              checked={field.value}
                              className="w-4 h-4"
                            />
                            <label htmlFor="guestsCanInviteOthers" className="text-sm">
                              Invite others
                            </label>
                          </div>
                        )}
                      </Field>

                      <Field name="guestsCanSeeOtherGuests">
                        {({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="guestsCanSeeOtherGuests"
                              {...field}
                              checked={field.value}
                              className="w-4 h-4"
                            />
                            <label htmlFor="guestsCanSeeOtherGuests" className="text-sm">
                              See guest list
                            </label>
                          </div>
                        )}
                      </Field>
                    </div>


                  </div>
                  <div className=" p-1 flex flex-col gap-3">
                    <h3 className="text-sm font-medium ">Add Guests</h3>
                    <FieldArray name="attendees">
                      {({ push, remove, form: { values, setFieldValue } }) => {

                        const handleAddGuest = () => {
                          const email = newGuestEmail.trim();

                          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                          if (!email) return;

                          if (!isValidEmail) {
                            alert("Please enter a valid email address.");
                            return;
                          }

                          const alreadyExists = values.attendees.some(
                            (attendee) => attendee.email.toLowerCase() === email.toLowerCase()
                          );

                          if (alreadyExists) {
                            alert("This email is already added.");
                            return;
                          }

                          push({
                            email,
                            optional: false,
                            responseStatus: "needsAction",
                          });

                          setNewGuestEmail("");
                          console.log(values);
                        };


                        return (
                          <div className="space-y-4 ">
                            <div className="rounded-md ">
                              <div className="flex space-x-2">
                                <Input
                                  value={newGuestEmail}
                                  onChange={(e) => setNewGuestEmail(e.target.value)}
                                  placeholder="Enter Email"
                                  className="bg-white flex-1 custom-input"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddGuest();
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {values.attendees.length > 0 && (
                              <div className="space-y-4">

                                <div className="space-y-2  p-1   h-[calc(100vh-25vh)] overflow-y-scroll">
                                  {values.attendees?.map((attendee, index) => {
                                    const getStatusConfig = (status) => {
                                      switch (status) {
                                        case "needsAction":
                                          return {
                                            color: "bg-gray-400",
                                            tooltip: "Awaiting response"
                                          };
                                        case "accepted":
                                          return {
                                            color: "bg-green-500",
                                            tooltip: "Accepted"
                                          };
                                        case "declined":
                                          return {
                                            color: "bg-red-500",
                                            tooltip: "Declined"
                                          };
                                        case "tentative":
                                          return {
                                            color: "bg-yellow-500",
                                            tooltip: "Tentative"
                                          };
                                        default:
                                          return {
                                            color: "bg-gray-400",
                                            tooltip: "Unknown status"
                                          };
                                      }
                                    };

                                    const statusConfig = getStatusConfig(attendee.responseStatus);

                                    return (
                                      <div key={index} className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center space-x-3">
                                          <div className="relative">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                              <User2 className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div
                                              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusConfig.color}`}
                                              title={statusConfig.tooltip}
                                            />
                                          </div>

                                          <div className="flex-1">
                                            <p className="text-sm font-medium">{attendee.email}</p>

                                            <div className="flex items-center space-x-2">
                                              <p className="text-xs text-gray-500">
                                                {attendee.optional ? "Optional" : "Required"}
                                                {!attendee.optional && (
                                                  <span className="text-red-500 ml-1">*</span>
                                                )}
                                              </p>
                                              <span className="text-xs text-gray-400">• {statusConfig.tooltip}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() =>
                                              setFieldValue(`attendees.${index}.optional`, !attendee.optional)
                                            }
                                          >
                                            {attendee.optional ? "Mark as required" : "Mark as optional"}
                                          </Button>

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

                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </FieldArray>
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

export default CreateEventModal
