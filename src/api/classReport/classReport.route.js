import express from "express";
import classReportController from "./classReport.controller.js";
const route = express.Router();


route.route("/").get(classReportController.getClassReportDailyApi);
route.route("/monthly").get(classReportController.getClassReportMonthlyApi);
route.route("/").post(classReportController.createUpdateReportApi);

export default route;
