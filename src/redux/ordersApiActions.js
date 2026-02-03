import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const token = document.getElementById('root_bills')?.getAttribute('token');
const baseURL = process.env.REACT_APP_BASE_URL;

export const billsApiActions = createApi({
  reducerPath: 'billsApiActions',
  tagTypes: ['Bill', 'Bills'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? token : '',
      Accept: 'application/json'
    }
  }),
  endpoints: (build) => ({

    getBills: build.query({
      query: (params) => ({
        url: `bills`,
        method: 'GET',
        params
      }),
      transformResponse: (response) => response?.data,
      providesTags: ['Bills']
    }),

    getBill: build.query({
      query: (id) => ({
        url: `bills/detail/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.data,
      providesTags: ['Bill']
    }),

    getParameters: build.query({
      query: () => ({
        url: `parameters`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.data
    }),

    createBill: build.mutation({
      query: (body) => ({
        url: `bills/create`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    updateBill: build.mutation({
      query: ({ body, id }) => ({
        url: `bills/update/${id}`,
        method: 'PATCH',
        body: body
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    deleteBill: build.mutation({
      query: (id) => ({
        url: `bills/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bills']
    }),

    sendBill: build.mutation({
      query: ({ body, id }) => ({
        url: `bills/send/${id}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    getBillDownload: build.mutation({
      query: ({ id, params }) => ({
        url: `bills/download/${id}`,
        method: 'GET',
        params,
        responseHandler: (response) => {
          return response.blob();
        }
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    createUpdByBill: build.mutation({
      query: (body) => ({
        url: `upd/create_by_bill`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Bills']
    }),

    createActByBill: build.mutation({
      query: (body) => ({
        url: `acts/create_by_bill`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Bills']
    })

  })
});

export const {
  useGetBillsQuery,
  useGetBillQuery,
  useGetParametersQuery,
  useCreateBillMutation,
  useCreateUpdByBillMutation,
  useCreateActByBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
  useSendBillMutation,
  useGetBillDownloadMutation
} = billsApiActions;
