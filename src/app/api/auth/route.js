import { google } from "googleapis";
import { cookies } from "next/headers";

const authClient = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

const scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar",
];

export const getAccessToken = async (code) => {
  const { tokens } = await authClient.getToken(code);
  authClient.setCredentials(tokens);
  return tokens;
};
export const getGoogleUserInfo = async (access_token) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const data = await res.json();
  return data;
};

export async function GET(req) {
  const url = authClient.generateAuthUrl({
    access_type: "offline",
    scope: scope,
  });
  return Response.redirect(url, 302);
}

export async function POST(req) {
  const { code } = await req.json();
  const tokens = await getAccessToken(code);
  await cookies().set("google_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  const userInfo = await getGoogleUserInfo(tokens.access_token);

  return new Response(JSON.stringify({ tokens, userInfo }), { status: 200 });
}
