import express from 'express'
import {
    createAttendance,
    deleteAttendance,
    getAttendances
} from '../studentStatictics/attendance.controller.js'
import {
    createHomework,
    deleteHomework,
    getHomeworks
} from '../studentStatictics/homework.controller.js'
const classRoute = express.Router()

classRoute.route('/:classId/attendances')
    .post(createAttendance)
    .get(getAttendances)
    .delete(deleteAttendance)

classRoute.route('/:classId/homework')
    .post(createHomework)
    .get(getHomeworks)
    .delete(deleteHomework)

export default classRoute