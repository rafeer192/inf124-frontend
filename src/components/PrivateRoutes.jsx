import { useContext } from "react";
import { AccountContext } from "./AccountContext";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const PrivateRoutes = () => {
  const { user } = useContext(AccountContext);
  const location = useLocation();

  /*
    null = initial, checking
    true = authenticated
    false = not authenticated
  */
  if (user && user.loggedIn === null) { 
    return null; // show nothing while loading
  }

  return user?.loggedIn ? (
    <Outlet /> // allow access to private routes
  ) : (
    <Navigate to="/" state={{ from: location }} replace /> // leads user to landing page when accessing private
    // pages while unauthorized
  );
};

export default PrivateRoutes;
