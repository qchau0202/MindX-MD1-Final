import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header:", `Bearer ${token}`);
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

// Courses
export const getCourses = () => api.get("/courses");
export const getCategoryCounts = () => api.get("/courses/category-counts");
export const createCourse = (data) =>
  api.post("/courses/provider/create", data);
export const getCourseById = (id) => api.get(`/courses/${id}`);

// Users
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const getEnrollments = () => api.get("/users/enrollments");
export const enrollCourse = (data) => api.post("/users/enroll", data);
export const unenrollCourse = (data) => api.post("/users/unenroll", data);

// Lessons
export const getLessons = () => api.get("/lessons");

// Auth APIs
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getCurrentUser = () => api.get("/auth/me");

export default api;