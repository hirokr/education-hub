import { configureStore } from "@reduxjs/toolkit";
import { reviewApi } from "../features/review/reviewApi";
import { discussionApi } from "../features/discussion/discussionApi";
import { voteApi } from "@/features/vote/voteApi";
import { bookmarkApi } from "@/features/bookmark/bookmarkApi";
import { markedApi } from "@/features/marked/markedApi";

export const store = configureStore({
  reducer: {
    [discussionApi.reducerPath]: discussionApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [voteApi.reducerPath]: voteApi.reducer, // ← Add
    [bookmarkApi.reducerPath]: bookmarkApi.reducer,
    [markedApi.reducerPath]: markedApi.reducer, // Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(discussionApi.middleware)
      .concat(reviewApi.middleware)
      .concat(voteApi.middleware)
      .concat(bookmarkApi.middleware)
      .concat(markedApi.middleware), // Add this middleware for bookmarkApi
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
