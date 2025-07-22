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
    const calendarId = searchParams.get("calendarId");

    switch (action) {
      case "list":
        return await listCalendars(calendar, searchParams);
      case "get":
        return await getCalendar(calendar, calendarId);
      case "colors":
        return await getCalendarColors(calendar);
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: list, get, colors" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Calendar List API Error:", error);
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
      case "create":
        return await createCalendar(calendar, body);
      case "subscribe":
        return await subscribeToCalendar(calendar, body);
      case "import":
        return await importCalendar(calendar, body);
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: create, subscribe, import" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Calendar List API Error:", error);
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
      case "update":
        return await updateCalendar(calendar, body);
      case "update-settings":
        return await updateCalendarSettings(calendar, body);
      case "set-color":
        return await setCalendarColor(calendar, body);
      case "set-notifications":
        return await setCalendarNotifications(calendar, body);
      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use: update, update-settings, set-color, set-notifications",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Calendar List API Error:", error);
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
    const calendarId = searchParams.get("calendarId");
    const action = searchParams.get("action") || "delete";

    switch (action) {
      case "delete":
        return await deleteCalendar(calendar, calendarId);
      case "unsubscribe":
        return await unsubscribeFromCalendar(calendar, calendarId);
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: delete, unsubscribe" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Calendar List API Error:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Authentication failed. Please re-authenticate." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function listCalendars(calendar, searchParams) {
  const minAccessRole = searchParams.get("minAccessRole"); // owner, freeBusyReader, reader, writer
  const maxResults = parseInt(searchParams.get("maxResults")) || 250;
  const showDeleted = searchParams.get("showDeleted") === "true";
  const showHidden = searchParams.get("showHidden") === "true";

  const params = {
    maxResults,
    showDeleted,
    showHidden,
  };

  if (minAccessRole) {
    params.minAccessRole = minAccessRole;
  }

  const response = await calendar.calendarList.list(params);

  const calendars =
    response.data.items?.map((cal) => ({
      ...cal,
      isOwned: cal.accessRole === "owner",
      canEdit: ["owner", "writer"].includes(cal.accessRole),
      canRead: ["owner", "writer", "reader"].includes(cal.accessRole),
    })) || [];

  return NextResponse.json({
    ...response.data,
    items: calendars,
  });
}

async function getCalendar(calendar, calendarId) {
  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  const response = await calendar.calendarList.get({
    calendarId,
  });

  const cal = response.data;
  const enhancedCalendar = {
    ...cal,
    isOwned: cal.accessRole === "owner",
    canEdit: ["owner", "writer"].includes(cal.accessRole),
    canRead: ["owner", "writer", "reader"].includes(cal.accessRole),
  };

  return NextResponse.json(enhancedCalendar);
}

async function getCalendarColors(calendar) {
  const response = await calendar.colors.get();
  return NextResponse.json(response.data);
}

async function createCalendar(calendar, body) {
  const { summary, description, timeZone = "UTC", location } = body;

  if (!summary) {
    return NextResponse.json(
      { error: "Calendar summary (name) is required" },
      { status: 400 }
    );
  }

  // First create the calendar
  const calendarResource = {
    summary,
    description,
    timeZone,
    location,
  };

  const createResponse = await calendar.calendars.insert({
    requestBody: calendarResource,
  });

  const newCalendarId = createResponse.data.id;

  // Then add it to the user's calendar list
  const calendarListEntry = {
    id: newCalendarId,
    summary,
    description,
    timeZone,
    location,
    selected: true,
    accessRole: "owner",
  };

  const listResponse = await calendar.calendarList.insert({
    requestBody: calendarListEntry,
  });

  return NextResponse.json(listResponse.data);
}

// Subscribe to an existing calendar (add to calendar list)
async function subscribeToCalendar(calendar, body) {
  const {
    calendarId,
    summary, // Optional: custom name for the calendar
    colorId,
    selected = true,
    defaultReminders = [],
  } = body;

  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  const calendarListEntry = {
    id: calendarId,
    selected,
    defaultReminders,
  };

  if (summary) calendarListEntry.summary = summary;
  if (colorId) calendarListEntry.colorId = colorId;

  const response = await calendar.calendarList.insert({
    requestBody: calendarListEntry,
  });

  return NextResponse.json(response.data);
}

// Import calendar from iCal/ICS data
async function importCalendar(calendar, body) {
  const {
    calendarId = "primary",
    icsData, // iCal/ICS format data
    summary, // Optional: name for imported events
  } = body;

  if (!icsData) {
    return NextResponse.json(
      { error: "ICS data is required for import" },
      { status: 400 }
    );
  }

  const response = await calendar.events.import({
    calendarId,
    requestBody: {
      // This would need proper ICS parsing - simplified example
      summary: summary || "Imported Event",
      description: "Event imported from ICS data",
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
    },
  });

  return NextResponse.json(response.data);
}

// Update calendar properties
async function updateCalendar(calendar, body) {
  const { calendarId, summary, description, timeZone, location } = body;

  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  // Update the calendar itself
  const calendarResource = {};
  if (summary) calendarResource.summary = summary;
  if (description) calendarResource.description = description;
  if (timeZone) calendarResource.timeZone = timeZone;
  if (location) calendarResource.location = location;

  const response = await calendar.calendars.update({
    calendarId,
    requestBody: calendarResource,
  });

  return NextResponse.json(response.data);
}

// Update calendar list settings (user-specific settings)
async function updateCalendarSettings(calendar, body) {
  const {
    calendarId,
    summary, // Custom name for the calendar
    colorId,
    selected,
    hidden,
    defaultReminders,
    notificationSettings,
  } = body;

  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  const calendarListEntry = {};
  if (summary !== undefined) calendarListEntry.summary = summary;
  if (colorId !== undefined) calendarListEntry.colorId = colorId;
  if (selected !== undefined) calendarListEntry.selected = selected;
  if (hidden !== undefined) calendarListEntry.hidden = hidden;
  if (defaultReminders !== undefined)
    calendarListEntry.defaultReminders = defaultReminders;
  if (notificationSettings !== undefined)
    calendarListEntry.notificationSettings = notificationSettings;

  const response = await calendar.calendarList.update({
    calendarId,
    requestBody: calendarListEntry,
  });

  return NextResponse.json(response.data);
}

// Set calendar color
async function setCalendarColor(calendar, body) {
  const { calendarId, colorId } = body;

  if (!calendarId || !colorId) {
    return NextResponse.json(
      { error: "Calendar ID and color ID are required" },
      { status: 400 }
    );
  }

  const response = await calendar.calendarList.patch({
    calendarId,
    requestBody: {
      colorId,
    },
  });

  return NextResponse.json(response.data);
}

// Set calendar notifications
async function setCalendarNotifications(calendar, body) {
  const {
    calendarId,
    notifications = [], // Array of notification objects
  } = body;

  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  const response = await calendar.calendarList.patch({
    calendarId,
    requestBody: {
      notificationSettings: {
        notifications,
      },
    },
  });

  return NextResponse.json(response.data);
}

// Delete a calendar (only if owned)
async function deleteCalendar(calendar, calendarId) {
  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  if (calendarId === "primary") {
    return NextResponse.json(
      { error: "Cannot delete primary calendar" },
      { status: 400 }
    );
  }

  // First remove from calendar list
  await calendar.calendarList.delete({
    calendarId,
  });

  // Then delete the actual calendar (only works if user owns it)
  try {
    await calendar.calendars.delete({
      calendarId,
    });
  } catch (error) {
    // If can't delete calendar (not owned), that's okay - just removed from list
    console.log("Calendar removed from list but not deleted (not owned)");
  }

  return NextResponse.json({ message: "Calendar deleted successfully" });
}

// Unsubscribe from a calendar (remove from list)
async function unsubscribeFromCalendar(calendar, calendarId) {
  if (!calendarId) {
    return NextResponse.json(
      { error: "Calendar ID is required" },
      { status: 400 }
    );
  }

  if (calendarId === "primary") {
    return NextResponse.json(
      { error: "Cannot unsubscribe from primary calendar" },
      { status: 400 }
    );
  }

  await calendar.calendarList.delete({
    calendarId,
  });

  return NextResponse.json({
    message: "Unsubscribed from calendar successfully",
  });
}
