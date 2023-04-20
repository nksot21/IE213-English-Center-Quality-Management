import mongoose from "mongoose"
import StudentSchema from "./student.schema.js"

const schema = new mongoose.Schema({
    Date: Date,
    Attendance: Boolean,
    HomeworkScore: Number,
    TestScore: Number,
    TotalScore: Number,
    Month: {
        type: Number,
        index: true
    },
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    ClassID: mongoose.Schema.Types.ObjectId
})


// schema.virtual('_Student', {
//     ref: 'Student',
//     localField: 'StudentID',
//     foreignField: '_id',
//     justOne: true
// })

// schema.pre('save', function (next) {
//     const student = StudentSchema.findById(this.StudentID).then()
//     this.ClassID = student.ClassID
//     next()
// })

schema.pre(/^find/, function (next) {
    this.populate("StudentID")
    next()
})

const StudentReportSchema = mongoose.model("StudentReport", schema);
export default StudentReportSchema