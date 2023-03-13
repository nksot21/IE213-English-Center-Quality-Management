import express from 'express'
import UserValidateSchema from './user.validate.js'
import UserController from './user.controller.js'
import validate from '../middlewares/validate.middleware.js'
const router = express.Router()

router.route('/').post(validate(UserValidateSchema), UserController.apiPostUser )
// 
export default router
