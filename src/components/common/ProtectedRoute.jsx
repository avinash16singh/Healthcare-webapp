import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { allRoutes } from "../../routes/allRoutes";

const ProtectedRoute = () => {
  const location = useLocation();
  const [allowed, setAllowed] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/auth/sign-in");

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    const token = storedProfile?.token;
    const role = storedProfile?.user?.role;

    if (!token || !role) {
      setAllowed(false);
      setRedirectPath("/auth/sign-in");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("profile");
        setAllowed(false);
        setRedirectPath("/auth/sign-in");
        return;
      }

      const allowedPaths = allRoutes[role]?.pages.map((p) => p.path) || [];
      const currentPath = location.pathname;

      if (!allowedPaths.includes(currentPath)) {
        setAllowed(false);
        setRedirectPath(allowedPaths[0] || "/auth/sign-in");
      } else {
        setAllowed(true);
      }
    } catch (error) {
      setAllowed(false);
      setRedirectPath("/auth/sign-in");
    }
  }, [location.pathname]);

  if (allowed === null) return null; // or loading spinner

  return allowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
