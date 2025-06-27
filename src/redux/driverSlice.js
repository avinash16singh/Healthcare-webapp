import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index.js";

export const fetchDriverModelByUserIdAction = createAsyncThunk('FETCH_DRIVER_MODEL', async (id) => {
    const response = await api.fetchDriverModelByUserIdApi(id);
    return response.data;
});

// ✅ Accept Emergency
export const acceptEmergencyAction = createAsyncThunk(
  "driver/acceptEmergency",
  async (formObj) => {
      const response = await api.acceptEmergencyApi(formObj);
      return response.data; // will include updated emergency or status
  }
);

export const fetchMyActiveEmergencyAction = createAsyncThunk(
  'FETCH_ACTIVE_EMERGENCY_BY_DRIVER',
  async (userId) => {
    const res = await api.fetchMyActiveEmergencyApi(userId);  // create this API helper
    return res.data;
  }
);

export const fetchPastEmergenciesAction = createAsyncThunk(
  'FETCH_PAST_EMERGENCY_BY_DRIVER',
  async (userId) => {
    const res = await api.fetchPastEmergenciesApi(userId);  // create this API helper
    return res.data;
  }
);

export const fetchUnclaimedEmergenciesAction = createAsyncThunk(
  'fetchUnclaimedEmergenciesAction',
  async (userId) => {
    const res = await api.fetchUnclaimedEmergenciesApi();  // create this API helper
    return res.data;
  }
);

// ✅ Initial state
const initialState = {
  acceptedEmergencies: [],
  driver: null,
  status: null,
  error: null,
  emergency: null,
};

const driverSlice = createSlice({
  name: "driver_slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(acceptEmergencyAction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(acceptEmergencyAction.fulfilled, (state, action) => {
        state.status = "success";
        state.acceptedEmergencies.push(action.payload); // store accepted emergency
      })
      .addCase(acceptEmergencyAction.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(fetchDriverModelByUserIdAction.fulfilled, (state, action) => {
        state.driver = action.payload;
      })
      .addCase(fetchMyActiveEmergencyAction.fulfilled, (state, action) => {
        state.emergency = action.payload;
        })
  },
});

export default driverSlice.reducer;
