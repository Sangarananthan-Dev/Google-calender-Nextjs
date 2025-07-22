"use client";

import React, { useEffect, useState } from 'react';
import { formatMonthYear } from '@/utils/dateFormat';
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';

const CalendarHeader = ({ selectedDate, currentView, onGoToToday, onNavigateMonth, onViewChange }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                alert("No code found in URL.");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            localStorage.setItem("user", JSON.stringify(data.userInfo));

            alert("Login successful!");
        } catch (error) {
            console.error(error);
            alert("Login failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="flex items-center bg-[#f8fafd] gap-4 w-full justify-between p-[8px]">
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
            <div className='flex items-center gap-2'>
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

                <Dialog>
                    <DialogTrigger asChild>
                        <div className='relative flex gap-2 items-center cursor-pointer justify-center border-[1px] border-gray-500 rounded-full px-2 py-1.5  hover:bg-gray-100'>
                            <div className='relative w-[70px] h-[30px]'>
                                <Image
                                    overrideSrc="https://www.google.com/u/0/ac/images/logo.gif?uid=114104529708558972603&service=google_gsuite"
                                    alt="Google Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <Avatar className="cursor-pointer border border-black">
                                {user ? (

                                    <AvatarImage src={user.picture} alt={user.name} />

                                ) : (
                                    <AvatarFallback>LG</AvatarFallback>
                                )}
                            </Avatar>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Login</DialogTitle>
                        </DialogHeader>
                        <Button onClick={handleLogin} disabled={loading}>
                            {loading ? "Logging in..." : "Login with Google"}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

        </div >
    );
};

export default CalendarHeader;
