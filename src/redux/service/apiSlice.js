import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: customBaseQuery,
  tagTypes: ["Events"],
  endpoints: (builder) => ({}),
});
