import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { jwtProviders } from "../providers/jwtProviders"
import ApiError from "../utils/ApiError"
import { UserPayload } from "../interfaces/auth.interface"

const isAuthorzied = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const accessTokeFromCookie = req.cookies?.accessToken
        if(!accessTokeFromCookie) throw new ApiError(StatusCodes.UNAUTHORIZED, "unauthorized!(Token not found)")
        
        const jwtSecrecAccess = process.env.JWT_SECRET_ACCESS
        if(!jwtSecrecAccess) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "JWT_SECRET is not defined in environment variables")

        const decoded = await jwtProviders.verifyToken<UserPayload>(accessTokeFromCookie, jwtSecrecAccess)
        req.userDecoded = decoded

        next()
    }catch(error) {
        next(error)
    }
}

export const authMiddleware = {
    isAuthorzied
}