import express from 'express'
import { createHomework, getHomework, getHomeworkByClass } from './homework.controller.js'
import { createPeriodicTest, getPeriodicTests, getPeriodicsTestByClass } from './periodicTest.controller.js'
const testRoute = express.Router()

testRoute.route('/homework').post(createHomework).get(getHomework)
testRoute.route('/homework/:classId').get(getHomeworkByClass)
testRoute.route('/periodic-test').post(createPeriodicTest).get(getPeriodicTests)
testRoute.route('/periodic-test/:classId').get(getPeriodicsTestByClass)

export default testRoute