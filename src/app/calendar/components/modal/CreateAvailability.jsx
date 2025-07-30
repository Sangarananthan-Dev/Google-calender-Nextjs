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
import { format, parseISO, addHours } from "date-fns"
import {
    X,
    Plus,
    Clock,
    Calendar,
} from "lucide-react"

const SlotAvailability = ({
    isOpen,
    isEditMode,
    slotId,
    onOpenChange,
    selectedRange,
}) => {
    const calendarRef = useRef(null)
    const [calendarView, setCalendarView] = useState('timeGridWeek')
    const [newSlotDate, setNewSlotDate] = useState("")

    // Initial data structure
    const initialData = {
        availability: []
    };

    // Validation schema with overlap detection
    const validationSchema = Yup.object({
        availability: Yup.array().of(
            Yup.object({
                date: Yup.date().required("Date is required"),
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
    });

    // Convert form data to FullCalendar events
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

        // Transform to the required JSON structure
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
        <Drawer open={isOpen} onOpenChange={onOpenChange} className="border-0">
            <DrawerContent className="h-[99%] bg-gray-50 p-0 m-0">
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
                                        <div className="w-[50%] h-full border-r flex flex-col">
                                            <DrawerHeader className="py-0 w-[100%] flex flex-row mt-2">
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
                                            </DrawerHeader>

                                            {/* Availability Section */}
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <FieldArray name="availability">
                                                    {({ push, remove }) => (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="text-lg font-medium">Available Dates & Times</h3>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => push({ date: "", slots: [] })}
                                                                    className="bg-[#0b57d0] hover:bg-[#0a47b0] text-white"
                                                                >
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Add Availability
                                                                </Button>
                                                            </div>

                                                            {formik.values.availability.map((dayAvailability, dayIndex) => (
                                                                <div key={dayIndex} className="border rounded-lg p-4 bg-white">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex items-center space-x-2">
                                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                                            <Field name={`availability.${dayIndex}.date`}>
                                                                                {({ field, meta }) => (
                                                                                    <div>
                                                                                        <Input
                                                                                            {...field}
                                                                                            type="date"
                                                                                            className="w-auto"
                                                                                        />
                                                                                        {meta.touched && meta.error && (
                                                                                            <div className="text-red-500 text-xs mt-1">
                                                                                                {meta.error}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </Field>
                                                                        </div>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => remove(dayIndex)}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>

                                                                    <FieldArray name={`availability.${dayIndex}.slots`}>
                                                                        {({ push: pushSlot, remove: removeSlot }) => (
                                                                            <div className="space-y-3">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-sm font-medium text-gray-700">
                                                                                        Time Slots
                                                                                    </span>
                                                                                    <Button
                                                                                        type="button"
                                                                                        onClick={() => pushSlot({ start: "", end: "" })}
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                    >
                                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                                        Add Slot
                                                                                    </Button>
                                                                                </div>

                                                                                {dayAvailability.slots.map((slot, slotIndex) => (
                                                                                    <div key={slotIndex} className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                                                                                        <Clock className="h-4 w-4 text-gray-500" />

                                                                                        <Field name={`availability.${dayIndex}.slots.${slotIndex}.start`}>
                                                                                            {({ field, meta }) => (
                                                                                                <div>
                                                                                                    <Input
                                                                                                        {...field}
                                                                                                        type="time"
                                                                                                        className="w-auto"
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
                                                                                                        className="w-auto"
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
                                                            ))}

                                                            {formik.values.availability.length === 0 && (
                                                                <div className="text-center py-8 text-gray-500">
                                                                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                                    <p>No availability added yet</p>
                                                                    <p className="text-sm">Click "Add Availability" to get started</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            </div>
                                        </div>

                                        {/* Right Panel - Calendar */}
                                        <div className="w-[50%] h-[100%] bg-green-600 flex flex-col">
                                            <FullCalendar
                                                ref={calendarRef}
                                                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                                initialView="timeGridWeek"
                                                weekends={true}
                                                selectable={false}
                                                selectMirror={false}
                                                headerToolbar={{
                                                    left: 'prev,next today',
                                                    center: 'title',
                                                    right: ''
                                                }}
                                                height="100%"
                                                dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
                                                dayCellClassNames="border-r border-b border-gray-100"
                                                eventClassNames="cursor-pointer rounded"
                                                scrollTime="08:00:00"
                                                slotMinTime="00:00:00"
                                                slotMaxTime="24:00:00"
                                                allDaySlot={false}
                                                slotDuration="00:30:00"
                                                slotLabelInterval="01:00:00"
                                                slotLabelFormat={{
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    omitZeroMinute: false,
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
