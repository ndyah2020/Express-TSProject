import { Response } from "express";

class ApiResponse<T = unknown> {
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

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponse;