import { FilterQuery } from "mongoose";
import { IUserQueryReq } from "../validations/user.validation";
import userModel, { IUser } from "../models/user.model";
import { IUserRes } from "../interfaces/user.interface";
import { toUserRes } from "../mapper/user.mapper";

export class UserService {
    getQuery = async (query: IUserQueryReq) : Promise<IUserRes[]> => {
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
}

export default new UserService()