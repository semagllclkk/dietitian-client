import { Navigate, Outlet } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";
import { NavLink } from "react-router";
import { FaClipboardList, FaCalendarAlt, FaHome, FaBook, FaUser } from "react-icons/fa";

const ClientLayout = () => {
  const { loggedInUser } = useLoggedInUsersContext();

  if (!loggedInUser?.role || loggedInUser.role !== "DANISAN") {
    return <Navigate to={loggedInUser ? "/login" : "/login"} />;
  }

  const navLinks = [
    { to: "/client/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/client/recipes", label: "Önerilen Tarifler", icon: <FaBook /> },
    { to: "/client/diet-plans", label: "Diyet Planlarım", icon: <FaClipboardList /> },
    { to: "/client/appointments", label: "Randevularım", icon: <FaCalendarAlt /> },
    { to: "/client/profile", label: "Profil", icon: <FaUser /> },
  ];

  return (
    <div className="flex gap-6">
      <div className="w-64 bg-white rounded-xl shadow-xl p-4 h-fit sticky top-8 border-2 border-pink-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-pink-400">
          💕 Danışan Paneli
        </h2>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                  ? "bg-pink-200 text-red-700 font-semibold shadow-md"
                  : "bg-transparent text-gray-600 hover:shadow-sm"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;