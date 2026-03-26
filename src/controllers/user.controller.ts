import { Request, Response, NextFunction} from 'express';
import { StatusCodes } from "http-status-codes"
import userService  from '../services/user.service';
import { GetUserQueryReq } from '../validations/user.validation';


export class UserController {
    getQuery = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userQuery = req.query as unknown as GetUserQueryReq

            const result = await userService.getQuery(userQuery)
            res.status(StatusCodes.OK).json(result)
        }catch (error) {
            next(error)
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id 

            const result = await userService.getById(userId)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController()