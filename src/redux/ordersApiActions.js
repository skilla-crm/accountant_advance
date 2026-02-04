import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const token = document.getElementById('root_advance')?.getAttribute('token');
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
        url: `advance_invoices`,
        method: 'GET',
        params
      }),
      transformResponse: (response) => response?.data,
      providesTags: ['Bills']
    }),

    getBill: build.query({
      query: (id) => ({
        url: `advance_invoices/detail/${id}`,
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
        url: `advance_invoices/create`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    updateBill: build.mutation({
      query: ({ body, id }) => ({
        url: `advance_invoices/update/${id}`,
        method: 'PATCH',
        body: body
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    deleteBill: build.mutation({
      query: (id) => ({
        url: `advance_invoices/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bills']
    }),

    sendBill: build.mutation({
      query: ({ body, id }) => ({
        url: `advance_invoices/send/${id}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

    getBillDownload: build.mutation({
      query: ({ id, params }) => ({
        url: `advance_invoices/download/${id}`,
        method: 'GET',
        params,
        responseHandler: (response) => {
          return response.blob();
        }
      }),
      invalidatesTags: ['Bill', 'Bills']
    }),

 

   

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
