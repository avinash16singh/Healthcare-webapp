import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

import { useDispatch, useSelector } from "react-redux";
import { setOpenSidenav } from "@/redux/materialSlice";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fixedNavbar = useSelector((state) => state.material.fixedNavbar);
  const openSidenav = useSelector((state) => state.material.openSidenav);
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    setProfile(storedProfile);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("profile");
    setProfile(null);
    navigate("/auth/sign-up");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        {/* Breadcrumb + Page title */}
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                className="font-normal opacity-60 hover:opacity-100 transition-all text-blue-500"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>

        {/* Actions: toggle, auth, etc. */}
        <div className="flex items-center gap-4">
          {/* Sidenav toggle for mobile */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => dispatch(setOpenSidenav(!openSidenav))}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Auth controls */}
          {profile ? (
            <div className="flex items-center gap-2">
              <Typography variant="small" className="font-normal text-blue-gray-600">
                Hi, {profile?.user?.name}
              </Typography>
              <Button
                variant="text"
                color="blue"
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 normal-case"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth/sign-in">
              <Button
                variant="outlined"
                color="blue"
                className="hidden xl:flex items-center gap-1 px-4 normal-case"
              >
                <UserCircleIcon className="h-5 w-5" />
                Sign In
              </Button>
              <IconButton variant="text" color="blue-gray" className="grid xl:hidden">
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
