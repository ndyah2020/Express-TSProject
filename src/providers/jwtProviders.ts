import jwt, {SignOptions} from 'jsonwebtoken';
import { UserPayload  } from '../interfaces/auth.interface';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';


export const generateToken = async (UserPayload : UserPayload , secretKey: string, tokenLife: SignOptions['expiresIn']): Promise<string> =>  {  
    //SignOptions['expiresIn']) là 1 TypeScript interface package của jsonwebtoken buộc tokenLife truyền vào phải đúng định dạng là 1h, 2h, 1d do dùng TypeScript truyền vòa với kiểu string | number thì vẫn báo lỗi
    return new Promise((resolve, reject) => {
        jwt.sign(
            UserPayload, secretKey,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife
            },
            //sử dụng callback để trong quá trinh token sinh ra thì nếu có yêu cầu token mới thì server vẫn hoạt động được bth không bị tắt nghẽn va thế nên mới bọc vào promise để token trả về không bị undefile 
            (error, token) => {
                if(error) return reject(new ApiError(StatusCodes.BAD_REQUEST, "Can't generate token"))
                resolve(token as string)
            }
        )
    })
}


export const verifyToken = async <T>(token: string, secretKey: string): Promise<T> => {
    //vẫn dùng promeise để xử lý callback trả về
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if(error) {
                // sẽ có 2 lỗi 1 là hết hạn 2 là token không đúng hoặc không có
                if(error.name == 'TokenExpiredError' ) return reject(new ApiError(StatusCodes.UNAUTHORIZED, "Token expired"))

                return reject(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token"))
            }
            resolve(decoded as T)
        })
    })
}

