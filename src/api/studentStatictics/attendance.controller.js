import StudentReportSchema from "../model/student-report.schema.js"
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import studentReportController from "../studentReport/report.controller.js";

export const createAttendance = async (req, res, next) => {
    const attendancesReq = req.body.attendances
    let attendancesRes = []

    await Promise.all(
        attendancesReq.map(async attendance => {
            const {
                Attendance,
                StudentID,
                Date
            } = attendance
            // Assume variabels are not undefined

            const student = await StudentSchema.findById(StudentID._id)

            if (!student) res.json(Response.errorResponse(404, `Student with ID ${StudentID.StudentID} is not found`))

            // const attendanceData = {
            //     StudentID: student.id,
            //     Date: new Date(date)
            // }

            // const existedAttendance = await StudentReportSchema.findOne(attendanceData)
            // if (!existedAttendance) {
            //     const newAttendance = await StudentReportSchema.create({
            //         ...attendanceData,
            //         Attendance: Attendance,
            //         ClassID: student.ClassID
            //     })
            //     console.log(student.ClassID)
            //     attendancesRes.push(newAttendance)
            // } else {
            //     const updatedAttendace = await StudentReportSchema.findOneAndUpdate(attendanceData, {
            //         Attendance: Attendance,
            //         ClassID: student.ClassID
            //     })
            //     attendancesRes.push(updatedAttendace)
            // }
            let tempId = student.id
            let report = await studentReportController.createStudentReport({
                date: Date,
                attendance: Attendance,
                studentId: tempId,
            })
            attendancesRes.push(report)
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

    if (!_class) {
        return res.json(Response.errorResponse(404, "Class not found!"))
    }

    const attendances = await StudentReportSchema.find({
            ClassID: _class.id
        })
        .select("StudentID Date Attendance")

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

    console.log(req.body)

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    await StudentReportSchema.deleteMany({
        ClassID: _class._id,
        Date: date 
    })

    return res.json(Response.successResponse())
}