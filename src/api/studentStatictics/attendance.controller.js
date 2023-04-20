import StudentReportSchema from "../model/student-report.schema.js"
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";

export const createAttendance = async (req, res, next) => {
    const attendancesReq = req.body.attendances
    let attendancesRes = []

    await Promise.all(
        attendancesReq.map(async attendance => {
            const {
                isAttended,
                studentId,
                date
            } = attendance
            // Assume variabels are not undefined

            const student = await StudentSchema.findOne({
                StudentID: studentId
            })

            if (!student) res.json(Response.errorResponse(404, `Student with ID ${studentId} is not found`))

            const attendanceData = {
                StudentID: student.id,
                Date: new Date(date)
            }

            const existedAttendance = await StudentReportSchema.findOne(attendanceData)
            if (!existedAttendance) {
                const newAttendance = await StudentReportSchema.create({
                    ...attendanceData,
                    Attendance: isAttended,
                    ClassID: student.ClassID
                })
                console.log(student.ClassID)
                attendancesRes.push(newAttendance)
            } else {
                const updatedAttendace = await StudentReportSchema.findOneAndUpdate(attendanceData, {
                    Attendance: isAttended,
                    ClassID: student.ClassID
                })
                attendancesRes.push(updatedAttendace)
            }
        }));

    return res.json(Response.successResponse(attendancesRes))
}

export const getAttendances = async (req, res, next) => {
    const {
        classId
    } = req.params

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    const attendances = await StudentReportSchema.find({
            ClassID: _class.id
        })
        .select("StudentID Date Attendance")
    console.log(_class)

    return res.json(Response.successResponse(attendances))
}

export const deleteAttendance = async (req, res, next) => {
    // delete all attendances of a date of a class
    const {
        classId
    } = req.params
    const {
        date
    } = req.body

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    await StudentReportSchema.deleteOne({
        ClassID: _class.id,
        Date: new Date(date)
    })

    return res.json(Response.successResponse())
}