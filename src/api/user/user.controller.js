// import UserSchema from '../model/user.schema'

// import Response from '../helpers/response.js'

// export default class MoviesController{
//     static async apiPostUser(req, res, next){
//         try{
            
//             const newUserReq = {
//                 username: req.body.username,
//                 password: req.body.password,
//                 email: req.body.email,
//                 age: req.body.age
//             }

//             const newUser = await UserSchema.create(newUser);

//             if(!newUser){
//                 throw "error"
//             }

//             return res.json(Response.successResponse(newUser))
            
//         }catch(error){
//             return res.json(Response.handlingErrorResponse(error))
//         }
//     }
// }