// custom error vì Error mặc định không có statusCode mà errorHandler ở middleware thì cần để log ra nên custom thêm status code và kế thừa Error
class ApiError extends Error {
    statusCode: number

    constructor(statusCode: number, message: string) {
        super(message)
        this.name = 'ApIError'
        this.message = message
        this.statusCode = statusCode
        // ghi lại chổ nào bị lỗi 
        Error.captureStackTrace(this, this.constructor)
    }
    
}

export default ApiError