import ApiError from "../utils/ApiError";
import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";

// cái nào bắt buộc phải khai báo mà không dùng thì khai báo có thêm dấu _ nha, do có bật noUnusedLocals trong tsconfig
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    //status code messages và strack mặc định
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    let message = "Internal Server Error"
    let stack: string | undefined = undefined

    //nếu quăng lỗi từ Api Error
    if(err instanceof ApiError) {
        statusCode =  err.statusCode
        message = err.message || StatusCodes[err.statusCode]
        stack = err.stack
    }
    // nếu lỗi từ Error 
    else if(err instanceof Error) {
        message = err.message
        stack = err.stack
    }

    // nếu quăng lỗi không phải từ 2 thằng kia thì sẽ mặc định Interal server error
    const errorResponse = {
        statusCode: statusCode,
        message: message,
        track: stack
    }
    return res.status(errorResponse.statusCode).json({ errorResponse })
}
