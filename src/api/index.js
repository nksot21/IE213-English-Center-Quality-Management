import express from 'express'
const router = express.Router();
import UserRouter from './user/user.route.js'

router.use('/user', UserRouter)


export default router