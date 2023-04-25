import StudentSchema from "../model/student.schema.js";
import Response from "../helpers/response.js";
import ClassSchema from "../model/class.schema.js";

export default class StudentController {

  //---------getAllStudent--------------

  static async getAllStudent(req, res, next) {
    try {
      let query = {};
      //Filter by typeClass
      if (req.query.typeClass) {
        query.TypeClass = req.query.typeClass;
      }
      if (req.query.classId) {
        const _class = await ClassSchema.findOne({
          ClassID: req.query.classId
        })
        query.ClassID = _class._id
      }
      const students = await StudentSchema.find(query);
      if (!students) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(students));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }


  //---------getAllStudentById--------------

  static async getStudentById(req, res, next) {
    try {
      const student = await StudentSchema.findById(req.params.id);
      if (!student) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(student));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }


  //-------------createStudent-------------


  static async createStudent(req, res) {
    try {
      console.debug("Creating...");
      const studentExists = await StudentSchema.findOne({
        StudentID: req.body.StudentID
      });
      if (studentExists) {
        return res.status(400).json(Response.errorResponse("StudentID already exists"));
      }
      const newStudent = new StudentSchema({
        ...req.body
      });
      const savedStudent = await newStudent.save();
      return res.status(201).json(Response.successResponse(savedStudent));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }


  //-------------updateStudent-------------

  static async updateStudent(req, res) {
    try {
      console.debug("Updating...");
      const {
        id
      } = req.params;
      const updatedStudent = await StudentSchema.findByIdAndUpdate(
        id,
        req.body, {
          new: true
        }
      );
      if (!updatedStudent) {
        return res.status(404).json(Response.errorResponse("Student not found"));
      }
      return res.json(Response.successResponse(updatedStudent));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }


  //-------------deleteStudent-------------

  static async deleteStudent(req, res) {
    try {
      const studentId = req.params.id;
      const deletedStudent = await StudentSchema.findByIdAndDelete(studentId);
      if (!deletedStudent) {
        return res.status(404).json(Response.errorResponse("Student not found"));
      }
      return res.status(200).json(Response.successResponse("Student deleted successfully"));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}