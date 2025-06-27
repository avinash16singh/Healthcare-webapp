import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index.js";

export const signUpAction = createAsyncThunk('SIGN_UP', async (formData) => {
    console.log(`signUpAction - ${formData}`);
    const { data } = await api.signUpApi(formData);
    return data;
});

export const signInAction = createAsyncThunk('SIGN_IN', async (formObj) => {
    const { data } = await api.signInApi(formObj);
    console.log(`signInAction - ${formObj}`);
    return data;
});

const userSlice = createSlice(
    {
        name: "user_slice",
        initialState: {userdata: null},
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(signUpAction.fulfilled, (state, action) => {
                    localStorage.setItem("profile", JSON.stringify(action.payload));
                    state.userdata = action.payload;
                })
                .addCase(signInAction.fulfilled, (state, action) => {
                    localStorage.setItem("profile", JSON.stringify(action.payload));
                    state.userdata = action.payload;
                })
        }
    }
);

export default userSlice.reducer;