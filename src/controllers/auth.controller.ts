import { Response, Request, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import  userService from "../services/user.service"
import { UserRequest } from "../interfaces/auth.interface"


export class AuthController {
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body as UserRequest
            //phần kiểm tra dữ liệu từ body sẽ được viết validate sau
            const result = await userService.registerService({username, password})

            res.status(StatusCodes.OK).json({
                data: result,
                message: "User successfully created"
            })
        } catch (error) {next(error)}
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {username, password} = req.body as UserRequest
            const result = await userService.loginService({username, password})

            res.cookie(
                'accessToken', result.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                }
            )

            res.cookie(
                'refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                }
            )

            //maxAge của refresh và access đều phải như nhau vì đó là thời gian sống của cookie nếu nhầm set như acccess token sẽ cookie sẽ bị mất

            res.status(StatusCodes.OK).json({
                data: result.userInfor,
                message: "Login successfully"
            })

        } catch (error) {next(error)}
    }
}

export default new AuthController()
//dùng export ở class dể unitest còn exort new ra UserController thì khi import thì không cần khởi tạo, không được sử dụng biến toàn cục trong class
//vì khi import với userrController đã được khởi tạo thì biến toàn cục đó không được reset lại