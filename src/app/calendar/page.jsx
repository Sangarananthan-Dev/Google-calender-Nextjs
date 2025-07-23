"use client"

import { useRef, useState, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import CalendarSideBar from "./components/CalendarSideBar"
import CreateEvent from "./components/modal/CreateEvent"
import CalendarHeader from "./components/CalendarHeader"

export default function CalendarApp() {
    const calendarRef = useRef(null)
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [currentView, setCurrentView] = useState("Month")
    const [selectedRange, setSelectedRange] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const fetchEvents = useCallback(async (fetchInfo, successCallback, failureCallback) => {
        try {
            const timeMin = fetchInfo.start.toISOString()
            const timeMax = fetchInfo.end.toISOString()

            const apiUrl = `/api/calendar/event?action=list-events&timeMin=${timeMin}&timeMax=${timeMax}`

            const response = await fetch(apiUrl)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
            }
            const data = await response.json()

            const transformedEvents = data.items.map((event) => ({
                id: event.id,
                title: event.summary,
                start: event.start.date || event.start.dateTime,
                end: event.end.date || event.end.dateTime,
                url: event.htmlLink,
                color: event.colorId ? `${event.colorId}` : undefined,
            }))

            successCallback(transformedEvents)
        } catch (error) {
            console.error("Error fetching events:", error)
            failureCallback(error)
        }
    }, [])

    const goToToday = () => {
        const today = new Date()
        setSelectedDate(today)
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(today)
        }
    }

    const navigateMonth = (direction) => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            if (direction === "prev") {
                calendarApi.prev()
            } else {
                calendarApi.next()
            }
            const currentDate = calendarApi.getDate()
            setSelectedDate(currentDate)
        }
    }

    const handleViewChange = (view) => {
        setCurrentView(view)
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            let fullCalendarView = "dayGridMonth"
            switch (view) {
                case "Day":
                    fullCalendarView = "timeGridDay"
                    break
                case "Week":
                    fullCalendarView = "timeGridWeek"
                    break
                case "Month":
                    fullCalendarView = "dayGridMonth"
                    break
                case "List":
                    fullCalendarView = "listWeek" 
                    break
            }
            calendarApi.changeView(fullCalendarView)
        }
    }

    const handleDateClick = (arg) => {
        const dateRange = {
            start: arg.dateStr,
            end: arg.dateStr, 
        }
        setSelectedRange(dateRange)
        setIsDrawerOpen(true)
    }

    const handleSelect = (arg) => {
        const dateRange = {
            start: arg.startStr,
            end: arg.endStr,
        }
        setSelectedRange(dateRange)
        setIsDrawerOpen(true)
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.unselect()
        }
    }

    const handleEventClick = (clickInfo) => {
        if (clickInfo.event.url) {
            window.open(clickInfo.event.url, "_blank")
            clickInfo.jsEvent.preventDefault() 
        }
      
    }

    return (
        <div className="flex">
            <CalendarSideBar />
            <main className="h-[100%] w-[100%] flex flex-col">
                <CalendarHeader
                    selectedDate={selectedDate}
                    currentView={currentView}
                    onGoToToday={goToToday}
                    onNavigateMonth={navigateMonth}
                    onViewChange={handleViewChange}
                />
                <div className="h-[calc(100vh-70px)] flex ">
                    <div className="w-[100%] h-[100%]">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            initialDate={selectedDate}
                            weekends={true}
                            selectable={true}
                            selectMirror={true}
                            select={handleSelect} 
                            dateClick={handleDateClick} 
                            eventClick={handleEventClick} 
                            headerToolbar={false} 
                            height="100%" 
                            dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
                            dayCellClassNames="border-r border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            eventClassNames="cursor-pointer"
                            scrollTime="08:00:00" 
                            selectConstraint={{
                                start: "1900-01-01",
                                end: "2100-12-31",
                            }}
                            events={fetchEvents}
                        />
                    </div>

                </div>
            </main>
            <CreateEvent
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                selectedRange={selectedRange}
                selectedDate={selectedDate}
            />
        </div>
    )
}
