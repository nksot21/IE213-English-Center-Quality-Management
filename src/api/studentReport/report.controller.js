import responseTemplate from "../helpers/response.js";
import StudentReportSchema from "../model/student-report.schema.js"
import StudentSchema from "../model/student.schema.js"

const getTotalScore = ({ homeworkScore, testScore} = {}) => {
    
    let totalScore;
    if(homeworkScore === -1){
        totalScore = (testScore === -1) ? 0 : testScore
    }else{
        totalScore = (testScore === -1) ? homeworkScore : (parseInt(homeworkScore) + parseInt(testScore)) / 2
    }
    return totalScore
}


// Get Student Report 
async function getStudentReports({
    classId = null,
    studentId = null,
    month = null,
    date = null
} = {}){
    try{
        const queries = {}
        if(classId)
            queries.ClassID = classId
        if(studentId)
            queries.StudentID = studentId
        if(month)
            queries.Month = month
        if(date)
            queries.Date = date
        console.log(queries)
        const reportsDb = await StudentReportSchema.find(queries)
        if(!reportsDb){
            throw "cannot get report"
        }
        return reportsDb
    }catch(error){
        console.log(error)
        return error.message
    }
}


// Create or Update Report
export default class studentReportController{
    static async createStudentReport({date = null, attendance=null, homeworkScore = -1, testScore = -1, studentId=null} = {}){
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
                // Create new report
                let month = reportData.Date.getMonth() + 1
                // Get total Score
                let totalScore = getTotalScore({homeworkScore, testScore})
                const newReport = await StudentReportSchema.create({
                    ...reportData,
                    Month: month,
                    Attendance: attendance,
                    HomeworkScore: homeworkScore,
                    TestScore: testScore,
                    TotalScore: totalScore
                })
                return newReport
            }else{
                // Update report
                let updateData = {
                    HomeworkScore: (homeworkScore === -1) ? reportDb.HomeworkScore : homeworkScore,
                    TestScore: (testScore === -1) ? reportDb.TestScore : testScore,
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
        date = null} = {}){
        try{
            const reports = await getStudentReports({classId, studentId, month, date})
            return reports
        }catch(error){
            console.log(error)
            return error.message
        }
    }
       
    // Get Student Report API
    static async getStudentReportAPI(req, res, next) {
        try{
            const {
                classId ,
                studentId ,
                month ,
                date         
            } = req.body
            let report = await getStudentReports({classId, studentId, month, date})
            return res.status(200).json(responseTemplate.successResponse(report));
        
        }catch(error){
            return res.json(responseTemplate.handlingErrorResponse(error));
        }
    }
       
}


