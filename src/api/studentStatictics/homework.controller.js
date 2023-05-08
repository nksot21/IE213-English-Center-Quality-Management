import StudentHomeworkSchema from "../model/student-homework.schema.js";
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import HomeworkSchema from "../model/homework.schema.js";
import studentReportController from "../studentReport/report.controller.js";

export const createHomework = async (req, res, next) => {
    const homeworksReq = req.body.homeworks
    let homeworksRes = []

    await Promise.all(
        homeworksReq.map(async homework => {
            const {
                Score,
                HomeworkID,
                StudentID,
                Date
            } = homework

            const student = await StudentSchema.findById(StudentID._id)
            if (!student) res.json(Response.errorResponse(404, `Student with ID ${student.StudentID} is not found`))

            const homeworkData = {
                StudentID: student._id,
                Date: Date,
                HomeworkID: HomeworkID,
            }

            const existedHomework = await StudentHomeworkSchema.findOne(homeworkData)
            let studentIdTemp = student._id
            if (!existedHomework) {
                const newHomework = await StudentHomeworkSchema.create({
                    ...homeworkData,
                    Score: Score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({
                    Date,
                    homeworkScore: Score,
                    studentId: studentIdTemp
                })
                homeworksRes.push(newHomework)
            } else {
                const updatedHomework = await StudentHomeworkSchema.findOneAndUpdate(homeworkData, {
                    Score: Score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({
                    Date,
                    homeworkScore: Score,
                    studentId: studentIdTemp
                })
                homeworksRes.push(updatedHomework)
            }
        }))
    return res.json(Response.successResponse(homeworksRes))
}

export const getHomeworks = async (req, res, next) => {
    const {
        classId
    } = req.params

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    if (!_class) {
        return res.json(Response.errorResponse(404, "Class not found!"))
    }

    const homeworks = await StudentHomeworkSchema.find({
            ClassID: _class._id
        })
        .select("StudentID Score HomeworkID Date")

    return res.json(Response.successResponse(homeworks))
}

// Delete all homeworks of a date of a class
export const deleteHomework = async (req, res, next) => {
    const {
        classId
    } = req.params
    const {
        date
    } = req.body

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    await StudentHomeworkSchema.deleteMany({
        ClassID: _class._id,
        Date: date
    })

    return res.json(Response.successResponse())
}