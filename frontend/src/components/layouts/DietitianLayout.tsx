import { Navigate, Outlet } from "react-router";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";
import { NavLink } from "react-router";
import { FaClipboardList, FaCalendarAlt, FaUsers, FaHome, FaBook, FaUser } from "react-icons/fa";

const DietitianLayout = () => {
  const { loggedInUser } = useLoggedInUsersContext();

  if (!loggedInUser?.role || loggedInUser.role !== "DIYETISYEN") {
    return <Navigate to={loggedInUser ? "/login" : "/login"} />;
  }

  const navLinks = [
    { to: "/dietitian/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/dietitian/clients", label: "Danışanlarım", icon: <FaUsers /> },
    { to: "/dietitian/recipes", label: "Tariflerim", icon: <FaBook /> },
    { to: "/dietitian/diet-plans", label: "Diyet Planları", icon: <FaClipboardList /> },
    { to: "/dietitian/appointments", label: "Randevular", icon: <FaCalendarAlt /> },
    { to: "/dietitian/profile", label: "Profil", icon: <FaUser /> },
  ];

  return (
    <div className="flex gap-6">
      <div className="w-64 bg-white rounded-xl shadow-xl p-4 h-fit sticky top-8 border-2 border-lime-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-lime-400">
          🩺 Diyetisyen Paneli
        </h2>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                  ? "bg-lime-400 text-gray-800 font-semibold shadow-md"
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

export default DietitianLayout;