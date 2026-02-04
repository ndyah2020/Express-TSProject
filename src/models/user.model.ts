import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string,
    passwordHash: string,
    role: string,
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            require: true,
            unique: true,
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