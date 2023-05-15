import mongoose from "mongoose";

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
  DateOfBirth: {
    type: Date,
  },
  StartedDate: {
    type: Date,
  },
  Email: {
    type: String,
  },
  PhoneNumber: {
    type: String,
  },
  ImageURL: String,
  Certificate: String,
  Score: String,
});

schema.pre("save", function (next) {
  this.Name = `${this.FirstName} ${this.LastName}`;
  next();
});

const TeacherSchema = mongoose.model("Teacher", schema);
export default TeacherSchema;
