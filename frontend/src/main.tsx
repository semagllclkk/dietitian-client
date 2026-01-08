import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import LoggedInUserContextProvider from "./components/auth/LoggedInUserContext.js";
import Login from "./components/Login.js";
import Register from "./components/auth/Register.js";
import AnonymousLayout from "./components/layouts/AnonymousLayout.js";
import AuthenticationLayout from "./components/layouts/AuthenticationLayout.js";
import DietitianLayout from "./components/layouts/DietitianLayout.js";
import ClientLayout from "./components/layouts/ClientLayout.js";
import AdminLayout from "./components/layouts/AdminLayout.js";
import DietitianDashboard from "./components/dietitian/DietitianDashboard.js";
import ClientDashboard from "./components/client/ClientDashboard.js";
import AdminDashboard from "./components/admin/AdminDashboard.js";
import AdminUsers from "./components/admin/AdminUsers.js";
import AdminDietPlans from "./components/admin/AdminDietPlans.js";
import AdminAppointments from "./components/admin/AdminAppointments.js";
import AdminRecipes from "./components/admin/AdminRecipes.js";
import DietitianDietPlans from "./components/dietitian/DietitianDietPlans.js";
import ClientDietPlans from "./components/client/ClientDietPlans.js";
import DietitianAppointments from "./components/dietitian/DietitianAppointments.js";
import ClientAppointments from "./components/client/ClientAppointments.js";
import DietitianClients from "./components/dietitian/DietitianClients.js";
import DietitianRecipes from "./components/dietitian/DietitianRecipes.js";
import ClientRecipes from "./components/client/ClientRecipes.js";
import Profile from "./components/shared/Profile.js";

const router = createBrowserRouter([
  {
    Component: AnonymousLayout,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    Component: AuthenticationLayout,
    children: [
      {
        path: "/dietitian",
        Component: DietitianLayout,
        children: [
          {
            path: "dashboard",
            Component: DietitianDashboard,
          },
          {
            path: "clients",
            Component: DietitianClients,
          },
          {
            path: "recipes",
            Component: DietitianRecipes,
          },
          {
            path: "diet-plans",
            Component: DietitianDietPlans,
          },
          {
            path: "appointments",
            Component: DietitianAppointments,
          },
          {
            path: "profile",
            Component: Profile,
          },
        ],
      },
      {
        path: "/client",
        Component: ClientLayout,
        children: [
          {
            path: "dashboard",
            Component: ClientDashboard,
          },
          {
            path: "recipes",
            Component: ClientRecipes,
          },
          {
            path: "diet-plans",
            Component: ClientDietPlans,
          },
          {
            path: "appointments",
            Component: ClientAppointments,
          },
          {
            path: "profile",
            Component: Profile,
          },
        ],
      },
      {
        path: "/admin",
        Component: AdminLayout,
        children: [
          {
            path: "dashboard",
            Component: AdminDashboard,
          },
          {
            path: "users",
            Component: AdminUsers,
          },
          {
            path: "diet-plans",
            Component: AdminDietPlans,
          },
          {
            path: "appointments",
            Component: AdminAppointments,
          },
          {
            path: "recipes",
            Component: AdminRecipes,
          },
          {
            path: "profile",
            Component: Profile,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoggedInUserContextProvider>
      <div className="bg-gradient-to-br from-lime-50 to-pink-50 min-h-screen">
        <Toaster richColors position="top-center" />
        <RouterProvider router={router} />
      </div>
    </LoggedInUserContextProvider>
  </StrictMode>
);