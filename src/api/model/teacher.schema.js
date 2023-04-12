import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Name: {
        type: String,
    },
    FirstName: String,
    LastName: String,
    TeacherID: {
        type: String,
        unique: true,
    },
    DateOfBirth: Date,
    StartedDate: Date,
    Email: {
        type: String,
    },
    PhoneNumber: {
        type: String,
    },
    DateOfBirthday: {
        type: Date,
    },
    ImageURL: String,
    Certificate: String,
    Score: Number,
})


const TeacherSchema = mongoose.model("Teacher", schema);
 export default TeacherSchema
