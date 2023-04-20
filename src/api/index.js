import express from 'express'
import userRoute from './user/user.route.js'
import studentRoute from './student/student.route.js';
import statisticsRoute from './studentStatictics/statistics.route.js';
import reportReportRoute from './studentReport/report.route.js'
const router = express.Router();

router.use("/user", userRoute);
router.use("/statistics", statisticsRoute);
router.use("/students", studentRoute);
router.use("/student-report", reportReportRoute)

export default router