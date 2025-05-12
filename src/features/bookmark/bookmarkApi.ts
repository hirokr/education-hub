import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type BookmarkStatusResponse = { bookmarked: boolean };
type ToggleBookmarkResponse = { bookmarked: boolean };

export const bookmarkApi = createApi({
  reducerPath: "bookmarkApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/community" }),
  tagTypes: ["Bookmark"],
  endpoints: (builder) => ({
    getBookmarkStatus: builder.query<
      BookmarkStatusResponse,
      { userId: string; itemId: string; type: string }
    >({
      query: ({ userId, itemId, type }) =>
        `/bookmark/status?userId=${userId}&itemId=${itemId}&type=${type}`,
      providesTags: (result, error, { itemId }) => [
        { type: "Bookmark", id: itemId },
      ],
    }),
    toggleBookmark: builder.mutation<
      ToggleBookmarkResponse,
      { userId: string; itemId: string; type: string }
    >({
      query: (body) => ({
        url: "/bookmark",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "Bookmark", id: itemId },
      ],
    }),
  }),
});

export const { useGetBookmarkStatusQuery, useToggleBookmarkMutation } =
  bookmarkApi;
