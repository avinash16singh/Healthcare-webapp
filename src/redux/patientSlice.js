import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index.js";

export const createAppointmentAction = createAsyncThunk('CREATE_APPOINTMENT', async (appointment) => {
    const response = await api.createAppointmentApi(appointment);
    return response.data;
});

export const fetchAllPatientAppointmentsAction = createAsyncThunk('FETCH_ALL_PATIENT_APPOINTMENTS', async (userId) => {
    const response = await api.fetchAllPatientAppointmentsApi(userId, 'patient');
    return response.data;
});

export const fetchMyRecordsAction = createAsyncThunk('FETCH_MY_RECORDS', async (userId) => {
    const response = await api.fetchMyRecordsApi(userId);
    return response.data;
});

export const createNewEmergencyAction = createAsyncThunk('patient/emergency/create-new', async (formObj) => {
    const response = await api.createNewEmergencyApi(formObj);  // Make sure to call the correct API
    return response.data;
});

export const fetchEmergencyModelAction = createAsyncThunk('FETCH_EMERGENCY_MODEL', async (emergencyId) => {
    const response = await api.fetchEmergencyModelApi(emergencyId);
    return response.data;
});

export const fetchActiveEmergencyByUserId = createAsyncThunk(
  'FETCH_ACTIVE_EMERGENCY_BY_USER',
  async (userId) => {
    const res = await api.fetchActiveEmergencyByUserApi(userId);  // create this API helper
    return res.data;
  }
);

const patientSlice = createSlice({
    name: "patient_slice",
    initialState: {
        appointments: [],
        emergency: null,
        records: [],
        status: null,  // Ensure status is defined in the initial state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAppointmentAction.fulfilled, (state, action) => {
                state.appointments.push(action.payload.appointment);
            })
            .addCase(fetchAllPatientAppointmentsAction.fulfilled, (state, action) => {
                state.appointments = action.payload;
                state.status = 'success';
            })
            .addCase(fetchMyRecordsAction.fulfilled, (state, action) => {
                state.records = action.payload;
                state.status = 'success';
            })
            .addCase(createNewEmergencyAction.fulfilled, (state, action) => {
                // Handle emergency creation success
                state.status = 'emergency_created'; // Example status for emergency
            })
            .addCase(createNewEmergencyAction.rejected, (state, action) => {
                state.status = 'error'; // Example error handling
            })
            
            .addCase(fetchEmergencyModelAction.fulfilled, (state, action) => {
                //state.emergency = action.payload;
            })
            .addCase(fetchActiveEmergencyByUserId.fulfilled, (state, action) => {
                state.emergency = action.payload;
            })
    }
});

export default patientSlice.reducer;
