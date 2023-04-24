import express from 'express'
import studentReportController from './report.controller.js';
const route = express.Router()
// const StudentController = require('../student/student.controller')
route.route("/").get(studentReportController.getStudentReportAPI);
route.route("/total").get(studentReportController.getStudentTotalReportAPI);



export default route