import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@myStore/store';

// Define a type for the slice state
interface LoginState {
  value: 'login' | 'logout';
}

// Define the initial state using that type
const initialState: LoginState = {
  value: 'logout'
};

export const loginSlice = createSlice({
  name: 'loginer',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loginAction: state => {
      state.value = 'login';
    },
    logoutAction: state => {
      state.value = 'logout';
    }
  }
});

export const { loginAction, logoutAction } = loginSlice.actions;
export const selectLogin = (state: RootState) => state.loginer.value;

export default loginSlice.reducer;
