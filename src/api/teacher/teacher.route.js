import express from "express";
import TeacherController from "./teacher.controller.js";

const router = express.Router();

router.route("/").get(TeacherController.getTeachers);
router.route("/").post(TeacherController.addTeacher);
router.get("/:id", TeacherController.getTeacherById);
router.put("/:id", TeacherController.updateTeacher);
router.delete("/:id", TeacherController.deleteTeacher);

export default router;
