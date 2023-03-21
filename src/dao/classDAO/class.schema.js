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
    ScoreTarger: {
        type: Number,
        require: true 
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
