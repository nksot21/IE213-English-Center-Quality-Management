import express from 'express'
import userRoute from './user/user.route.js'
import studentRoute from './student/student.route.js';
import statisticsRoute from './studentStatictics/statistics.route.js';
const router = express.Router();

router.use("/user", userRoute);
router.use("/statistics", statisticsRoute);
router.use("/students", studentRoute);


export default router