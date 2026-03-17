class ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;

  constructor({
    success = true,
    statusCode = 200,
    message = "Success",
    data = null,
  }: Partial<ApiResponse<T>> = {}) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data as T;
  }

  // helper để trả JSON từ controller
  send(res: any) {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponse;