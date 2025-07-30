import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const customBaseQuery = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      if (typeof document !== "undefined") {
        const cookies = document.cookie
          .split("; ")
          .find((row) => row.startsWith("google_access_token"));

        const token = cookies?.split("=")[1];
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  // if (result.error && result.error.status === 401) {
  //   if (typeof window !== "undefined") {
  //     window.location.href = "/api/auth";
  //   }
  // }

  return result;
};
