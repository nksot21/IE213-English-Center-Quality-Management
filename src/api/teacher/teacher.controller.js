import TeacherSchema from "../model/teacher.schema.js";
import Response from "../helpers/response.js";

export default class TeacherController {
  //Lấy danh sách giáo viên:
  static async getTeachers(req, res, next) {
    try {
      const teacher = await TeacherSchema.find();
      if (!teacher) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(teacher));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  //Lấy giáo viên theo id:
  static async getTeacherById(req, res, next) {
    try {
      const { id } = req.params;
      const teacher = await TeacherSchema.findById(id);
      if (!teacher) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(teacher));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }


  //Thêm giáo viên

  static async addTeacher(req, res) {
    try {
        const teachers = await TeacherSchema.find({});
        let newTeacherID;
        if (teachers.length === 0) {
            newTeacherID = "TEA0001";
        } else {
            const lastTeacherID = teachers[teachers.length - 1].TeacherID;
            const lastTeacherNum = parseInt(lastTeacherID.slice(3), 10);
            newTeacherID = "TEA" + ("000" + (lastTeacherNum + 1)).slice(-4);
        }
        const newTeacher = new TeacherSchema({ ...req.body, TeacherID: newTeacherID });
        const savedTeacher = await newTeacher.save();
        return res.status(201).json(Response.successResponse(savedTeacher));
    } catch (error) {
        return res.json(Response.handlingErrorResponse(error));
    }
}



  //Cập nhật thông tin giáo viên:
  static async updateTeacher(req, res) {
    try {
      console.debug("Updating teacher...");
      const { id } = req.params;
      const updatedTaecher = await TeacherSchema.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedTaecher) {
        return res
          .status(404)
          .json(Response.errorResponse("Teacher not found."));
      }
      return res.json(Response.successResponse(updatedTaecher));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
  //Xóa giáo viên:
  static async deleteTeacher(req, res) {
    try {
      console.debug("Deleting Teacher...");
      const { id } = req.params;
      const deletedTeacher = await TeacherSchema.findOneAndDelete(id);
      if (!deletedTeacher) {
        return res
          .status(404)
          .json(Response.errorResponse("Teacher not found."));
      }
      return res.json(Response.successResponse('Teacher deleted successfully'));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}
