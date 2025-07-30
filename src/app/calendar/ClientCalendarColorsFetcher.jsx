"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCalendarColors } from "@/redux/features/calendarColors/calendarColorsSlice";
import { useFetchColorsQuery } from "@/redux/service/api/calendarColors";

export default function ClientCalendarColorsFetcher() {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useFetchColorsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (data) {
            dispatch(setCalendarColors(data));
        }
    }, [data, dispatch]);
    return null;
}
