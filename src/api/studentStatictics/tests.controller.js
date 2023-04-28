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
                Score,
                TestID,
                StudentID,
                Date
            } = test

            const student = await StudentSchema.findById(StudentID._id)
            if (!student) res.json(Response.errorResponse(404, `Student with ID ${StudentID.StudentID} is not found`))

            const testData = {
                StudentID: student._id,
                Date: Date,
                TestID: TestID,
            }
            let studentIdTemp = student._id
            const existedTest = await StudentTestSchema.findOne(testData)
            if (!existedTest) {
                const newTest = await StudentTestSchema.create({
                    ...testData,
                    Score: Score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({
                    Date,
                    testScore: Score,
                    studentId: studentIdTemp
                })
                testsRes.push(newTest)
            } else {
                const updatedTest = await StudentTestSchema.findOneAndUpdate(testData, {
                    Score: Score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({
                    Date,
                    testScore: Score,
                    studentId: studentIdTemp
                })
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

    if (!_class) {
        return res.json(Response.errorResponse(404, "Class not found!"))
    }

    const tests = await StudentTestSchema.find({
            ClassID: _class._id
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