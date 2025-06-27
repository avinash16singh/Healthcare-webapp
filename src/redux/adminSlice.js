import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index.js";


export const fetchAllHospitalsAction = createAsyncThunk('FETCH_ALL_HOSPITALS', async () => {
    const response = await api.fetchAllHospitalsApi();
    return response.data;
});

export const createNewHospitalAction = createAsyncThunk('admin/createNewHospital', async (formObj) => {
    const response = await api.createNewHospitalApi(formObj);
    return response.data;
});

export const fetchGlobalAmbulancesAction = createAsyncThunk('FETCH_GLOBAL_AMBULANCES', async () => {
    const response = await api.fetchGlobalAmbulancesApi();
    return response.data;
});

const adminSlice = createSlice(
    {
        name: "admin_slice",
        initialState: {
            hospitals: [],
            hospitalAdmins: [],
            ambulances: [],
            status: null,
        },
        reducers: {
            
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchAllHospitalsAction.fulfilled, (state, action) => {
                    state.hospitals = action.payload;
                    state.status = "success";
                })
                .addCase(fetchGlobalAmbulancesAction.fulfilled, (state, action) => {
                    state.ambulances = action.payload;
                })
                .addCase(createNewHospitalAction.fulfilled, (state, action) => {
                    state.hospitals.push(action.payload.hospital);
                    state.hospitalAdmins.push(action.payload.admin);
                    state.status = "created";
                })

        }
    }
);

export default adminSlice.reducer;



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