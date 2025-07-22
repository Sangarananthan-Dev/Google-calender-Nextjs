import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export function getCalendarInstance(tokens) {
  oauth2Client.setCredentials(tokens);
  return google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
}

export function getTokensFromRequest(req, body = null) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.substring(7);
    return { access_token: accessToken };
  }

  if (body?.tokens) {
    return body.tokens;
  }

  return null;
}
