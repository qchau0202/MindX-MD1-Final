import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AdminLayout from "./layout/AdminLayout";
import AuthLayout from "./layout/AuthLayout";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Users from "./pages/users/Users";
import Courses from "./pages/courses/Courses";
import CourseDetail from "./pages/courses/CourseDetail"; // Thêm import
import Lessons from "./pages/lessons/Lessons";
import Enrollments from "./pages/enrollments/Enrollments";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/notfound/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/courses"
            element={
              <AppLayout>
                <Courses />
              </AppLayout>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <AppLayout>
                <CourseDetail />
              </AppLayout>
            }
          />
          <Route
            path="/lessons"
            element={
              <AppLayout>
                <Lessons />
              </AppLayout>
            }
          />
          <Route
            path="/enrollments"
            element={
              <AppLayout>
                <Enrollments />
              </AppLayout>
            }
          />
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
