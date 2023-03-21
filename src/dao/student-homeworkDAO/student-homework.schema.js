
import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Title: String,
    Date: Date,
    Description: String,
    Score: Number,
    Level: String,
    HomeworkID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"HomeworkID",
    }, 
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"StudentID",
    },
})

schema.virtual('_Homework', {
    ref: 'Homework',
    localField: 'HomeworkID',
    foreignField: '_id',
    justOne: true
})
schema.virtual('_Student', {
    ref: 'Student',
    localField: 'StudentID',
    foreignField: '_id',
    justOne: true
})
const StudentHomeworkSchema = mongoose.model("StudentHomework", schema);
 export default StudentHomeworkSchema