import UserSchemaDAO from '../../dao/userDAO/user.model.js'
import Response from '../helpers/response.js'

export default class MoviesController{
    static async apiPostUser(req, res, next){
        try{
            
            const newUser = await UserSchemaDAO.postUser({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                age: req.body.age
            })

            return res.json(Response.successResponse(newUser))
            
        }catch(error){
            return res.json(Response.handlingErrorResponse(error))
        }
    }
}