import mongoose from "mongoose"

const schema = new mongoose.Schema({
    ClassID: {
        type: String,
        unique: true,
    },
    Name: {
        type: String,
    },
    TermFrom: Date,
    TermTo: Date,
    Type: String,
    ScoreRequired: {
        type: Number,
        require: true
    },
    ScoreTarget: {
        type: Number,
        require: true 
    },
    TeacherName: String,
    NumberOfStudent: {
        type: Number,
        default:0,
        min: 0
    },
    TeacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"TeacherID",
    }
})

schema.virtual('_Teacher', {
    ref: 'Teacher',
    localField: 'TeacherID',
    foreignField: '_id',
    justOne: true
})


const ClassSchema = mongoose.model("Class", schema);
 export default ClassSchema
