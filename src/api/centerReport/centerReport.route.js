import express from "express";
import centerReportController from "./centerReport.controller.js";
const route = express.Router();

route.route("/").get(centerReportController.getCenterReportDailyApi);
// route.route("/monthly").get(classReportController.getClassReportMonthlyApi);
// route.route("/").post(classReportController.createUpdateReportApi);

export default route;
