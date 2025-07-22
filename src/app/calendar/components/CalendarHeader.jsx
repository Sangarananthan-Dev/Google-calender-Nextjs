import React from 'react'
import { formatMonthYear } from '@/utils/dateFormat'
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const CalendarHeader = ({ selectedDate, currentView, onGoToToday, onNavigateMonth, onViewChange }) => {
    return (
        <div className="flex items-center bg-blue-50 gap-4 w-full justify-between p-[8px]">
            <Button
                variant="outline"
                onClick={onGoToToday}
                className="px-4 py-2 rounded-full font-medium border border-black hover:bg-gray-50 bg-transparent"
            >
                Today
            </Button>
            <div className="flex items-center justify-between gap-3 md:gap-[1.5rem]">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigateMonth("prev")}
                    className="w-8 h-8 rounded-full hover:bg-blue-100"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-base font-semibold font-sans text-black-700">{formatMonthYear(selectedDate)}</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigateMonth("next")}
                    className="w-8 h-8 rounded-full hover:bg-blue-100"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="px-4 py-2 rounded-full border border-black hover:bg-gray-50 flex items-center gap-2 bg-transparent"
                    >
                        {currentView}
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewChange("Day")}>Day</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("Week")}>Week</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("Month")}>Month</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("List")}>List</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CalendarHeader
