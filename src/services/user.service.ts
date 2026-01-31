
export class UserService {
    register = (a: number, b: number) => {
        return {
            message: "kết quả nè",
            result: a +b
        }
    }
}

export default new UserService()