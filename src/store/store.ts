import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './slices/loginSlice.ts';

const store = configureStore({
  reducer: {
    loginer: loginSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;
