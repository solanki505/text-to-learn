import express from "express";
import {
  generateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/generate", generateCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);

export default router;
