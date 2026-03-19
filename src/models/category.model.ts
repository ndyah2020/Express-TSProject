import mongoose, {HydratedDocument, Schema} from "mongoose";


export interface ICategory{
    category_name: string,
    description: string,
}
//không tạo mới nên dùng Type, viết gọn hơn inteface vì dùng được dấu bằng

export type CategoryDocument = HydratedDocument<ICategory> // chổ này nếu có sài .save(), .populate() thì import qua ví dụ const user: CategoryDocument = awai Category.findByid(id)

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
        timestamps: true,
    }
)

export default mongoose.model<ICategory>('Category', categorySchema)