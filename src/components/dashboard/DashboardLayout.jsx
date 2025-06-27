import { Routes, Route, Outlet } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { allRoutes } from "@/routes/allRoutes";

import { useDispatch, useSelector } from "react-redux";
import { setOpenConfigurator } from "@/redux/materialSlice";

export function DashboardLayout() {
  const dispatch = useDispatch();
  const sidenavType = useSelector((state) => state.material.sidenavType);
  const profile = JSON.parse(localStorage.getItem("profile"));
  const role = profile.user.role;
  //const role = 'patient'; // Or: useSelector((state) => state.auth.role)

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidebar
        role={role}
        brandImg={
          "/img/hospital.png"
        }
        brandName="Healium"
      />
      <div className="p-4 xl:ml-80">
        <Navbar />
        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => dispatch(setOpenConfigurator(true))}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}

        <Routes>
          {allRoutes[role].pages.map((page, index) => (
            <Route
              exact
              key={index}
              path={page.path}
              element={<page.element.type {...page.element.props} />}
            />
          ))}
        </Routes>
        <Outlet />

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
