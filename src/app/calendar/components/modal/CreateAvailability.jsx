"use client"

import React, { useState, useCallback, useRef, useMemo } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    X,
    Clock,
    Trash,
    Calendar1Icon,
} from "lucide-react"
import "@/styles/slotAvailability.css";

const SlotAvailability = ({
    isOpen,
    isEditMode,
    onOpenChange,
}) => {
    const calendarRef = useRef(null)

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const initialData = {
        "availability": [
            {
                "date": "2025-08-01",
                "slots": [
                    { "slotId": "slot-001", "start": "09:00", "end": "10:30" },
                    { "slotId": "slot-002", "start": "14:00", "end": "15:00" }
                ]
            },
            {
                "date": "2025-08-02",
                "slots": [
                    { "slotId": "slot-003", "start": "10:00", "end": "11:30" },
                    { "slotId": "slot-004", "start": "13:00", "end": "14:00" }
                ]
            },
            {
                "date": "2025-08-03",
                "slots": [
                    { "slotId": "slot-005", "start": "11:00", "end": "12:00" },
                    { "slotId": "slot-006", "start": "15:30", "end": "16:30" }
                ]
            },
            {
                "date": "2025-08-04",
                "slots": [
                    { "slotId": "slot-007", "start": "09:30", "end": "10:15" },
                    { "slotId": "slot-008", "start": "14:45", "end": "15:45" }
                ]
            },
            {
                "date": "2025-08-05",
                "slots": [
                    { "slotId": "slot-009", "start": "08:00", "end": "09:00" },
                    { "slotId": "slot-010", "start": "11:30", "end": "12:30" }
                ]
            },
            {
                "date": "2025-08-06",
                "slots": [
                    { "slotId": "slot-011", "start": "10:00", "end": "11:00" },
                    { "slotId": "slot-012", "start": "16:00", "end": "17:00" }
                ]
            },
            {
                "date": "2025-08-07",
                "slots": [
                    { "slotId": "slot-013", "start": "09:15", "end": "10:00" },
                    { "slotId": "slot-014", "start": "13:30", "end": "14:30" },
                    { "slotId": "slot-015", "start": "15:00", "end": "16:00" }
                ]
            }
        ]
    }


    const validationSchema = Yup.object({
        availability: Yup.array()
            .of(
                Yup.object({
                    date: Yup.string()
                        .required("Date is required")
                        .test('is-valid-date', 'Invalid date format', function (value) {
                            if (!value) return false;
                            const date = new Date(value);
                            return !isNaN(date.getTime());
                        })
                        .test('not-past-date', "Can't add dates in the past", function (value) {
                            if (!value) return true;
                            const inputDate = new Date(value);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return inputDate >= today;
                        }),
                    slots: Yup.array().of(
                        Yup.object({
                            start: Yup.string()
                                .required("Start time is required")
                                .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
                            end: Yup.string()
                                .required("End time is required")
                                .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
                                .test('is-after-start', 'End time must be after start time', function (value) {
                                    const { start } = this.parent;
                                    if (!start || !value) return true;
                                    return value > start;
                                })
                        })
                    ).test('no-overlaps', 'Time slots cannot overlap', function (slots) {
                        if (!slots || slots.length < 2) return true;

                        const sortedSlots = [...slots].sort((a, b) => a.start.localeCompare(b.start));

                        for (let i = 0; i < sortedSlots.length - 1; i++) {
                            const current = sortedSlots[i];
                            const next = sortedSlots[i + 1];

                            if (current.end > next.start) {
                                return this.createError({
                                    path: `availability[${this.path.split('[')[1].split(']')[0]}].slots`,
                                    message: 'Periods cannot overlap'
                                });
                            }
                        }
                        return true;
                    })
                })
            )
            .test('no-duplicate-dates', function (availability) {
                if (!availability || availability.length < 2) return true;

                const dates = availability
                    .map(item => item.date)
                    .filter(date => date && date.trim() !== '');
                for (let i = 0; i < dates.length; i++) {
                    for (let j = i + 1; j < dates.length; j++) {
                        if (dates[i] === dates[j]) {
                            let actualIndex = 0;
                            let filteredIndex = 0;

                            for (let k = 0; k < availability.length; k++) {
                                if (availability[k].date && availability[k].date.trim() !== '') {
                                    if (filteredIndex === j) {
                                        actualIndex = k;
                                        break;
                                    }
                                    filteredIndex++;
                                }
                            }

                            return this.createError({
                                path: `availability[${actualIndex}].date`,
                                message: 'Same dates are added more than once'
                            });
                        }
                    }
                }
                return true;
            })
    });

    const convertToCalendarEvents = useCallback((availability) => {
        const events = [];

        availability.forEach((dayAvailability, dayIndex) => {
            if (dayAvailability.date && dayAvailability.slots) {
                dayAvailability.slots.forEach((slot, slotIndex) => {
                    if (slot.start && slot.end) {
                        events.push({
                            id: `${dayIndex}-${slotIndex}`,
                            title: 'Available',
                            start: `${dayAvailability.date}T${slot.start}:00`,
                            end: `${dayAvailability.date}T${slot.end}:00`,
                            backgroundColor: '#10b981',
                            borderColor: '#059669',
                            textColor: '#ffffff'
                        });
                    }
                });
            }
        });

        return events;
    }, []);

    const handleFormSubmit = async (values) => {
        console.log('Form submission:', values);

        const transformedData = {
            slotGroups: [
                {
                    groupId: `group-${Date.now()}`,
                    title: "Interview Availability",
                    slots: values.availability.map(dayAvailability => ({
                        date: dayAvailability.date,
                        times: dayAvailability.slots.map((slot, index) => ({
                            slotId: `slot-${Date.now()}-${index}`,
                            start: slot.start,
                            end: slot.end
                        }))
                    }))
                }
            ]
        };

        console.log('Transformed data:', transformedData);

        try {
            // Your API call logic here
            // await createSlotAvailability(transformedData);
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving availability:', error);
        }
    };

    const toggleCalendarView = () => {
        setCalendarView(prev => prev === 'timeGridWeek' ? 'dayGridMonth' : 'timeGridWeek');
    };

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange} className="border-0 ">
            <DrawerContent className="h-[99%]  p-0 m-0 bg-[#f0f4f9]">
                <Formik
                    initialValues={initialData}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {(formik) => {
                        const calendarEvents = convertToCalendarEvents(formik.values.availability);

                        return (
                            <Form className="h-full flex flex-col ">
                                <div className="w-[100%] h-full flex ">
                                    <div className="w-[100%] h-[100%] flex">
                                        {/* Left Panel - Form */}
                                        <div className="w-fit  h-full  flex flex-col">
                                            {/* <DrawerHeader className="py-0 w-[100%] flex flex-row mt-2">
                                                <h2 className="text-xl font-semibold mr-auto text-[#1e1e1e]">
                                                    Slot Availability Schedule
                                                </h2>

                                                <Button
                                                    type="submit"
                                                    onClick={formik.handleSubmit}
                                                    className="px-6 py-2 rounded-full font-medium text-[14px] text-white bg-[#0b57d0] hover:bg-[#0a47b0]"
                                                    disabled={formik.isSubmitting}
                                                >
                                                    {formik.isSubmitting ? "Saving..." : "Save"}
                                                </Button>
                                            </DrawerHeader> */}

                                            {/* Availability Section */}
                                            <div className="flex-1 overflow-y-auto   p-3">
                                                <FieldArray name="availability">
                                                    {({ push, remove }) => (
                                                        <div className="space-y-4">
                                                            <div className="flex items-start space-x-2">
                                                                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                                                                <div>
                                                                    <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                                                                    <p className="text-xs text-gray-500">
                                                                        Set when you’re available for appointments.{" "}
                                                                        <a href="https://support.google.com/calendar/answer/10729749?hl=en-GB&visit_id=638894743605444173-2440349265&p=no_double_booking&rd=1#scheduletip" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                                                            Learn more
                                                                        </a>
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant={"outline"}
                                                                    onClick={() => push({ date: "", slots: [] })}
                                                                    className="border-black  ml-auto font-semibold bg-transparent  p-[1rem] rounded-3xl text-[#0b57d0]"
                                                                >
                                                                    Add a Date
                                                                </Button>
                                                            </div>


                                                            {formik.values.availability.length === 0 ? (
                                                                <div className="text-center py-8 flex flex-col gap-1 text-gray-500">
                                                                    <Calendar1Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                                    <p className="text-sm font-medium mb-1">No availability added yet</p>
                                                                    <p className="text-xs">Click "Add Availability" to get started</p>
                                                                </div>
                                                            ) : <div className="flex flex-col gap-3   h-[calc(100vh-20vh)] w-[100%] custom-scrollbar overflow-y-scroll">
                                                                {formik.values.availability.map((dayAvailability, dayIndex) => (
                                                                    <div key={dayIndex} className="">
                                                                        <div className="flex bg-[#f8fafd] p-2 rounded-md  items-start gap-[2rem] ">
                                                                            <div className="flex flex-col items-center space-x-2">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <Field name={`availability.${dayIndex}.date`}>
                                                                                        {({ field, meta }) => (
                                                                                            <div>
                                                                                                <Input
                                                                                                    {...field}
                                                                                                    type="date"
                                                                                                    className={`w-auto custom-input ${meta.touched && meta.error
                                                                                                        ? 'border-red-500 bg-red-50'
                                                                                                        : ''
                                                                                                        }`}
                                                                                                    min={getTodayDate()}
                                                                                                />
                                                                                                {meta.touched && meta.error && (
                                                                                                    <div className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded border border-red-200">
                                                                                                        {meta.error}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    </Field>
                                                                                </div>
                                                                            </div>
                                                                            <FieldArray name={`availability.${dayIndex}.slots`}>
                                                                                {({ push: pushSlot, remove: removeSlot }) => (
                                                                                    <div className="space-y-2 flex-grow ">
                                                                                        <div className="flex min-w-[100%]  gap-2 items-center justify-between ">
                                                                                            <span className="text-sm font-semibold text-muted-foreground">
                                                                                                Time Slots
                                                                                            </span>

                                                                                            <div className="flex items-center justify-between gap-4 rounded-md   ">
                                                                                                <Button
                                                                                                    type="button"
                                                                                                    onClick={() => pushSlot({ start: "", end: "" })}
                                                                                                    variant="outline"
                                                                                                    size="sm"
                                                                                                    className="text-sm border-none font-medium hover:bg-gray-100 transition"
                                                                                                >
                                                                                                     Add Slot
                                                                                                </Button>
                                                                                                {formik.values.availability[dayIndex].slots.length === 0 && (
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        onClick={() => remove(dayIndex)}
                                                                                                        variant="outline"
                                                                                                        size="icon"
                                                                                                        className="bg-red-500 text-white scale-90 hover:bg-red-600  aspect-square rounded-md transition w-fit"
                                                                                                        aria-label="Remove Day"
                                                                                                    >
                                                                                                        <Trash className="h-2 w-2" />
                                                                                                    </Button>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        {dayAvailability.slots.map((slot, slotIndex) => (
                                                                                            <div key={slotIndex} className="flex items-center space-x-2   rounded">
                                                                                                <Field name={`availability.${dayIndex}.slots.${slotIndex}.start`}>
                                                                                                    {({ field, meta }) => (
                                                                                                        <div>
                                                                                                            <Input
                                                                                                                {...field}
                                                                                                                type="time"
                                                                                                                className="w-auto  custom-input"
                                                                                                                placeholder="Start"
                                                                                                            />
                                                                                                            {meta.touched && meta.error && (
                                                                                                                <div className="text-red-500 text-xs mt-1">
                                                                                                                    {meta.error}
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Field>

                                                                                                <span className="text-gray-500">-</span>

                                                                                                <Field name={`availability.${dayIndex}.slots.${slotIndex}.end`}>
                                                                                                    {({ field, meta }) => (
                                                                                                        <div>
                                                                                                            <Input
                                                                                                                {...field}
                                                                                                                type="time"
                                                                                                                className="w-auto  custom-input"
                                                                                                                placeholder="End"
                                                                                                            />
                                                                                                            {meta.touched && meta.error && (
                                                                                                                <div className="text-red-500 text-xs mt-1">
                                                                                                                    {meta.error}
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Field>

                                                                                                <Button
                                                                                                    type="button"
                                                                                                    variant="ghost"
                                                                                                    size="icon"
                                                                                                    onClick={() => removeSlot(slotIndex)}
                                                                                                >
                                                                                                    <X className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        ))}

                                                                                        {/* Display overlap error */}
                                                                                        {formik.errors.availability?.[dayIndex]?.slots &&
                                                                                            typeof formik.errors.availability[dayIndex].slots === 'string' && (
                                                                                                <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                                                                                                    {formik.errors.availability[dayIndex].slots}
                                                                                                </div>
                                                                                            )}
                                                                                    </div>
                                                                                )}
                                                                            </FieldArray>
                                                                        </div>

                                                                    </div>
                                                                ))}
                                                            </div>}
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            </div>
                                        </div>

                                        {/* Right Panel - Calendar */}
                                        <div className="flex-grow h-[100%] flex flex-col enhanced-calendar-container ">
                                            <FullCalendar
                                                ref={calendarRef}
                                                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                                initialView="timeGridWeek"
                                                weekends={true}
                                                selectable={false}
                                                selectMirror={false}
                                                headerToolbar={{
                                                    right: 'prev,next today',
                                                    left: 'title',
                                                    center: ''
                                                }}
                                                height="100%"
                                                dayHeaderClassNames="custom-day-header"
                                                dayCellClassNames="custom-day-cell"
                                                eventClassNames="custom-event"
                                                scrollTime="08:00:00"
                                                slotMinTime="00:00:00"
                                                slotMaxTime="24:00:00"
                                                allDaySlot={false}
                                                slotDuration="01:00:00"
                                                slotLabelInterval="01:00:00"
                                                slotLabelFormat={{
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    omitZeroMinute: true,
                                                    meridiem: 'short'
                                                }}
                                                events={calendarEvents}
                                                eventDisplay="block"
                                                displayEventTime={true}
                                                eventTimeFormat={{
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    meridiem: 'short'
                                                }}
                                                nowIndicator={true}
                                                slotEventOverlap={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </DrawerContent>
        </Drawer>
    );
};

export default SlotAvailability;
