import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { SignIn, SignUp } from "./pages/auth";
import { allRoutes } from "./routes/allRoutes";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LandingPage from "./components/common/LandingPage";

function App() {
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Return the first page route based on user role
  const getFirstPagePath = (role) => {
    return allRoutes[role]?.pages?.[0]?.path || "/auth/sign-in";
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("profile");
    setProfile(null);
    navigate("/");
  };

  // Token validation and redirect logic
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    const token = storedProfile?.token;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          handleLogout();
        } else {
          setProfile(storedProfile);
        }
      } catch (e) {
        handleLogout();
      }
    } else {
     // Allow unauthenticated access to public pages like "/"
    const publicPaths = ["/", "/auth/sign-in", "/auth/sign-up"];
    if (!publicPaths.includes(location.pathname)) {
      handleLogout();
    }
    }
  }, [location.pathname]);

  // Root "/" redirect
  useEffect(() => {
    if (profile?.user?.role && location.pathname === "/") {
      navigate(getFirstPagePath(profile.user.role), { replace: true });
    }
  }, [profile, location.pathname, navigate]);

  return (
    <Routes>
      {/* Public Auth Routes */}
     <Route
      path="/"
      element={
        profile ? (
          <Navigate to={getFirstPagePath(profile.user.role)} replace />
        ) : (
          <LandingPage />
        )
      }
    />

      <Route
        path="/auth/sign-in"
        element={
          profile ? (
            <Navigate to={getFirstPagePath(profile.user.role)} replace />
          ) : (
            <SignIn />
          )
        }
      />
      <Route
        path="/auth/sign-up"
        element={
          profile ? (
            <Navigate to={getFirstPagePath(profile.user.role)} replace />
          ) : (
            <SignUp />
          )
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          {allRoutes.centralAdmin.pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Route>

        <Route path="/hospital" element={<DashboardLayout />}>
          {allRoutes.hospitalAdmin.pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Route>

        <Route path="/doctor" element={<DashboardLayout />}>
          {allRoutes.doctor.pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Route>

        <Route path="/patient" element={<DashboardLayout />}>
          {allRoutes.patient.pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Route>

         <Route path="/driver" element={<DashboardLayout />}>
          {allRoutes.ambulanceDriver.pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Route>
      </Route>


     

    {/* Catch-All Redirect */}
    <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      
    </Routes>
  );
}

export default App;
