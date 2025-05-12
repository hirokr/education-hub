// features/vote/voteApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const voteApi = createApi({
  reducerPath: "voteApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/community" }),
  tagTypes: ["Vote"],

  endpoints: (builder) => ({
    getVoteStatus: builder.query<
      { score: number; vote: { value: number } | null },
      { itemId: string; userId: string }
    >({
      query: ({ itemId, userId }) =>
        `vote/status?itemId=${itemId}&userId=${userId}`,
      providesTags: (_result, _error, { itemId }) => [
        { type: "Vote", id: itemId },
      ],
    }),

    submitVote: builder.mutation<
      any,
      { userId: string; itemId: string; type: string; value: 1 | -1 }
    >({
      query: (body) => ({
        url: "vote",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Vote", id: itemId },
      ],
    }),
  }),
});

export const { useGetVoteStatusQuery, useSubmitVoteMutation } = voteApi;
