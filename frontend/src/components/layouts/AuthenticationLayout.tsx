import { Navigate, Outlet, useNavigate } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";
import { Button } from "flowbite-react";
import Cookies from "universal-cookie";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const AuthenticationLayout = () => {
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();
  
  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }
  
  if (!loggedInUser.role || !["DIYETISYEN", "DANISAN", "ADMIN"].includes(loggedInUser.role)) {
    const cookies = new Cookies();
    cookies.remove("loggedInUser");
    setLoggedInUser(null);
    return <Navigate to="/login" />;
  }

  function handleLogout() {
    const cookies = new Cookies();
    cookies.remove("loggedInUser");
    setLoggedInUser(null);
    navigate("/login");
  }

  return (
    <>
      {loggedInUser.role !== "ADMIN" && (
        <div className="bg-white shadow-md border-b-4 border-lime-400">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                🥗 Diyetisyen Takip Sistemi
              </h1>
              <p className="text-sm text-gray-600">
                Hoş geldiniz, <span className="font-semibold text-lime-400">{loggedInUser.fullName}</span>
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="text-right mr-4 px-4 py-2 rounded-lg bg-pink-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUser className="text-pink-400" />
                  <span className="font-semibold">
                    {loggedInUser.role === "DIYETISYEN" ? "Diyetisyen" : "Danışan"}
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                className="bg-pink-100 text-red-700 hover:bg-pink-200 hover:shadow-lg transition-all duration-300 font-semibold"
                size="sm"
              >
                <FaSignOutAlt className="mr-2" /> Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={loggedInUser.role !== "ADMIN" ? "container mx-auto px-4 py-8" : ""}>
        <Outlet />
      </div>
    </>
  );
};

export default AuthenticationLayout;
