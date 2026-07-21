import { createSlice } from '@reduxjs/toolkit';

interface ConnectivityState {
  apiUnreachable: boolean;
}

const initialState: ConnectivityState = { apiUnreachable: false };

const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState,
  reducers: {
    apiUnreachableDetected(state) {
      state.apiUnreachable = true;
    },
    apiReachableRestored(state) {
      state.apiUnreachable = false;
    },
  },
});

export const { apiUnreachableDetected, apiReachableRestored } = connectivitySlice.actions;
export default connectivitySlice.reducer;
