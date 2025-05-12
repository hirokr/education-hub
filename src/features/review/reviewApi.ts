import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/community/" }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query<any[], void>({
      query: () => "review",
      providesTags: ["Review"],
    }),
    addReview: builder.mutation<any, any>({
      query: (newReview) => ({
        url: "review",
        method: "POST",
        body: newReview,
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const { useGetReviewsQuery, useAddReviewMutation } = reviewApi;
