import mongoose, {Document, Schema} from "mongoose";


export interface ICategory extends Document {
    category_name: string,
    description: string,
}

const categorySchema = new Schema<ICategory> (
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ICategory>('Category', categorySchema)