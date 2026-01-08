import { Navigate, Outlet } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.tsx";

const AnonymousLayout = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  
  if (loggedInUser) {
    if (loggedInUser.role === "DIYETISYEN") {
      return <Navigate to="/dietitian/dashboard" />;
    } else if (loggedInUser.role === "DANISAN") {
      return <Navigate to="/client/dashboard" />;
    } else if (loggedInUser.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-pink-50 flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AnonymousLayout;