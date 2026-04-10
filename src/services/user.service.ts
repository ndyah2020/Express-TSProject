import { FilterQuery } from "mongoose";
import { GetUserQueryReq } from "../validations/user.validation";
import userModel, { IUser } from "../models/user.model";
import { IUserRes } from "../interfaces/user.interface";
import { toUserRes } from "../mapper/user.mapper";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export class UserService {
    getQuery = async (query: GetUserQueryReq) : Promise<IUserRes[]> => {
        const page = query.page
        const limit = query.limit
        const skip = (page - 1) * limit

        const filter: FilterQuery<IUser> = {}

        if(query.search.length > 0) {
            filter.$or = [
                {name : {$regex: query.search, $options: 'i'}},
                {username: {$regex: query.search, $options: 'i'}}
            ]
          
        }

        let sortUser = query.sort       
        sortUser = sortUser.split(',').join(' ')
        

        const users = await userModel.find(filter).sort(sortUser).skip(skip).limit(limit).lean()

        return users.map(user => toUserRes(user))
    }

    getById = async (userId: string): Promise<IUserRes>  => {
        const user = await userModel.findById(userId).lean()
        if(!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        return toUserRes(user)
    }

    delete = async (userId: string, userRole: string): Promise<IUserRes>  => {
        if(userRole !== "admin") throw new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to access this resource")

        const user = await userModel.findByIdAndDelete(userId).lean()
        if(!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        return toUserRes(user)
    }

}

export default new UserService()