import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Name: {
        type: String,
    },
    FirstName: String,
    LastName: String,
    StudentID: {
        type: String,
        unique: true,
    },
    Address: {
        type: String,
    },
    Email: {
        type: String,
    },
    Age: {
        type: Number,
        default: 0,
    },
    PhoneNumber: {
        type: String,
    },
    DateOfBirthday: {
        type: Date,
    },
    ImageURL: String,
    ScoreIncome: Number,
    ScoreDesire: Number,
    TypeClass: String,
    ClassID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ClassID",
    }
})

schema.virtual('_Class', {
    ref: 'Class',
    localField: 'ClassID',
    foreignField: '_id',
    justOne: true
})

const StudentSchema = mongoose.model("Student", schema);
 export default StudentSchema
