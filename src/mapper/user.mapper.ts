import { Types } from 'mongoose';
import { IUserDocument, IUser } from '../models/user.model';
import { IUserRes } from '../interfaces/user.interface';

type userInput = IUserDocument | (IUser & {_id: Types.ObjectId})

export const toUserRes = (user: userInput): IUserRes => {
    return {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
    }
}