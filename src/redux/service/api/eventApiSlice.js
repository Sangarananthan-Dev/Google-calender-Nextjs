import { EVENT_URL } from "../../constants";
import { apiService } from "../apiSlice";

const eventApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query({
      query: ({ calendarId, timeMin, timeMax }) => ({
        url: `${EVENT_URL}/${calendarId}/events`,
        method: "GET",
        params: { timeMin, timeMax },
      }),
      transformResponse: (response) => {
        return response.items.map((event) => ({
          id: event.id,
          title: event.summary ? event.summary : "(No Title)",
          start: event.start.date || event.start.dateTime,
          end: event.end.date || event.end.dateTime,
          url: event.htmlLink,
          colorId: event.colorId ?? undefined,
        }));
      },
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: false,
      providesTags: ["Events"],
    }),
  }),
});

export const { useLazyListEventsQuery } = eventApiSlice;
