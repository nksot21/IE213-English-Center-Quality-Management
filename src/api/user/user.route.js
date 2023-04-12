import express from 'express'
import UserController from './user.controller.js'
const router = express.Router()

router.route("/").get(UserController.getAllUser);
                
// 
export default router
