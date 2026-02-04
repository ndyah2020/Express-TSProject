import ApiError from "../utils/ApiError";
import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, TokenExpiredError  } from "jsonwebtoken";
import { ZodError } from "zod";

// cái nào bắt buộc phải khai báo mà không dùng thì khai báo có thêm dấu _ nha, do có bật noUnusedLocals trong tsconfig
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    //status code messages và strack mặc định
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    let message = err.message ||"Internal Server Error" 
    let stack: string | undefined = err.stack

    // error cho validate
    if (err instanceof ZodError) {
        statusCode = StatusCodes.BAD_REQUEST
        message = err.issues.map((e: ZodError['issues'][number]) => e.message).join(', ')
    }
     //Lỗi hết hạn token 
    else if(err instanceof TokenExpiredError)  {
        statusCode = StatusCodes.GONE
        message = "Token expired"
    }
    //Lỗi token không tồn tại 
    else if(err instanceof JsonWebTokenError) {
        statusCode = StatusCodes.UNAUTHORIZED
        message = "Token invalid (login again)"
    }
    //Lỗi quăng ra từ throw
    else if (err instanceof ApiError) {
        statusCode = err.statusCode
        message = err.message
    }
    
    const errorResponse = {
        statusCode: statusCode,
        message: message,
        track: stack
    }
    
    return res.status(errorResponse.statusCode).json({ errorResponse })
}
