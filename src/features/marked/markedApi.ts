import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Content {
  id: string;
  title: string;
  content: string;
  author: string
  rating: number;
  authorId: string;
  category: string;
}
export const markedApi = createApi({
  reducerPath: "markApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/community" }),
  endpoints: (builder) => ({
    addBookmark: builder.mutation<
      void,
      { userId: string; itemId: string; type: "discussion" | "review" }
    >({
      query: ({ userId, itemId, type }) => ({
        url: `/bookmarked`,
        method: "POST",
        body: { userId, itemId, type },
      }),
    }),

    removeBookmark: builder.mutation<
      void,
      { userId: string; itemId: string; type: "discussion" | "review" }
    >({
      query: ({ userId, itemId, type }) => ({
        url: `/bookmarked`,
        method: "DELETE",
        body: { userId, itemId, type },
      }),
    }),

    getBookmarks: builder.query<
      {
        id: string;
        itemId: string;
        type: string;
        userId: string;
        createdAt: string;
        author: { name: string; email: string; id: string }; // Add author details
        content: Content; // Update this to the correct Content type
        category: string;
        title: string;
      }[],
      string
    >({
      query: (userId) => `/bookmarked?userId=${userId}`,
    }),

    checkBookmark: builder.query<
      { bookmarked: boolean },
      { userId: string; itemId: string; type: "discussion" | "review" }
    >({
      query: ({ userId, itemId, type }) =>
        `/bookmarked/status?userId=${userId}&itemId=${itemId}&type=${type}`,
    }),
  }),
});

export const {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useGetBookmarksQuery,
  useCheckBookmarkQuery,
} = markedApi;
