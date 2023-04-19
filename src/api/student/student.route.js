import express from 'express'
import StudentController from './student.controller.js'
const studentRouter = express.Router()
// const StudentController = require('../student/student.controller')

studentRouter.route("/").get(StudentController.getAllStudent);
studentRouter.route("/").post(StudentController.createStudent);
studentRouter.get("/:id", StudentController.getStudentById);
studentRouter.put("/:id", StudentController.updateStudent);
studentRouter.delete("/:id", StudentController.deleteStudent);

export default studentRouter
