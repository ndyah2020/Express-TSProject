import jwt, {SignOptions} from 'jsonwebtoken';
import { UserPayload  } from '../interfaces/auth.interface';

const generateToken = async (UserPayload : UserPayload , secretKey: string, tokenLife: SignOptions['expiresIn']): Promise<string> =>  {  
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
                if(error) return reject(error)
                resolve(token as string)
            }
        )
    })
}


const verifyToken = async <T>(token: string, secretKey: string): Promise<T> => {
    //vẫn dùng promeise để xử lý callback trả về
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if(error) return reject(error)
            resolve(decoded as T)
        })
    })
}

export const jwtProviders = {
    generateToken,
    verifyToken
}