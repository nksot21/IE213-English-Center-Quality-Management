import express from 'express'
import {
    createAttendance,
    getAttendances
} from './../studentStatictics/statistics.controller.js'
const classRoute = express.Router()

classRoute.route('/:classId/attendances')
    .post(createAttendance)
    .get(getAttendances)

export default classRoute