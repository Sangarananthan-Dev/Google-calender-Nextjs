import React from 'react'
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
const CreateEvent = ({ isOpen, onOpenChange, selectedRange, selectedDate }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return ""

    const start = new Date(startDate)
    const end = new Date(endDate)

    // If same date, show single date
    if (startDate === endDate) {
      return formatDate(startDate)
    }

    // Different dates, show range
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const getDaysDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[100%] ">
        <div className="w-[100%] h-[100%]  flex ">
          <div className="w-[40%]  h-[100%]">

          </div>
          <div className="w-[60%] h-[100%] bg-blue-700">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate}
              weekends={true}
              selectable={true}
              selectMirror={true}
              // select={handleSelect}
              // dateClick={handleDateClick}
              headerToolbar={false}
              height="100%"
              dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
              dayCellClassNames="border-r border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              eventClassNames="cursor-pointer"
              scrollTime="08:00:00"
              selectConstraint={{
                start: '1900-01-01',
                end: '2100-12-31'
              }}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateEvent
