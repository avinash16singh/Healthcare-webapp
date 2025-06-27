import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index.js";


export const createMedicalRecordAction = createAsyncThunk('CREATE_RECORD', async (record) => {
    const response = await api.createMedicalRecordApi(record);
    return response.data;
});


export const updateMedicalRecordAction = createAsyncThunk('UPDATE_RECORD', async ({ id, record }) => {
  const response = await api.updateMedicalRecordApi(record, id);
  return response.data;
});


export const fetchMedicalRecordByApptIdAction = createAsyncThunk('FETCH_RECORD_BY_APPT_ID', async (apptId) => {
    const response = await api.fetchMedicalRecordByApptIdApi(apptId); 
    return { apptId, data: response.data };
});

export const fetchAllDoctorAppointmentsAction = createAsyncThunk('FETCH_ALL_DOCTOR_APPOINTMENTS', async (userId) => {
    const response = await api.fetchAllDoctorAppointmentsApi(userId, 'doctor'); 
    return response.data;
});


export const fetchAllDoctorModelAction = createAsyncThunk('FETCH_DOCTOR_MODEL', async (userId) => {
    const response = await api.fetchAllDoctorModelApi(userId); 
    return response.data;
});






const doctorSlice = createSlice(
    {
        name: "doctor_slice",
        initialState: {
            appointments: [],
            doctorModel: null,
            status: null,
        },
        reducers: {
            
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchAllDoctorAppointmentsAction.fulfilled, (state, action) => {
                    state.appointments = action.payload;
                    state.status = 'success';
                })
                .addCase(fetchAllDoctorModelAction.fulfilled, (state, action) => {
                    state.doctorModel = action.payload;
                })
        }
    }
);


export default doctorSlice.reducer;






// export const updatePostAction = createAsyncThunk('UPDATE_POST', async ({id, post}) => {
//     const response = await api.updatePostApi(id, post);
//     return response.data;
// });

// export const likePostAction = createAsyncThunk('LIKE_POST', async ({postId, userId}) => {
//     const response = await api.likePostApi(postId, userId);
//     return response.data;
// });

// export const deletePostAction = createAsyncThunk('DELETE_POST', async (id) => {
//     const response = await api.deletePostByIdApi(id);
//     return response.data;
// });

// const fetchPostByIdAction = createAsyncThunk('FETCH_POST', async (id) => {
//     const response = await api.fetchPostByIdApi(id);
//     return response.data;
// });


// .addCase(createPostAction.fulfilled, (state, action) => {
                //     state.posts = [...state.posts, action.payload];
                // })
                // .addCase(updatePostAction.fulfilled, (state, action) => {
                //     state.posts = state.posts.filter((post) => (post._id !== action.payload._id));
                //     state.posts = [...state.posts, action.payload];
                // })
                // .addCase(likePostAction.fulfilled, (state, action) => {
                //     state.posts = state.posts.filter((post) => (post._id !== action.payload._id));
                //     state.posts = [...state.posts, action.payload];
                // })
                // .addCase(deletePostAction.fulfilled, (state, action) => {
                //     state.posts = state.posts.filter((post) => (post._id !== action.payload._id));
                // })