import { apiService } from "../apiSlice";

export const calendarColorsApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    fetchColors: builder.query({
      query: () => ({
        url: "/calendar/v3/colors",
        method: "GET",
      }),
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: false,
    }),
  }),
});
export const { useFetchColorsQuery } = calendarColorsApiSlice;
