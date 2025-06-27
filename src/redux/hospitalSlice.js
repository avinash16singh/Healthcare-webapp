import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index.js";


export const fetchAllDoctorsAction = createAsyncThunk('FETCH_ALL_DOCTORS', async (id) => {
    const response = await api.fetchAllDoctorsApi(id);
    return response.data;
});

export const createNewDoctorAction = createAsyncThunk('CREATE_NEW_DOCTOR', async (doctor) => {
    const response = await api.createNewDoctorApi(doctor);
    return response.data.doctor;
});

export const fetchHospitalModelByUserIdAction = createAsyncThunk('FETCH_HOSPITAL_MODEL', async (id) => {
    const response = await api.fetchHospitalModelByUserIdApi(id);
    return response.data;
});


export const fetchAllAmbulancesAction = createAsyncThunk('FETCH_ALL_AMBULANCES', async (id) => {
    const response = await api.fetchAllAmbulancesApi(id);
    return response.data;
});

export const createNewAmbulanceAction = createAsyncThunk('CREATE_NEW_AMBULANCE', async (ambulance) => {
    const response = await api.createNewAmbulanceApi(ambulance);
    return response.data.ambulanceDriver;
});


export const fetchAllAppointemnetsAction = createAsyncThunk('FETCH_ALL_APPOINTMENTS', async (id) => {
    const response = await api.fetchAllAppointmentsApi(id);
    return response.data;
});

const hospitalSlice = createSlice(
    {
        name: "hospital_slice",
        initialState: {
            hospital: null,
            ambulances: [],
            appointments: [],
            adminId: null,
            hospitalId: null,
            doctors: [],
            status: null,
        },
        reducers: {
            
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchHospitalModelByUserIdAction.fulfilled, (state, action) => {
                    state.hospital = action.payload;
                    state.hospitalId = action.payload._id;
                    //state.status = "success";
                })
                .addCase(fetchAllDoctorsAction.pending, (state) => {
                    state.status = "loading";
                    })
                    .addCase(fetchAllDoctorsAction.fulfilled, (state, action) => {
                    state.doctors = action.payload;
                    state.status = "succeeded";
                    })
                    .addCase(fetchAllDoctorsAction.rejected, (state) => {
                    state.status = "failed";
                    })

                .addCase(createNewDoctorAction.fulfilled, (state, action) => {
                    state.doctors.push(action.payload);
                })
                .addCase(fetchAllAmbulancesAction.fulfilled, (state, action) => {
                    state.ambulances = action.payload;
                })
                .addCase(createNewAmbulanceAction.fulfilled, (state, action) => {
                    state.ambulances.push(action.payload);
                })
                .addCase(fetchAllAppointemnetsAction.fulfilled, (state, action) => {
                    state.appointments = action.payload;
                })
        }
    }
);

export default hospitalSlice.reducer;



// export const createPostAction = createAsyncThunk('CREATE_POST', async (post) => {
//     const response = await api.createPostApi(post);
//     return response.data;
// });

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