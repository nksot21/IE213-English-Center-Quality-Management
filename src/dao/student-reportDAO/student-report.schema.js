
import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Date: Date,
    Attendance: Boolean,
    HomeworkScore: Number,
    TestScore: Number,
    TotalScore: Number,
    Month: {
        type: [Number],
        index: true
    },
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"StudentID",
    },
})


schema.virtual('_Student', {
    ref: 'Student',
    localField: 'StudentID',
    foreignField: '_id',
    justOne: true
})
const StudentReportSchema = mongoose.model("StudentReport", schema);
 export default StudentReportSchema