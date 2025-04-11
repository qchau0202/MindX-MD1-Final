import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Test backend
export const testBackend = () => api.get("/");

// CRUD APIs
export const getCourses = () => api.get("/courses");
export const getUsers = () => api.get("/users");
export const getLessons = () => api.get("/lessons");
export const getEnrollments = () => api.get("/enrollments");

export default api;
