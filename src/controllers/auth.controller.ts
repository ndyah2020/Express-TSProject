import { Response, Request, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import  authService from "../services/auth.service"
import { UserRequest } from "../interfaces/auth.interface"


export class AuthController {
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body as UserRequest
            //phần kiểm tra dữ liệu từ body sẽ được viết validate sau
            const result = await authService.registerService({username, password})

            res.status(StatusCodes.OK).json({
                data: result,
                message: "User successfully created"
            })
        } catch (error) {next(error)}
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {username, password} = req.body as UserRequest
            const result = await authService.loginService({username, password})

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

    logout = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.status(StatusCodes.OK).json({message: "logged out"})
        }catch(error) {next(error)}
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshTokenFromCookies = req.cookies.refreshToken
            const accessToken = await authService.refreshTokenService(refreshTokenFromCookies)
            
            res.cookie(
                'accessToken', accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                }
            )
            res.status(StatusCodes.OK).json({accessToken})
        } catch(error) {
            next(error)
        }
    }
}

export default new AuthController()
//dùng export ở class dể unitest còn exort new ra UserController thì khi import thì không cần khởi tạo, không được sử dụng biến toàn cục trong class
//vì khi import với userrController đã được khởi tạo thì biến toàn cục đó không được reset lại