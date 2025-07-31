import { EVENT_URL } from "../../constants";
import { apiService } from "../apiSlice";

const eventApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query({
      query: ({ calendarId, timeMin, timeMax }) => ({
        url: `${EVENT_URL}/${calendarId}/events`,
        method: "GET",
        params: { timeMin, timeMax, singleEvents: true },
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
      providesTags: ["Events"],
    }),
    getEvent: builder.query({
      query: (eventId) => ({
        url: `${EVENT_URL}/primary/events/${eventId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const isAllDay = !!response.start.date;

        const parseDateTime = (dateTimeStr) => {
          const date = new Date(dateTimeStr);
          return {
            date: date.toISOString().split("T")[0],
            time: date.toTimeString().split(":").slice(0, 2).join(":"),
          };
        };

        let startDate = "";
        let startTime = "";
        let endDate = "";
        let endTime = "";

        if (isAllDay) {
          startDate = response.start.date;
          endDate = response.end.date;
        } else {
          const start = parseDateTime(response.start.dateTime);
          const end = parseDateTime(response.end.dateTime);
          startDate = start.date;
          startTime = start.time;
          endDate = end.date;
          endTime = end.time;
        }

        return {
          id: response.id,
          htmlLink: response.htmlLink,
          summary: response.summary || "",
          description: response.description || "",
          location: response.location || "",
          allDay: isAllDay,
          startDate,
          endDate,
          startTime,
          endTime,
          timeZone: response.start.timeZone || "Asia/Kolkata",
          isMeeting: !!response.hangoutLink,
          visibility: response.visibility || "default",
          eventType: response.eventType || "default",
          colorId: response.colorId || "1",
          reminders: response.reminders || { useDefault: true, overrides: [] },
          guestsCanModify: response.guestsCanModify ?? false,
          guestsCanInviteOthers: response.guestsCanInviteOthers ?? false,
          guestsCanSeeOtherGuests: response.guestsCanSeeOtherGuests ?? false,
          sequence: response.sequence || 0,
          attendees: response.attendees || [],
          reqParams: {
            calendarId: "primary",
            conferenceDataVersion: response.hangoutLink ? 1 : 0,
            maxAttendees: 20,
            sendNotifications: true,
            sendUpdates: "all",
            supportsAttachments: false,
          },
        };
      },
      providesTags: ["Events"],
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
          recurrence,
          sequence,
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
          // recurrence: [recurrence],
          colorId,
          guestsCanModify,
          guestsCanInviteOthers,
          guestsCanSeeOtherGuests,
          sequence: sequence + 1,
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
          supportsAttachments: reqParams.supportsAttachments,
        };

        return {
          url: `${EVENT_URL}/${reqParams.calendarId}/events/${eventData.id}`,
          method: "PUT",
          params,
          body,
        };
      },
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `${EVENT_URL}/primary/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useLazyListEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApiSlice;
