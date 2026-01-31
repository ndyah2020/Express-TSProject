import { Response, Request, NextFunction } from "express"
// import ApiError from "../utils/ApiError"
import { StatusCodes } from "http-status-codes"
import  userService from "../services/user.service"


export class UserController {
    register = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            // if(!req.body.user)
            //     throw new ApiError(StatusCodes.BAD_GATEWAY, "Cách dùng lỗi nè") // cách dùng lỗi truyền vào status và mesage khi gặp lỗi nó sẽ nhảy xuống catch và đi vòa middlewaresư

            // Xử lý logic thì đi vào service
            const result = await userService.register(1, 2)
            
            res.status(StatusCodes.OK).json(result)
        } catch (error) {next(error)}
    }
}

export default new UserController()
//dùng export ở class dể unitest còn exort new ra UserController thì khi import thì không cần khởi tạo, không được sử dụng biến toàn cục trong class
//vì khi import với userrController đã được khởi tạo thì biến toàn cục đó không được reset lại