import userSchema from "./user.schema.js"
import mongoose from "mongoose"

export default class UserSchemaDAO  {
    static async postUser(user) {
        try{
            const newUser = await userSchema.create(user)
            return newUser
        }catch(error){
            console.log(error)
            throw error
        }
    }
}