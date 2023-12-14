import { Navigate, Outlet } from "react-router-dom"
import useAuthStatus from '../hooks/UseAuthStatus'
import Spinner from "./spinner";

const PrivateRoute = () => {
  
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner/>;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute
