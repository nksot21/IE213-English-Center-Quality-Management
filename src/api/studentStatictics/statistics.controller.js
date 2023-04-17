import StudentReportSchema from "../model/student-report.schema.js"
import Response from "../helpers/response.js";

export const createAttendance = async (req, res, next) => {
    const {
        isAttended,
        studentId,
        date
    } = req.body
    const attendanceData = {
        StudentID: studentId,
        Date: new Date(date)
    }
    // Assume varialbes are not undefined
    const attendance = await StudentReportSchema.findOne(attendanceData)
    if (!attendance) {
        const newAttendance = await StudentReportSchema.create({
            ...attendanceData,
            Attendance: isAttended
        })
        return res.json(newAttendance);
    }

    const updatedAttendace = await StudentReportSchema.findOneAndUpdate(attendanceData, {
        Attendance: isAttended
    })

    return res.json(Response.successResponse(updatedAttendace))
}

export const getAttendances = async (req, res, next) => {
    const {
        classId
    } = req.params

    const attendances = await StudentReportSchema.find({
        classID: classId
    }).select("_Student Date Attendance")

    return res.json(Response.successResponse(attendances))
}