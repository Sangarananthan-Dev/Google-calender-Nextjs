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
          eventView: {
            id: event.id,
            start: event.start.date || event.start.dateTime,
            end: event.end.date || event.end.dateTime,
            title: event.summary ? event.summary : "(No Title)",
            description: event.description ?? undefined,
            location: event.location ?? undefined,
            hangoutLink: event.hangoutLink ?? undefined,
            creator: event.creator ?? undefined,
          },
        }));
      },

      // keepUnusedDataFor: 60,
      // refetchOnMountOrArgChange: false,
      providesTags: ["Events"],
    }),
    getEvent: builder.query({
      query: (eventId) => ({
        url: `${EVENT_URL}/primary/events/${eventId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          id: response.id,
          htmlLink: response.htmlLink,
          summary: response.summary,
          description: response.description,
          location: response.location,
          allDay: response.start.date
            ? true
            : false && response.end.date
            ? true
            : false,
          start: {
            date: response.start.date ? response.start.date : "",
            dateTime: response.start.dateTime ? response.start.dateTime : "",
            timeZone: response.start.timeZone ? response.start.timeZone : "",
          },
          end: {
            date: response.end.date ? response.end.date : "",
            dateTime: response.end.dateTime ? response.end.dateTime : "",
            timeZone: response.end.timeZone ? response.end.timeZone : "",
          },
          isMeeting: response.hangoutLink ? true : false,
          visibility: response.visibility ? response.visibility : "default",
          reminders: response.reminders,
          eventType: response.eventType ? response.eventType : "default",
          guestsCanModify: response.guestsCanModify
            ? response.guestsCanModify
            : false,
          guestsCanInviteOthers: response.guestsCanInviteOthers
            ? response.guestsCanInviteOthers
            : false,
          guestsCanSeeOtherGuests: response.guestsCanSeeOtherGuests
            ? response.guestsCanSeeOtherGuests
            : false,
          sequence: response.sequence,
          attendees: response.attendees,
        };
      },
    }),
    createEvent: builder.mutation({
      query: ({ eventData }) => {
        const {
          startDate,
          endDate,
          startTime,
          endTime,
          timeZone,
          allDay,
          isMeeting,
          attendees,
          reqParams,
          reminders,
          summary,
          description,
          location,
          visibility,
          eventType,
          colorId,
          guestsCanModify,
          guestsCanInviteOthers,
          guestsCanSeeOtherGuests,
        } = eventData;

        const createDateTimeObject = (date, time, isAllDay) => {
          if (isAllDay) {
            return { date };
          }
          return {
            dateTime: new Date(`${date}T${time}:00`).toISOString(),
            timeZone,
          };
        };

        const body = {
          summary,
          description,
          location,
          start: createDateTimeObject(startDate, startTime, allDay),
          end: createDateTimeObject(endDate, endTime, allDay),
          visibility,
          eventType,
          colorId,
          guestsCanModify,
          guestsCanInviteOthers,
          guestsCanSeeOtherGuests,
          sequence: 0,
          attendees,
          ...(isMeeting && {
            conferenceData: {
              createRequest: {
                requestId: `meet-${Date.now()}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          }),
          reminders: {
            ...reminders,
            useDefault: !reminders?.overrides?.length,
          },
        };

        const params = {
          conferenceDataVersion: isMeeting ? 1 : 0,
          maxAttendees: reqParams.maxAttendees,
          sendNotifications: reqParams.sendNotifications,
          sendUpdates: reqParams.sendUpdates,
          supportsAttachments: reqParams.supportsAttachments, // Fixed typo
        };

        return {
          url: `${EVENT_URL}/${reqParams.calendarId}/events`,
          method: "POST",
          params,
          body,
        };
      },
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/primary/events/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyListEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventApiSlice;
