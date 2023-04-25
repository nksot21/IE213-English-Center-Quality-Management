import express from "express";
import classReportController from "./classReport.controller.js";
const route = express.Router();


route.route("/").get(classReportController.getClassReportApi);
route.route("/").post(classReportController.createUpdateReport);

export default route;
