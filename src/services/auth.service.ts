import { StatusCodes } from "http-status-codes"
import { UserPayload, UserRequest, UserResponse } from '../interfaces/auth.interface';
import User from "../models/user.model"
import ApiError from "../utils/ApiError"
import bcrypt from "bcryptjs"
import { jwtProviders } from "../providers/jwtProviders";


export class UserService {
    registerService = async (userBody: UserRequest): Promise<UserResponse> => {

        const userExits = await User.findOne({username: userBody.username})
        if(userExits) throw new ApiError(StatusCodes.CONFLICT, "This username already in use")

        const hashedPassword = await bcrypt.hash(userBody.password, 10)

        const newUser  =  await User.create({
            username: userBody.username,
            passwordHash: hashedPassword,
            role: 'user'
        })
        // nếu không khai báo IUser trong schema thì chổ này phải return ra newUser.username as string (ép kiểu thành string nếu không sẽ báo lỗi)
        return {
            username: newUser.username,
            role: newUser.role
        };
    }

    loginService = async (userBody: UserRequest) => {

        const user = await User.findOne({username: userBody.username})
        if(!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect account or password information")

        const isMatch = await bcrypt.compare(userBody.password, user.passwordHash)
        if(!isMatch) throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect account or password information")
        
        const userPayload: UserPayload = {
            userId: user.id,
            role: user.role,
        }

        const accessSecretKey = process.env.JWT_SECRET_ACCESS
        const refreshSecretKey = process.env.JWT_SECRET_REFRESH

        if(!accessSecretKey || !refreshSecretKey) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "JWT_SECRET is not defined in environment variables")
        // generate ra 2 token khi gọi chung luôn sẽ chạy nhanh hơn
        const [accessToken, refreshToken] = await Promise.all([
            jwtProviders.generateToken(userPayload, accessSecretKey, '1h'),
            jwtProviders.generateToken(userPayload, refreshSecretKey, '30d')
        ]);
      
        return {
            userInfor: {
                id: user.id,
                username: user.username
            },
            accessToken,
            refreshToken,
        };
    }

    refreshTokenService = async (refreshTokenFromCookies: string) : Promise<string> => {
        if(!refreshTokenFromCookies) throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh Token not found (please login again)")

        const jwtSecretRefresh = process.env.JWT_SECRET_REFRESH
        const jwtSecretAccess = process.env.JWT_SECRET_ACCESS
        if(!jwtSecretRefresh || !jwtSecretAccess) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "JWT_SECRET is not defined in environment variables")

        const refreshTokenDecoded = await jwtProviders.verifyToken(refreshTokenFromCookies, jwtSecretRefresh) as UserPayload
        
        const userPayload = {
            userId: refreshTokenDecoded.userId,
            role: refreshTokenDecoded.role
        }
       
        const newAccessToken = await jwtProviders.generateToken(userPayload, jwtSecretAccess, '1h')

        return newAccessToken as string
    }
}

export default new UserService()