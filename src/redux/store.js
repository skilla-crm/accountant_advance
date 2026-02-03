
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { billsApiActions } from './ordersApiActions';
//slice
import filtersSlice from './filters/slice';
import positionsSlice from './positions/slice';
import mainInfoSlice from './mainInfo/slice';
import validationSlice from './validation/slice';
import userSlice from './user/slice';
import dateRangeSlice from './dateRange/slice';
import logsSlice from './logs/slice';
import updateDataSlice from './updateData/slice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    filters: filtersSlice,
    positions: positionsSlice,
    mainInfo: mainInfoSlice,
    validation: validationSlice,
    dateRange: dateRangeSlice,
    logs: logsSlice,
    updateData: updateDataSlice,
    [billsApiActions.reducerPath]: billsApiActions.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }).concat(billsApiActions.middleware)
});

setupListeners(store.dispatch);
