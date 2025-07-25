"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X, Trash2,Copy,  MapPin,  Edit2, LucideUser2, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePopoverPosition } from "@/hooks/usePopoverPosition"


export default function EventPopover({ isOpen, onClose, event, triggerRect }) {


    const popoverRef = useRef(null)
    const [popoverDimensions, setPopoverDimensions] = useState({ width: 400, height: 300 })
    const [isMounted, setIsMounted] = useState(false)

    const { position, isReady } = usePopoverPosition({
        isOpen,
        triggerRect,
        popoverWidth: popoverDimensions.width,
        popoverHeight: popoverDimensions.height,
    })

    useEffect(() => {
        if (isOpen && popoverRef.current && !isMounted) {
            const rect = popoverRef.current.getBoundingClientRect()
            setPopoverDimensions({
                width: Math.max(rect.width, 400),
                height: Math.min(rect.height, window.innerHeight * 0.6),
            })
            setIsMounted(true)
        }
    }, [isOpen, isMounted])

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
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
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


    const GoogleMeetButton = (event) => {

        if (!event.hangoutLink) return null
        const GoogleMeetIcon = () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
                className="flex-shrink-0"
            >
                <rect
                    width="16"
                    height="16"
                    x="12"
                    y="16"
                    fill="#fff"
                    transform="rotate(-90 20 24)"
                />
                <polygon fill="#1e88e5" points="3,17 3,31 8,32 13,31 13,17 8,16" />
                <path
                    fill="#4caf50"
                    d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                />
                <path
                    fill="#fbc02d"
                    d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                />
                <path fill="#1565c0" d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z" />
                <polygon fill="#e53935" points="13,7 13,17 3,17" />
                <polygon fill="#2e7d32" points="38,24 37,32.45 27,24 37,15.55" />
                <path
                    fill="#4caf50"
                    d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                />
            </svg>
        );

        const handleCopyLink = () => {
            navigator.clipboard.writeText(event.hangoutLink);
        };

        return (
            <div className="max-w-md mx-auto p-1 bg-gray-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <GoogleMeetIcon />
                        <div className="flex flex-col gap-1">
                            <button
                                className="flex-1  text-[12px] px-5 py-2 min-w-[50%] rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                onClick={() => window.open(event.hangoutLink, "_blank")}
                            >
                                Join with Google Meet
                            </button>
                           
                        </div>
                      
                        <button
                            className="p-2 hover:bg-gray-200  ml-auto rounded-full transition-colors"
                            onClick={handleCopyLink}
                            title="Copy link"
                        >
                            <Copy className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <div className="text-[11px] text-gray-600 pl-[12%] break-all">
                        {event.hangoutLink}
                    </div>
                </div>
            </div>
        );
    };
    const isAllDay = !event.start?.includes("T")

    const popoverContent = (
        <div
            ref={popoverRef}
            className="fixed z-50 w-96 bg-[#f0f4f9] rounded-[20px] shadow-xl p-0 overflow-hidden transition-opacity duration-150"
            style={{
                left: position.x,
                top: position.y,
                maxHeight: "60vh",
                opacity: isReady ? 1 : 0,
                visibility: isReady ? "visible" : "hidden",
            }}
        >
            <div className="flex items-center justify-between px-[1rem] pt-[.7rem] border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: event.backgroundColor || "#039be5" }} />
                    <div className="flex flex-col justify-center items-start">
                        <h2 className="font-semibold text-gray-800 truncate">{event.title || "(No Title)"}</h2>
                        <div>
                            <div className="text-[12px] font-medium text-gray-900">{formatDate(event.start)}</div>
                            {!isAllDay && (
                                <div className="text-[11px] font-normal text-gray-600">
                                    {formatTime(event.start)} - {formatTime(event.end)}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(60vh - 80px)" }}>
                <div className="p-4 space-y-2">
                    {GoogleMeetButton(event)}

                    {event.location && (
                        <div className="flex  p-1 items-start gap-3">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500 mt-0.5" />
                            <div className="text-[13px] font-medium text-gray-900">{event.location}</div>
                        </div>
                    )}

                    {event.creator && (
                        <div className="flex  p-1 items-start gap-3">
                            <LucideUser2 className="h-4 w-4 mr-1 text-gray-500 mt-0.5" />
                            <div className="text-[13px] font-medium text-gray-900">{event.creator.email}</div>
                        </div>
                    )}
                   
                </div>
            </div>

          
        </div>
    )

    return createPortal(popoverContent, document.body)
}
