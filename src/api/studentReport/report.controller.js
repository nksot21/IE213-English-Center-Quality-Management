import mongoose from "mongoose";
import responseTemplate from "../helpers/response.js";
import StudentReportSchema from "../model/student-report.schema.js"
import StudentSchema from "../model/student.schema.js"

function getTotalScore ({ homeworkScore, testScore} = {}) {
    
    let totalScore;
    if(homeworkScore === -1){
        totalScore = (testScore === -1) ? 0 : testScore
    }else{
        totalScore = (testScore === -1) ? homeworkScore : (parseInt(homeworkScore) + parseInt(testScore)) / 2
    }
    return totalScore
}

function getReportResultMonthly(reports, totalReport){
    let totalScore = 0, totalTestScore = 0, totalHomeworkScore = 0, totalAttended = 0, homeworkRequired = 0, testRequired = 0
                
    reports.map((report) => {
        totalScore += report.TotalScore
        totalTestScore += report.TestScore
        totalHomeworkScore += report.HomeworkScore,
        homeworkRequired += report.HomeworkScoreRequired,
        testRequired += report.TestScoreRequired,
        totalAttended = report.Attendance == true ? (totalAttended + 1) : totalAttended
    })

    return {
        TotalReport: totalReport,
        TotalAttented: totalAttended,
        TotalTestScore: totalTestScore,
        TotalHomeworkScore: totalHomeworkScore,
        TotalScore: totalScore,
        TotalHomeworkScoreRequired: homeworkRequired,
        TotalTestScoreRequired: testRequired,
        AverageTestScore: parseFloat(totalTestScore/totalReport),
        AverageHomeworkScore: parseFloat(totalHomeworkScore/totalReport),
        AverageTotalScore: parseFloat(totalScore/totalReport),
    }
}


// Get Student Report 
async function getStudentReports({
    classId = null,
    studentId = null,
    month = null,
    year = null,
    date = null
} = {}){
    try{
        const queries = {}
        if(classId)
            queries.ClassID = classId
        if(studentId)
            queries.StudentID = studentId
        if(month && year){
            queries.Month = month
            queries.Year = year
        }
        if(date){
            let nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)
            queries.Date = date
        }
            
        const reportsDb = await StudentReportSchema.find(queries)
        .catch(err => {
            console.log(err)
        })
        if(!reportsDb){
            throw "cannot get report"
        }
        return {reportsDb, count: reportsDb.length}
    }catch(error){
        console.log(error)
        return error.message
    }
}


// Create or Update Report
export default class studentReportController{
    static async createStudentReport({date = null, attendance=null, homeworkScore = -1, testScore = -1, studentId=null, testScoreRequired = 0, homeworkScoreRequired = 0} = {}){
        try{
            if(!date || !studentId){
                throw "Date and StudentId are needed to create report!"
            }
            // Find Report
            const reportData = {
                StudentID: studentId,
                Date: new Date(date)
            }

            const reportDb = await StudentReportSchema.findOne(reportData)
            if(!reportDb){
                let student = await StudentSchema.findById(studentId)
                // Create new report
                let month = reportData.Date.getMonth() + 1
                // Get total Score
                let totalScore = getTotalScore({homeworkScore, testScore})
                const newReport = await StudentReportSchema.create({
                    ...reportData,
                    Month: month,
                    Year: reportData.Date.getFullYear(),
                    Attendance: attendance,
                    HomeworkScore: homeworkScore,
                    TestScore: testScore,
                    TotalScore: totalScore,
                    HomeworkScoreRequired: homeworkScoreRequired,
                    TestScoreRequired: testScoreRequired,
                    ClassID: student.ClassID
                })
                return newReport
            }else{
                // Update report
                let updateData = {
                    HomeworkScore: (homeworkScore === -1) ? reportDb.HomeworkScore : homeworkScore,
                    HomeworkScoreRequired: (homeworkScore === -1) ? reportDb.HomeworkScoreRequired : homeworkScoreRequired,
                    TestScore: (testScore === -1) ? reportDb.TestScore : testScore,
                    TestScoreRequired: (testScore === -1) ? reportDb.TestScoreRequired : testScoreRequired,
                    Attendance: (!attendance) ? reportDb.Attendance : attendance
                }
                
                let newTotalScore = getTotalScore({homeworkScore: updateData.HomeworkScore, testScore: updateData.TestScore})
                const updatedReport = await reportDb.updateOne({...updateData, TotalScore: newTotalScore})
                return updatedReport
            }
        }catch(error){
            console.log(error)
            return error.message
        }
    }

    // Get Student Report inside Backend
    static async getStudentReports({classId = null,
        studentId = null,
        month = null,
        year = null,
        date = null} = {}){
        try{
            const reports = await getStudentReports({classId, studentId, month, year, date})
            return reports.reportsDb
        }catch(error){
            console.log(error)
            return error.message
        }
    }

    static async getStudentTotalReportAPI(req, res, next) {
        try{
            const {
              studentid     
            } = req.query
            if(!studentid){
                throw "StudentId is required"
            }
            let student = await StudentSchema.findOne({StudentID: studentid})
            if(!student){
                throw "Student Not Found"
            }
            console.log(student.id)
            let report = await StudentReportSchema.aggregate([
                { $match: {StudentID: new mongoose.Types.ObjectId(student.id)}},
                {
                    $project: {
                        Month: 1,
                        Year: 1,
                        TestScore: 1,
                        HomeworkScore: 1,
                        TotalScore: 1,
                        HomeworkScoreRequired: 1,
                        TestScoreRequired: 1,
                        attended: {
                            $cond: [{$eq: ["$Attendance", true]}, 1, 0]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            Month: "$Month",
                            Year: "$Year"
                        },
                        TotalReport: {$count: {}},
                        AvgTestScore: {$avg: '$TestScore'},
                        AvgHomeWorkScore: {$avg: '$HomeworkScore'},
                        AvgTotalScore: {$avg: '$TotalScore'},
                        TestScore: {$sum: '$TestScore'},
                        HomeworkScore: {$sum: '$HomeworkScore'},
                        TotalScore: {$sum: '$TotalScore'},
                        HomeworkScoreRequired: {$sum: '$HomeworkScoreRequired'},
                        TestScoreRequired: {$sum: '$TestScoreRequired'},
                        Attendance: {$sum: "$attended"}
                    },
                }
                
            ]).catch(err => {
                console.log(err)
            })
            
            let reportResponse = {
                Student: student,
                Report: report,
            }
            return res.status(200).json(responseTemplate.successResponse(reportResponse));
        
        }catch(error){
            return res.json(responseTemplate.handlingErrorResponse(error));
        }
    }
       
    // Get Student Report API
    static async getStudentReportAPI(req, res, next) {
        try{
            const {
                studentid,
                month,
                year,
                date
            } = req.query
            // student
            let studentDb = await StudentSchema.findOne({StudentID: studentid})
            if(!studentDb){
                throw "Student Not Found"
            }
            // report
            let reportResponse = {
                Student: studentDb
            }
            if(month){
                let reportDb = await getStudentReports({studentId: studentDb.id, month: month, year: year})
                let totalReport = reportDb.count
                let reports = reportDb.reportsDb
                let monthlyResult = getReportResultMonthly(reports, totalReport)
                reportResponse.Result = monthlyResult
                reportResponse.Reports = reports
            }else if(date){
                let currentDate = new Date(date)
                console.log('currentDate')
                console.log(currentDate)
                let currentMonth = currentDate.getMonth() + 1
                // date-report
                let dateReport = await getStudentReports({date: currentDate})
                if(!dateReport){
                    throw "Report Not Found"
                }
                // month-report
                let reportDb = await getStudentReports({studentId: studentDb.id, month: currentMonth})
                reportResponse.Reports = reportDb.reportsDb
                reportResponse.Result = dateReport.reportsDb[0]
            }
            


            return res.status(200).json(responseTemplate.successResponse(reportResponse));
        
        }catch(error){
            return res.json(responseTemplate.handlingErrorResponse(error));
        }
    }
       
}


