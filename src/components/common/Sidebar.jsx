import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";
import { setOpenSidenav } from "@/redux/materialSlice";
import { getRoutesForRole } from "@/utils/roleUtils";

export function Sidenav({ role, brandImg, brandName }) {
  const dispatch = useDispatch();
  const { sidenavType, openSidenav } = useSelector((state) => state.material);
  const routes = getRoutesForRole(role);

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
    white: "bg-white shadow-sm text-blue-gray-700",
    transparent: "bg-transparent text-blue-gray-700",
  };

  const isDark = sidenavType === "dark";

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      {/* Brand Header */}
      <div className="relative">
        <Link to="/" className="py-6 px-8 flex gap-x-2 items-center text-center">
          {brandImg && (
            <img src={brandImg} alt="brand-logo" className="h-10 mb-2" />
          )}
          <Typography variant="h6" color={"blue-gray"}>
            {brandName}
          </Typography>
        </Link>

        {/* Mobile Close Button */}
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => dispatch(setOpenSidenav(false))}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      {/* Navigation Items */}
      <div className="m-4">
        {routes.pages.map(({ icon, name, path }) => (
          <ul key={name} className="mb-2">
            <li>
              <NavLink to={path}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : isDark
                        ? "hover:bg-gray-700 hover:text-white"
                        : "hover:bg-blue-gray-50 hover:text-blue-900"
                    }`}
                  >
                    <div className="text-lg">{icon}</div>
                    <Typography
                      variant="small"
                      className={`capitalize ${
                        isActive ? "text-blue-700" : ""
                      }`}
                    >
                      {name}
                    </Typography>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/hospital.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  role: PropTypes.string.isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
