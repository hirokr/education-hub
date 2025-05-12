import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const discussionApi = createApi({
  reducerPath: "discussionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/community/" }),
  tagTypes: ["Discussion"],
  endpoints: (builder) => ({
    getDiscussions: builder.query({
      query: () => "discussion",
      providesTags: ["Discussion"],
    }),
    postDiscussion: builder.mutation({
      query: (discussionData) => ({
        url: "discussion",
        method: "POST",
        body: discussionData,
      }),
      invalidatesTags: ["Discussion"],
    }),
  }),
});

export const { useGetDiscussionsQuery, usePostDiscussionMutation } =
  discussionApi;
