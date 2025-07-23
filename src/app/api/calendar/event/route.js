import { NextResponse } from "next/server";
import { getCalendarInstance, getTokensFromRequest } from "../helper";

export async function GET(req) {
  try {
    const tokens = getTokensFromRequest(req);
    if (!tokens) {
      return NextResponse.json(
        { error: "Authentication tokens required" },
        { status: 401 }
      );
    }

    const calendar = getCalendarInstance(tokens);
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const calendarId = searchParams.get("calendarId") || "primary";

    switch (action) {
      case "list-events":
        return await listEvents(calendar, calendarId, searchParams);
      case "list-calendars":
        return await listCalendars(calendar);
      case "get-event":
        const eventId = searchParams.get("eventId");
        return await getEvent(calendar, calendarId, eventId);
      case "get-busy-times":
        return await getBusyTimes(calendar, searchParams);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Calendar API Error:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Authentication failed. Please re-authenticate." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const tokens = getTokensFromRequest(req, body);

    if (!tokens) {
      return NextResponse.json(
        { error: "Authentication tokens required" },
        { status: 401 }
      );
    }

    const calendar = getCalendarInstance(tokens);
    const { action } = body;
    switch (action) {
      case "create-event":
        return await createEvent(calendar, body);
      case "create-meeting":
        return await createMeetingEvent(calendar, body);
      case "quick-add":
        return await quickAddEvent(calendar, body);
      case "create-recurring-event":
        return await createRecurringEvent(calendar, body);
      case "create-full-featured-event":
        return await createFullFeaturedEvent(calendar, body);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Calendar API Error:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Authentication failed. Please re-authenticate." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const tokens = getTokensFromRequest(req, body);

    if (!tokens) {
      return NextResponse.json(
        { error: "Authentication tokens required" },
        { status: 401 }
      );
    }

    const calendar = getCalendarInstance(tokens);
    const { action } = body;
    switch (action) {
      case "update-event":
        return await updateEvent(calendar, body);
      case "move-event":
        return await moveEvent(calendar, body);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Calendar API Error:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Authentication failed. Please re-authenticate." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const tokens = getTokensFromRequest(req);
    if (!tokens) {
      return NextResponse.json(
        { error: "Authentication tokens required" },
        { status: 401 }
      );
    }

    const calendar = getCalendarInstance(tokens);
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const calendarId = searchParams.get("calendarId") || "primary";

    return await deleteEvent(calendar, calendarId, eventId);
  } catch (error) {
    console.error("Calendar API Error:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Authentication failed. Please re-authenticate." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// List events with filtering options
async function listEvents(calendar, calendarId, searchParams) {
  const timeMin = searchParams.get("timeMin") || new Date().toISOString();
  const timeMax = searchParams.get("timeMax");
  const maxResults = parseInt(searchParams.get("maxResults")) || 10;
  const q = searchParams.get("q"); // Search query

  const params = {
    calendarId,
    timeMin,
    maxResults,
    singleEvents: true,
    orderBy: "startTime",
  };

  if (timeMax) params.timeMax = timeMax;
  if (q) params.q = q;

  const response = await calendar.events.list(params);
  return NextResponse.json(response.data);
}

// Get all calendars
async function listCalendars(calendar) {
  const response = await calendar.calendarList.list();
  return NextResponse.json(response.data);
}

// Get a specific event
async function getEvent(calendar, calendarId, eventId) {
  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  const response = await calendar.events.get({
    calendarId,
    eventId,
  });
  return NextResponse.json(response.data);
}

// Get busy/free time information
async function getBusyTimes(calendar, searchParams) {
  const timeMin = searchParams.get("timeMin") || new Date().toISOString();
  const timeMax =
    searchParams.get("timeMax") ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const calendars = searchParams.get("calendars")?.split(",") || ["primary"];

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: calendars.map((id) => ({ id })),
    },
  });

  return NextResponse.json(response.data);
}

// Create a basic event
async function createEvent(calendar, body) {
  const {
    calendarId = "primary",
    summary,
    description,
    startDateTime,
    endDateTime,
    timeZone = "UTC",
    attendees = [],
    location,
    reminders,
    visibility = "default",
    transparency = "opaque",
  } = body;

  const event = {
    summary,
    description,
    location,
    start: {
      dateTime: startDateTime,
      timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone,
    },
    attendees: attendees.map((email) => ({ email })),
    visibility,
    transparency,
  };

  // Add reminders if specified
  if (reminders) {
    event.reminders = {
      useDefault: false,
      overrides: reminders,
    };
  }

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
    sendUpdates: "all", // Send invitations to attendees
  });

  return NextResponse.json(response.data);
}

// Create an event with Google Meet link
async function createMeetingEvent(calendar, body) {
  const {
    calendarId = "primary",
    summary,
    description,
    startDateTime,
    endDateTime,
    timeZone = "UTC",
    attendees = [],
    location,
    reminders,
    meetingType = "hangoutsMeet", // or 'addOn'
  } = body;

  const event = {
    summary,
    description,
    location,
    start: {
      dateTime: startDateTime,
      timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone,
    },
    attendees: attendees.map((email) => ({ email })),
    // Add Google Meet conference
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`, // Unique request ID
        conferenceSolutionKey: {
          type: meetingType,
        },
      },
    },
  };``

  // Add reminders if specified
  if (reminders) {
    event.reminders = {
      useDefault: false,
      overrides: reminders,
    };
  }

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
    conferenceDataVersion: 1, // Required for conference data
    sendUpdates: "all",
  });

  return NextResponse.json(response.data);
}

// Quick add event using natural language
async function quickAddEvent(calendar, body) {
  const { calendarId = "primary", text } = body;

  if (!text) {
    return NextResponse.json(
      { error: "Text is required for quick add" },
      { status: 400 }
    );
  }

  const response = await calendar.events.quickAdd({
    calendarId,
    text,
  });

  return NextResponse.json(response.data);
}

// Create recurring event
async function createRecurringEvent(calendar, body) {
  const {
    calendarId = "primary",
    summary,
    description,
    startDateTime,
    endDateTime,
    timeZone = "UTC",
    attendees = [],
    location,
    recurrence, // Array like ['RRULE:FREQ=WEEKLY;COUNT=10']
    reminders,
  } = body;

  const event = {
    summary,
    description,
    location,
    start: {
      dateTime: startDateTime,
      timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone,
    },
    attendees: attendees.map((email) => ({ email })),
    recurrence,
  };

  if (reminders) {
    event.reminders = {
      useDefault: false,
      overrides: reminders,
    };
  }

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
    sendUpdates: "all",
  });

  return NextResponse.json(response.data);
}

// ENHANCED: Create a fully-featured event with all Google Calendar API v3 options
async function createFullFeaturedEvent(calendar, body) {
  const {
    // Required parameters
    calendarId = "primary",
    summary,
    startDateTime,
    endDateTime,
    startDate,
    endDate,
    // Basic event details
    description,
    location,
    timeZone = "UTC",
    allDay = false,

    // Attendees
    attendees = [],
    maxAttendees,

    // Notifications
    sendUpdates = "all", // "all", "externalOnly", "none"
    sendNotifications, // Deprecated, use sendUpdates

    //Meeting
    meetingType,

    // Attachments
    attachments = [],

    // Event properties
    colorId,
    visibility = "default", // "default", "public", "private", "confidential"
    transparency = "opaque", // "opaque", "transparent"
    status = "confirmed", // "confirmed", "tentative", "cancelled"
    eventType = "default", // "default", "birthday", "focusTime", "fromGmail", "outOfOffice", "workingLocation"

    // Reminders
    reminders,

    // Recurrence
    recurrence,
    id,
    conferenceDataVersion,
    supportsAttachments,
    // Guest settings
    guestsCanInviteOthers = true,
    guestsCanModify = false,
    guestsCanSeeOtherGuests = true,
    anyoneCanAddSelf = false,

    // Extended properties
    extendedProperties,

    // Source
    source,

    // Gadget
    gadget,

    // Special event type properties
    birthdayProperties,
    focusTimeProperties,
    outOfOfficeProperties,
    workingLocationProperties,

    // Sequence for conflict resolution
    sequence = 0,
  } = body;

  // Validate required parameters
  if (!summary) {
    return NextResponse.json(
      { error: "Event summary is required" },
      { status: 400 }
    );
  }

  if (!startDateTime && !startDate) {
    return NextResponse.json(
      { error: "Event start time is required (startDateTime or startDate)" },
      { status: 400 }
    );
  }

  if (!endDateTime && !endDate) {
    return NextResponse.json(
      { error: "Event end time is required (endDateTime or endDate)" },
      { status: 400 }
    );
  }

  // Build the event object
  const event = {
    summary,
    description,
    location,
    colorId,
    visibility,
    transparency,
    status,
    eventType,
    sequence,
  };

  // Set custom ID if provided
  event.id = id;

  // Handle start/end times
  if (!allDay) {
    // Regular timed event
    event.start = {
      dateTime: startDateTime,
      timeZone,
    };
    event.end = {
      dateTime: endDateTime,
      timeZone,
    };
  } else if (allDay) {
    // All-day event
    event.start = {
      date: startDateTime,
    };
    event.end = {
      date: endDateTime,
    };
  }

  // Process attendees with full options
  if (attendees.length > 0) {
    event.attendees = attendees.map((attendee) => {
      if (typeof attendee === "string") {
        return { email: attendee };
      }
      return attendee;
    });
  }

  // Add guest permissions
  event.guestsCanInviteOthers = guestsCanInviteOthers;
  event.guestsCanModify = guestsCanModify;
  event.guestsCanSeeOtherGuests = guestsCanSeeOtherGuests;
  event.anyoneCanAddSelf = anyoneCanAddSelf;

  // Add reminders
  if (reminders) {
    event.reminders =
      reminders.length === 0
        ? { useDefault: true }
        : { useDefault: false, overrides: reminders };
  }

  // Add recurrence
  if (recurrence) {
    event.recurrence = recurrence;
  }

  // Add conference data (Google Meet, etc.)
  if (meetingType) {
    event.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
    event.conferenceDataVersion = 1; // Required for the API to create Meet links
  }

  // Add attachments
  if (attachments.length > 0) {
    event.attachments = attachments.map((attachment) => ({
      fileUrl: attachment.fileUrl,
      title: attachment.title,
      mimeType: attachment.mimeType,
      iconLink: attachment.iconLink,
      fileId: attachment.fileId,
    }));
  }

  // Add special event type properties
  if (birthdayProperties && eventType === "birthday") {
    event.birthdayProperties = birthdayProperties;
  }

  if (focusTimeProperties && eventType === "focusTime") {
    event.focusTimeProperties = focusTimeProperties;
  }

  if (outOfOfficeProperties && eventType === "outOfOffice") {
    event.outOfOfficeProperties = outOfOfficeProperties;
  }

  if (workingLocationProperties && eventType === "workingLocation") {
    event.workingLocationProperties = workingLocationProperties;
  }

  // Build request parameters
  const requestParams = {
    calendarId,
    requestBody: event,
    sendUpdates,
    conferenceDataVersion: event.conferenceDataVersion || 1,
  };

  if (maxAttendees) {
    requestParams.maxAttendees = maxAttendees;
  }

  if (supportsAttachments) {
    requestParams.supportsAttachments = supportsAttachments;
  }

  // Handle deprecated sendNotifications parameter
  if (sendNotifications !== undefined) {
    requestParams.sendNotifications = sendNotifications;
  }

  try {
    console.log("Creating event with parameters:", requestParams);
    const response = await calendar.events.insert(requestParams);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Event creation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create event",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Update an existing event
async function updateEvent(calendar, body) {
  const {
    calendarId = "primary",
    eventId,
    summary,
    description,
    startDateTime,
    endDateTime,
    timeZone = "UTC",
    attendees = [],
    location,
    reminders,
  } = body;

  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  const event = {
    summary,
    description,
    location,
    start: {
      dateTime: startDateTime,
      timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone,
    },
    attendees: attendees.map((email) => ({ email })),
  };

  if (reminders) {
    event.reminders = {
      useDefault: false,
      overrides: reminders,
    };
  }

  const response = await calendar.events.update({
    calendarId,
    eventId,
    requestBody: event,
    sendUpdates: "all",
  });

  return NextResponse.json(response.data);
}

// Move event to another calendar
async function moveEvent(calendar, body) {
  const { sourceCalendarId = "primary", targetCalendarId, eventId } = body;

  if (!eventId || !targetCalendarId) {
    return NextResponse.json(
      {
        error: "Event ID and target calendar ID are required",
      },
      { status: 400 }
    );
  }

  const response = await calendar.events.move({
    calendarId: sourceCalendarId,
    eventId,
    destination: targetCalendarId,
  });

  return NextResponse.json(response.data);
}

// Delete an event
async function deleteEvent(calendar, calendarId, eventId) {
  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  await calendar.events.delete({
    calendarId,
    eventId,
    sendUpdates: "all",
  });

  return NextResponse.json({ message: "Event deleted successfully" });
}
