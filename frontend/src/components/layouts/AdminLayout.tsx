import { Navigate, Outlet, useNavigate } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";
import { Button } from "flowbite-react";
import Cookies from "universal-cookie";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();

  if (!loggedInUser || !loggedInUser.role || loggedInUser.role !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  function handleLogout() {
    const cookies = new Cookies();
    cookies.remove("loggedInUser");
    setLoggedInUser(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-md border-b-4 border-blue-400">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              🔐 Diyetisyen Takip Sistemi - Admin
            </h1>
            <p className="text-sm text-gray-600">
              Hoş geldiniz, <span className="font-semibold text-blue-400">{loggedInUser.fullName}</span>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-right mr-4 px-4 py-2 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaUser className="text-blue-400" />
                <span className="font-semibold">Admin</span>
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

      <div className="flex">
        <div className="w-64 bg-white shadow-md min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-semibold transition"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-semibold transition"
            >
              👥 Tüm Kullanıcılar
            </button>
            <button
              onClick={() => navigate("/admin/diet-plans")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-semibold transition"
            >
              📋 Tüm Diyet Planları
            </button>
            <button
              onClick={() => navigate("/admin/appointments")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-semibold transition"
            >
              📅 Tüm Randevular
            </button>
            <button
              onClick={() => navigate("/admin/recipes")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-semibold transition"
            >
              🍳 Tüm Tarifler
            </button>
            <button
              onClick={() => navigate("/admin/profile")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-semibold transition"
            >
              👤 Profil
            </button>
          </nav>
        </div>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
