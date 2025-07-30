import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiService } from "./service/apiSlice";
import calendarColorsReducer from "@/redux/features/calendarColors/calendarColorsSlice";
const rootReducer = combineReducers({
  calendarColors: calendarColorsReducer,
  [apiService.reducerPath]: apiService.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});

setupListeners(store.dispatch);

export default store;
