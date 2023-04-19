import express from 'express'
import userRoute from './user/user.route.js'
import classRoute from './classes/classes.route.js';
import studentRoute from './student/student.route.js';
const router = express.Router();

router.use("/user", userRoute);
router.use("/classes", classRoute);
router.use("/students", studentRoute);


export default router