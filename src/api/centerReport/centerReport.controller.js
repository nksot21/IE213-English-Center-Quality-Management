import ClassReportSchema from "../model/class-report.schema.js";
import TotalReportSchema from "../model/total-report.schema.js";
import responseTemplate from "../helpers/response.js";
import { response } from "express";

//get number information of a class
const getCenterLevel = async (date) => {
  try {
    const classReports = await ClassReportSchema.find({
      Date: date,
    });
    console.log("class reports:", classReports);
    let goodLevel = 0;
    let mediumLevel = 0;
    let badLevel = 0;
    let totalStudent = 0;
    let sumCenterScore = 0;

    classReports.forEach((report) => {
      goodLevel += report.GoodLevel;
      mediumLevel += report.MediumLevel;
      badLevel += report.BadLevel;
      totalStudent += report.TotalStudent;
      sumCenterScore += report.ClassScore;
    });
    let centerScore = sumCenterScore/totalStudent
    const result = {
      Date: date,
      GoodLevel: goodLevel,
      MediumLevel: mediumLevel,
      BadLevel: badLevel,
      TotalStudent: totalStudent,
      CenterScore:centerScore,
      Month: date.getMonth() + 1,
    };
    return result;
  } catch (e) {
    console.log("err get center level", e);
    return e;
  }
};

async function createUpdateReport(date) {
  try {
    if (!date) {
      throw "Date is needed to create report!";
    }
    //find the center report
    const newDate = new Date(date);
    const reportDb = await TotalReportSchema.findOne({ newDate });
    console.log("reportDb: ", reportDb);

    //recaculate centerNumberLevel
    const resultCaculate = await getCenterLevel(newDate);

    if (!reportDb) {
      console.log("dont have report");
      const newCenterReport = await TotalReportSchema.create(resultCaculate);
      return newCenterReport;
    } else {
      console.log("have report");
      const updatedReport = await reportDb.updateOne(resultCaculate);
      return updatedReport;
    }
  } catch (e) {
    console.log("create report", e);
    return error.message;
  }
}

//get center report
async function getCenterReports({ month = null, date = null } = {}) {
  try {
    const queries = {};
    console.log("here");
    if (month) {
      queries.Month = month;
    }
    if (date) {
      let newDate = new Date(date);
      let month = newDate.getMonth() + 1;
      queries.Month = month;
    }
    console.log("queries:", queries);
    const reportsDb = await TotalReportSchema.find(queries);
    return reportsDb;
  } catch (e) {
    console.log(error);
    return error.message;
  }
}

export default class classReportController {
  static async getCenterReportDailyApi(req, res, next) {
    try {
      const { date, month } = req.query;
      let reportResponse = {};

      let reportDb = await getCenterReports({
        month,
        date,
      });
      reportResponse.reports = reportDb;

      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponse));
    } catch (e) {
      console.log("error getting center report daily api", e);
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }

  static async createUpdateCenterReportApi(req, res, next) {
    try {
      const { date } = req.body;
      console.log("date: ", date);
      const result = await createUpdateReport(date);
      console.log("result:", result);
      res.status(200).json(responseTemplate.successResponse(result));
    } catch (e) {
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }

  static async getCenterReportMonthlyApi(req, res, next){
    try{
      let reports = await TotalReportSchema.aggregate([
        {
          $project: {
            Date: 1,
            Month: 1,
            CenterScore: 1,
          },
        },
        {
          $group: {
            _id: {
              Month: "$Month",
            },
            AvgCenterScore: { $avg: "$CenterScore" },
          },
        },
      ]);
      return res.status(200).json(responseTemplate.successResponse(reports));
    }catch(error){
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }
}