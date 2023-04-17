import StudentReportSchema from "../model/student-report.schema.js"
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";

export const createAttendance = async (req, res, next) => {
    const {
        isAttended,
        studentId,
        date
    } = req.body
    // Assume varialbes are not undefined

    const student = await StudentSchema.findOne({
        StudentID: studentId
    })

    const attendanceData = {
        StudentID: student.id,
        Date: new Date(date)
    }

    const attendance = await StudentReportSchema.findOne(attendanceData)
    if (!attendance) {
        const newAttendance = await StudentReportSchema.create({
            ...attendanceData,
            Attendance: isAttended
        })
        return res.json(Response.successResponse(newAttendance));
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
    const { classId } = req.params
    const { date } = req.body
    
    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    await StudentReportSchema.deleteOne({
        ClassID: _class.id,
        Date: new Date(date)
    })

    return res.json(Response.successResponse())
}