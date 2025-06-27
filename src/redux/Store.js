import { configureStore } from "@reduxjs/toolkit";
import materialReducer from "./materialSlice";
import userSlice from './userSlice';
import adminSlice from './adminSlice';
import hospitalSlice from './hospitalSlice';
import patientSlice from './patientSlice';
import doctorSlice from './doctorSlice';
import driverSlice from './driverSlice';

export const store = configureStore({
  reducer: {
    material: materialReducer,
    user_slice: userSlice,
    admin_slice: adminSlice,
    hospital_slice: hospitalSlice,
    patient_slice: patientSlice,
    doctor_slice: doctorSlice,
    driver_slice: driverSlice
  },
});
