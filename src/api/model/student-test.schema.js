
import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Title: String,
    Date: Date,
    Description: String,
    Score: Number,
    Level: String,
    TestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"TestID",
    }, 
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"StudentID",
    },
})

schema.virtual('_Test', {
    ref: 'Test',
    localField: 'TestID',
    foreignField: '_id',
    justOne: true
})
schema.virtual('_Student', {
    ref: 'Student',
    localField: 'StudentID',
    foreignField: '_id',
    justOne: true
})
const StudentTestSchema = mongoose.model("StudentTest", schema);
 export default StudentTestSchema

