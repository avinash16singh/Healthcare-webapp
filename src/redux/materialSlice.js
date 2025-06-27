import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openSidenav: true,
  sidenavColor: "dark",
  sidenavType: "white",
  transparentNavbar: true,
  fixedNavbar: false,
  openConfigurator: false,
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    setOpenSidenav: (state, action) => {
      state.openSidenav = action.payload;
    },
    setSidenavType: (state, action) => {
      state.sidenavType = action.payload;
    },
    setSidenavColor: (state, action) => {
      state.sidenavColor = action.payload;
    },
    setTransparentNavbar: (state, action) => {
      state.transparentNavbar = action.payload;
    },
    setFixedNavbar: (state, action) => {
      state.fixedNavbar = action.payload;
    },
    setOpenConfigurator: (state, action) => {
      state.openConfigurator = action.payload;
    },
  },
});

export const {
  setOpenSidenav,
  setSidenavType,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
} = materialSlice.actions;

export default materialSlice.reducer;
