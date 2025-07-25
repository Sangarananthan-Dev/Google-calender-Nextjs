"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X, Edit, Trash2, ExternalLink, MapPin, Clock, User, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePopoverPosition } from "@/hooks/usePopoverPosition"


export default function EventPopover({ isOpen, onClose, event, triggerRect }) {
    console.log     

            
    const popoverRef = useRef(null)
    const [popoverDimensions, setPopoverDimensions] = useState({ width: 400, height: 300 })
    const [isMounted, setIsMounted] = useState(false)

    const { position, isReady } = usePopoverPosition({
        isOpen,
        triggerRect,
        popoverWidth: popoverDimensions.width,
        popoverHeight: popoverDimensions.height,
    })

    // Measure popover dimensions on first render
    useEffect(() => {
        if (isOpen && popoverRef.current && !isMounted) {
            // Force a layout to get accurate measurements
            const rect = popoverRef.current.getBoundingClientRect()
            setPopoverDimensions({
                width: Math.max(rect.width, 400),
                height: Math.min(rect.height, window.innerHeight * 0.6),
            })
            setIsMounted(true)
        }
    }, [isOpen, isMounted])

    // Reset mounted state when popover closes
    useEffect(() => {
        if (!isOpen) {
            setIsMounted(false)
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose()
        }

        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target )) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen || !event) return null

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const isAllDay = !event.start?.includes("T")

    const popoverContent = (
        <div
            ref={popoverRef}
            className="fixed z-50 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-opacity duration-150"
            style={{
                left: position.x,
                top: position.y,
                maxHeight: "60vh",
                opacity: isReady ? 1 : 0,
                visibility: isReady ? "visible" : "hidden",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: event.backgroundColor || "#039be5" }} />
                    <h2 className="font-medium text-gray-900 truncate">{event.title || "(No Title)"}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(60vh - 80px)" }}>
                <div className="p-4 space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm text-gray-900">{formatDate(event.start)}</div>
                            {!isAllDay && (
                                <div className="text-sm text-gray-600">
                                    {formatTime(event.start)} - {formatTime(event.end)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Google Meet Link */}
                    {event.hangoutLink && (
                        <div className="space-y-3">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => window.open(event.hangoutLink, "_blank")}
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Join with Google Meet
                            </Button>
                            <div className="text-sm text-gray-600 break-all">{event.hangoutLink}</div>
                        </div>
                    )}

                    {/* Phone Join Option */}
                    {event.hangoutLink && (
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">Join by phone</div>
                                <div className="text-sm text-gray-600">(US) +1 575-912-1431 PIN: 846 090 440#</div>
                            </div>
                        </div>
                    )}

                    {/* Meeting Notes */}
                    {event.hangoutLink && (
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                                    Take meeting notes
                                </div>
                                <div className="text-sm text-gray-600">Start a new document to capture notes</div>
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    {event.location && (
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="text-sm text-gray-900">{event.location}</div>
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="text-sm text-gray-900 whitespace-pre-wrap">{event.description}</div>
                        </div>
                    )}

                    {/* Creator */}
                    {event.creator && (
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="text-sm text-gray-900">{event.creator.email}</div>
                        </div>
                    )}

                    {/* External Link */}
                    {event.url && (
                        <div className="pt-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(event.url, "_blank")} className="w-full">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in Google Calendar
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Arrow indicator - only show when ready */}
            {isReady && (
                <div
                    className={`absolute w-3 h-3 bg-white border transform rotate-45 ${position.placement === "bottom"
                            ? "-top-1.5 border-b-0 border-r-0"
                            : position.placement === "top"
                                ? "-bottom-1.5 border-t-0 border-l-0"
                                : position.placement === "right"
                                    ? "-left-1.5 border-r-0 border-b-0"
                                    : "-right-1.5 border-l-0 border-t-0"
                        }`}
                    style={{
                        left:
                            position.placement === "bottom" || position.placement === "top"
                                ? "50%"
                                : position.placement === "right"
                                    ? "-6px"
                                    : "auto",
                        right: position.placement === "left" ? "-6px" : "auto",
                        top:
                            position.placement === "left" || position.placement === "right"
                                ? "50%"
                                : position.placement === "bottom"
                                    ? "-6px"
                                    : "auto",
                        bottom: position.placement === "top" ? "-6px" : "auto",
                        transform:
                            position.placement === "bottom" || position.placement === "top"
                                ? "translateX(-50%) rotate(45deg)"
                                : "translateY(-50%) rotate(45deg)",
                    }}
                />
            )}
        </div>
    )

    return createPortal(popoverContent, document.body)
}
