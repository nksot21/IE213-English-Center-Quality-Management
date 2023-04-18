import StudentHomeworkSchema from "../model/student-homework.schema.js";
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import HomeworkSchema from "../model/homework.schema.js";

export const createHomework = async (req, res, next) => {
    const {
        score,
        homeworkId,
        studentId,
        date
    } = req.body

    const student = await StudentSchema.findOne({
        StudentID: studentId
    })

    const homeworkData = {
        StudentID: student.id,
        Date: new Date(date),
        HomeworkID: homeworkId,
    }

    const homework = await StudentHomeworkSchema.findOne(homeworkData)
    if (!homework) {
        const newHomework = await StudentHomeworkSchema.create({
            ...homeworkData,
            Score: score
        })
        return res.json(Response.successResponse(newHomework));
    }

    const updatedHomework = await StudentHomeworkSchema.findOneAndUpdate(homeworkData, {
        Score: score
    })

    return res.json(Response.successResponse(updatedHomework))
}

export const getHomeworks = async (req, res, next) => {
    const { classId } = req.params

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
    // delete all homeworks of a date of a class
    const { classId } = req.params
    const { date } = req.body

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    await StudentHomeworkSchema.deleteOne({
        ClassID: _class.id,
        Date: new Date(date)
    })

    return res.json(Response.successResponse())
}