import StudentReports from "../model/student-report.schema.js";
import ClassReportSchema from "../model/class-report.schema.js";
import StudentSchema from "../model/student.schema.js";

const getClassNumberLevel = async (reportData) => {
  const studentsReports = await StudentReports.find(reportData);
  console.log("student report:", studentsReports);
  let goodLevel = 0;
  let mediumLevel = 0;
  let badLevel = 0;
  let sumClassScore = 0;
  studentsReports.forEach((report) => {
    sumClassScore += report.TotalScore;
    if (report.TotalScore >= 80) goodLevel++;
    else if (report.TotalScore >= 65 && report.TotalScore < 80) mediumLevel++;
    else badLevel++;
  });
  let classLevel = "";
  const classScore = sumClassScore / studentsReports.length;
  if (classScore >= 80) classLevel = "Good";
  else if (classScore >= 65 && classScore < 80) classLevel = "Medium";
  else classLevel = "Bad";

  const result = {
    GoodLevel: goodLevel,
    MediumLevel: mediumLevel,
    BadLevel: badLevel,
    TotalStudent: studentsReports.length,
    ClassScore: classScore,
    ClassLevel: classLevel,
  };
  return result;
};

export default class classReportController {
  static async getClassReportApi(req, res, next) {
    try {
      const { classId, date, isMonth } = req.body;
      const queries = {
        classID: classId,
      };
      //dont know
      
      return res.status(200).json(responseTemplate.successResponse(report));
    } catch (error) {
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  static async createUpdateReport(classId, date) {
    try {
      if (!date || !classId) {
        throw "Date and ClassId are needed to create report!";
      }

      //find class report
      const reportData = {
        ClassID: classId,
        Date: new Date(date),
      };
      const reportDb = await ClassReportSchema.findOne(reportData);

      //recaculate classNumberLevel
      const resultCaculate = await getClassNumberLevel(reportData);

      if (!reportDb) {
        console.log("dont have report");
        //create new report
        let month = reportData.Date.getMonth() + 1;
        const newClassReport = await ClassReportSchema.create({
          ...reportData,
          ...resultCaculate,
          Month: month,
        });
        return newClassReport;
      } else {
        console.log("have report");
        //update report
        const updatedReport = await reportDb.updateOne(resultCaculate);
        return updatedReport;
      }
    } catch (e) {
      console.log(error);
      return error.message;
    }
  }
}
