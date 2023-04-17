import express from 'express'
import userRoute from './user/user.route.js'
import classRoute from './classes/classes.route.js';
const router = express.Router();

router.use("/user", userRoute);
router.use("/classes", classRoute)


export default router