import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import AppLayout from "../layout/AppLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import Lessons from "../pages/Lessons";
import Enrollments from "../pages/Enrollments";
import Profile from "../pages/Profile";
import Dashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/auth/NotFound";
import UsersManagement from "../pages/admin/UsersManagement";
import ProfileCourses from "../components/common/profile/ProfileCourses";
import CourseCreate from "../pages/CourseCreate";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/courses/:id",
        element: <CourseDetail />,
      },
      {
        path: "/lessons",
        element: <Lessons />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/mycourses",
        element: <ProfileCourses />,
      },
      {
        path: "/profile/provider/create",
        element: <CourseCreate />,
      },
      {
        path: "/enrollments",
        element: (
          <ProtectedRoute roles={["user", "admin"]}>
            <Enrollments />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <UsersManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <AppLayout>
        <NotFound />
      </AppLayout>
    ),
  },
]);

export default router;
