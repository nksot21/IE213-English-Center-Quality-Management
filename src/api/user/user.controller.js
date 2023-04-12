import UserSchema from "../model/user.schema.js";

import Response from "../helpers/response.js";

export default class UserController {
  static async getAllUser(req, res, next) {
    try {

      const users = await UserSchema.find();
        console.log("users", users)
      if (!users) {
        throw "error";
      }

      return res.json(Response.successResponse(users));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}
