import StudentHomeworkSchema from "../model/student-homework.schema.js";
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import HomeworkSchema from "../model/homework.schema.js";

export const createHomework = async (req, res, next) => {
    const homeworksReq = req.body.homeworks
    let homeworksRes = []

    await Promise.all(
        homeworksReq.map(async homework => {
            const {
                score,
                homeworkId,
                studentId,
                date
            } = homework

            const student = await StudentSchema.findOne({
                StudentID: studentId
            })
            if (!student) res.json(Response.errorResponse(404, `Student with ID ${studentId} is not found`))

            const homeworkData = {
                StudentID: student.id,
                Date: new Date(date),
                HomeworkID: homeworkId,
            }

            const existedHomework = await StudentHomeworkSchema.findOne(homeworkData)
            let studentIdTemp = student.id
            if (!existedHomework) {
                const newHomework = await StudentHomeworkSchema.create({
                    ...homeworkData,
                    Score: score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({date, homeworkScore: score,  studentId: studentIdTemp})
                homeworksRes.push(newHomework)
            } else {
                const updatedHomework = await StudentHomeworkSchema.findOneAndUpdate(homeworkData, {
                    Score: score,
                    ClassID: student.ClassID
                })
                await studentReportController.createStudentReport({date, homeworkScore: score,  studentId: studentIdTemp})
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

    const homeworks = await StudentHomeworkSchema.find({
            ClassID: _class.id
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

    await StudentHomeworkSchema.deleteOne({
        ClassID: _class.id,
        Date: new Date(date)
    })

    return res.json(Response.successResponse())
}