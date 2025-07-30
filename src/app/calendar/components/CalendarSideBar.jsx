"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Calendar from "react-calendar"
import Image from "next/image"
import { ChevronDown, ChevronUp, MoreVertical, Plus, X } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FaCaretDown } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import CreateEventModal from './modal/CreateEventModal'
import CreateAvailability from './modal/CreateAvailability'

const CalendarSideBar = () => {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)

    const handleCreateEvent = () => {
        setIsEventModalOpen(true)
    }

    const handleAddAvailability = () => {
        setIsAvailabilityModalOpen(true)
    }


    return (
        <div className="flex items-start text-[#1F1F1F] overflow-y-scroll custom-scrollbar justify-start p-[10px] w-[20%] h-[100vh] bg-[#f8fafd] flex-shrink-0 flex-col gap-[1rem]">
            <div className="flex items-center gap-6">
                <div className="flex relative items-center gap-1">
                    <Image overrideSrc="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png" alt="logo" width={40} height={40} />
                    <h1 className="text-2xl font-normal">Calendar</h1>
                </div>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="flex mr-[10%] font-semibold items-center gap-2 bg-white hover:bg-gray-50 rounded-[15px] border border-gray-300 shadow-sm h-[54px] px-4 py-3">
                        <HiPlus color='black' />
                        <span className="text-sm text-[#1F1F1F]">Create</span>
                        <FaCaretDown color='black' className='w-[10px] h-[10px]' />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-56 p-1 relative left-3 rounded-xl border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <div className="flex flex-col gap-0.5">
                        <button
                            onClick={() => handleCreateEvent()}
                            className="group flex items-center gap-3 text-sm text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Create Event</div>
                                <div className="text-xs text-gray-500">Schedule a new meeting</div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleAddAvailability()}
                            className="group flex items-center gap-3 text-sm text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Add Availability</div>
                                <div className="text-xs text-gray-500">Set your free time</div>
                            </div>
                        </button>
                    </div>
                </PopoverContent>
            </Popover>

            <div className="h-auto p-1">
                <Calendar
                    // onChange={handleMiniCalendarChange}
                    // value={selectedDate}
                    locale="en-US"
                    className="custom-calendar"
                    formatShortWeekday={(locale, date) =>
                        date.toLocaleDateString(locale, { weekday: "narrow" })
                    }
                />
            </div>

            <Collapsible defaultOpen={true} className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-4 bg-none hover:bg-gray-300 rounded-full text-sm font-semibold ">
                    <span className=''>My calendars</span>
                    <ChevronUp className="h-4 w-4 font-bold data-[state=closed]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-2 pt-2 pl-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ashok"
                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-gray-300"
                        />
                        <Label htmlFor="ashok" className="text-sm font-medium">
                            Ashokkumar Soundarrajan
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="birthdays"
                            className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-gray-300"
                        />
                        <Label htmlFor="birthdays" className="text-sm font-medium">
                            Birthdays
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="tasks"
                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-gray-300"
                        />
                        <Label htmlFor="tasks" className="text-sm font-medium">
                            Tasks
                        </Label>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen={true} className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-4 bg-none hover:bg-gray-300 rounded-full text-sm font-semibold ">
                    <div className="flex items-center gap-2 w-full">
                        <span>Other calendars</span>
                        <Plus className="h-5.5 w-5.5 font-bold ml-[22%] hover:bg-white p-[2px] rounded-[20%]" />
                    </div>
                    <ChevronUp className="h-4 w-4 font-bold data-[state=closed]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-2 pt-2 pl-2">
                    <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="holidays"
                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white border-gray-300"
                            />
                            <Label htmlFor="holidays" className="text-sm font-normal">
                                Holidays in India
                            </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 font-bold hover:bg-gray-200">
                                <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 font-bold hover:bg-gray-200">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <CreateEventModal
                isOpen={isEventModalOpen}
                onOpenChange={setIsEventModalOpen}
            />

            <CreateAvailability
                isOpen={isAvailabilityModalOpen}
                onOpenChange={setIsAvailabilityModalOpen}
            />


        </div>
    )
}

export default CalendarSideBar
