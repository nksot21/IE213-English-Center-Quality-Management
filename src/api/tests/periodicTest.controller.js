import Response from "../helpers/response.js";
import TestSchema from "../model/test.schema.js";

export const createPeriodicTest = async (req, res, next) => {
    const {
        Title,
        Date,
        ClassID
    } = req.body
    if (!Title || !Date || !ClassID) {
        return res.json(Response.errorResponse(500, "A periodicTest test must be provided with title, date and classId!"))
    }

    const existingPeriodicTest = await TestSchema.findOne({
        Title,
        Date,
        ClassID
    })
    if (existingPeriodicTest) {
        return res.json(Response.errorResponse(400, "PeriodicTest is already exists!"))
    }

    const newPeriodicTest = await TestSchema.create(req.body)
    if (!newPeriodicTest) {
        return res.json(Response.errorResponse(400, "Can not create new periodicTest!"))
    }

    return res.json(Response.successResponse(newPeriodicTest))
}

export const getPeriodicTests = async (req, res, next) => {
    const periodicTest = await TestSchema.find()

    return res.json(Response.successResponse(periodicTest))
}

export const getPeriodicsTestByClass = async (req, res, next) => {
    const periodicTest = await TestSchema.find({
        ClassID: req.params.classId
    })

    return res.json(Response.successResponse(periodicTest))
}