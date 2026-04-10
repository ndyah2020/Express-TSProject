import mongoose, { HydratedDocument, Schema } from 'mongoose';

export interface IUser{
    username: string,
    name: string
    passwordHash: string,
    role: string,
    createdAt: Date,
}

export type IUserDocument = HydratedDocument<IUser>

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            require: true,
            unique: true,
        },
        name: {
            type: String,
            require: true,
        },
        passwordHash: {
            type: String,
            require: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IUser>('User', userSchema)