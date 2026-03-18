import axios from "axios";

const API = axios.create({ baseURL: "/api" });

export const generateCourse = (topic)  => API.post("/courses/generate", { topic });
export const getAllCourses  = ()        => API.get("/courses");
export const getCourse     = (id)      => API.get(`/courses/${id}`);
export const deleteCourse  = (id)      => API.delete(`/courses/${id}`);
export const getLesson     = (id)      => API.get(`/lessons/${id}`);
export const generateLesson = (id)     => API.post(`/lessons/${id}/generate`);
