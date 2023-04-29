import express from 'express'
import studentReportController from './report.controller.js';
const route = express.Router()
// const StudentController = require('../student/student.controller')
route.route("/").get(studentReportController.getStudentDailyReportAPI);
route.route("/top").get(studentReportController.getTopStudent);
route.route("/total").get(studentReportController.getStudentTotalReportAPI);
route.route("/monthly/:studentid").get(studentReportController.getStudentMonthlyReportAPI)


export default route