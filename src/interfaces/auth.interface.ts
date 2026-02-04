export interface UserPayload {
    userId: string,
    role: string,
}

export interface UserRequest {
    username: string,
    password: string,
}

export interface UserResponse {
    username: string,
    role: string,
}