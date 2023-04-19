import Joi from 'joi'

const postStudentSchema =  {
    body: Joi.object().keys({
        // name: Joi.string().min(3).max(30).required(),
        Email: Joi.string().required(),
        PhoneNumber: Joi.string().trim().length(10).pattern(/^\d+$/).required()
    })
}
export default postStudentSchema