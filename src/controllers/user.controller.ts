import {Request, Response } from "express"
import { StatusCodes } from "http-status-codes"


export class UserController {
    //test thử req.userDecoded
    listUsers = async (req: Request, res: Response) => {
        const userdecoded = req.userDecoded 
        res.status(StatusCodes.OK).json({
            data: userdecoded,
            message: "List users"
        })
    }
}

export default new UserController()