import express from 'express'
import UserController from './user/user.controller.js'
const router = express.Router();

router.use("/user", UserController.getAllUser);


export default router