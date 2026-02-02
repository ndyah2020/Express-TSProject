import ApiError from "../utils/ApiError";
import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";

// cái nào bắt buộc phải khai báo mà không dùng thì khai báo có thêm dấu _ nha, do có bật noUnusedLocals trong tsconfig
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
    // nếu throw ApiError mà không có status code thì mặc định là 500
    if(!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

    const errorResponse = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], //nếu không có message thì lấy tên của statuscode
        track: err.stack
    }

    res.status(errorResponse.statusCode).json({errorResponse})
}
