import React from 'react'

const Minicalendar = () => {
    return (
        <div>
            <div className="flex items-start justify-start p-[10px] w-[20%] h-[100%] flex-shrink-0 flex-col gap-[1.5rem]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <Image overrideSrc="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_15_2x.png" alt="logo" width={40} height={40} />
                        <h1 className="text-2xl font-normal">Calendar</h1>
                    </div>
                </div>
                <Button
                    className="flex mr-[10%] font-semibold items-center gap-2 bg-white hover:bg-gray-50 rounded-[15px] border border-gray-300 shadow-sm h-[54px] px-4 py-3 text-gray-700">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">Create</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="h-auto p-1">
                    <Calendar
                        onChange={handleMiniCalendarChange}
                        value={selectedDate}
                        locale="en-US"
                        className="custom-calendar"
                        formatShortWeekday={(locale, date) =>
                            date.toLocaleDateString(locale, { weekday: "narrow" })
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default Minicalendar
