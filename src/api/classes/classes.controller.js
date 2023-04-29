import ClassSchema from "../model/class.schema.js";

import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";

export default class ClassesController {
  //-------getAllClasses--------
  static async getAllClasses(req, res, next) {
    try {
      const ClassType = req.query.classType;
      const ScoreIncome = req.query.scoreIncome;
      const ScoreDesire = req.query.scoreDesire;
      let classes;
      if (!ClassType && !ScoreIncome && !ScoreDesire) {
        classes = await ClassSchema.find();
        if (!classes) {
          throw "error";
        }
      } else {
        classes = await ClassSchema.find({
          Type: ClassType,
          ScoreRequired: { $lte: ScoreIncome },
          ScoreTarget: { $gte: ScoreDesire },
        });

        if (!classes) {
          throw "error";
        }
      }
      
      for (let i = 0; i < classes.length; i++) {
        const classId = classes[i]._id;
        console.log("classiD", classId);
        const students = await StudentSchema.find({
         ClassID:classId,
        });
       
        console.log("students", students.length);
        
        //bug get number student in a class
        classes[i].totalStudent = students.length;
       console.log("students", classes[i]);

      }
      return res.status(200).json(Response.successResponse(classes));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //---------getClassesById---------
  static async getClassesById(req, res, next) {
    try {
      const classes = await ClassSchema.findById(req.params.id);
      if (!classes) {
        throw "error";
      }
      return res.status(200).json(Response.successResponse(classes));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //-----------createClasses------------

  static async createClasses(req, res) {
    try {
      console.debug("Creating Class...");
      const { Type, ScoreTarget } = req.body;

      let ClassID;
      if (
        Type.startsWith("TOE") &&
        !isNaN(Type.substr(3)) &&
        !isNaN(ScoreTarget)
      ) {
        ClassID = `TOE${ScoreTarget}${`.`}${Math.floor(
          100 + Math.random() * 900
        )}`;
      } else if (
        Type.startsWith("IET") &&
        !isNaN(Type.substr(3)) &&
        !isNaN(ScoreTarget)
      ) {
        ClassID = `IET${ScoreTarget}${`.`}${Math.floor(
          100 + Math.random() * 900
        )}`;
      } else {
        return res
          .status(400)
          .json(Response.errorResponse("Invalid Type or ScoreTarget"));
      }

      const classExists = await ClassSchema.findOne({ ClassID });
      if (classExists) {
        return res
          .status(400)
          .json(Response.errorResponse("ClassID already exists"));
      }

      const newClass = new ClassSchema({ ...req.body, ClassID });
      const savedClass = await newClass.save();
      return res.status(201).json(Response.successResponse(savedClass));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //-------------updateClass-------------
  static async updateClasses(req, res) {
    try {
      console.debug("Updating...");
      const { id } = req.params;
      const updatedClass = await ClassSchema.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedClass) {
        return res.status(404).json(Response.errorResponse("Class not found"));
      }
      return res.json(Response.successResponse(updatedClass));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  //-------------deleteClass-------------
  static async deleteClasses(req, res) {
    try {
      const ClassId = req.params.id;
      const deletedClass = await ClassSchema.findByIdAndDelete(ClassId);
      if (!deletedClass) {
        return res.status(404).json(Response.errorResponse("Class not found"));
      }
      return res
        .status(200)
        .json(Response.successResponse("Class deleted successfully"));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}
