import StudentTestSchema from "../model/student-test.schema.js";
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import TestSchema from "../model/test.schema.js";
import studentReportController from "../studentReport/report.controller.js";

export const createTest = async (req, res, next) => {
    const testsReq = req.body.tests
    let testsRes = []

    await Promise.all(
        testsReq.map(async test => {
            const {
                score,
                testId,
                studentId,
                date
            } = test

            const student = await StudentSchema.findOne({
                StudentID: studentId
            })
            if (!student) res.json(Response.errorResponse(404, `Student with ID ${studentId} is not found`))

            const testData = {
                StudentID: student.id,
                Date: new Date(date),
                TestID: testId,
            }
            let studentIdTemp = student.id
            const existedTest = await StudentTestSchema.findOne(testData)
            if (!existedTest) {
                const newTest = await StudentTestSchema.create({
                    ...testData,
                    Score: score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({date, testScore: score,  studentId: studentIdTemp})
                testsRes.push(newTest)
            } else {
                const updatedTest = await StudentTestSchema.findOneAndUpdate(testData, {
                    Score: score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({date, testScore: score,  studentId: studentIdTemp})
                testsRes.push(updatedTest)
            }
        }))
    return res.json(Response.successResponse(testsRes))
}

export const getTests = async (req, res, next) => {
    const {
        classId
    } = req.params

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    const tests = await StudentTestSchema.find({
            ClassID: _class.id
        })
        .select("StudentID Score TestID Date")

    return res.json(Response.successResponse(tests))
}

// Delete all tests of a date of a class
export const deleteTest = async (req, res, next) => {
    const {
        classId
    } = req.params
    const {
        date
    } = req.body

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    await StudentTestSchema.deleteOne({
        ClassID: _class.id,
        Date: new Date(date)
    })

    return res.json(Response.successResponse())
}