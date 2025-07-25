import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const customBaseQuery = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = process.env.NEXT_PUBLIC_GOOGLE_ACCESS_TOKEN;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuth());

    if (typeof window !== "undefined") {
      window.location.href = "/api/auth";
    }
  }

  return result;
};
