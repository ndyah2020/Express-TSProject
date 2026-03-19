import { StatusCodes } from "http-status-codes"
import categoryModel, { ICategory } from "../models/category.model"
import ApiError from "../utils/ApiError"

export class CategoryService  {
    get = async (): Promise<ICategory[]> => {
        const categories = categoryModel.find()

        if(!categories) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get categories")
        return categories
    }
    
    getById = async(categoryID: string): Promise<ICategory> => {
        const category = await categoryModel.findById(categoryID)
        if(!category) throw new ApiError(StatusCodes.NOT_FOUND,  "Category not found")
        return category
    }
    
    create = async (category: ICategory): Promise<ICategory> => {
        const newCategory = await categoryModel.create(category)
        if (!newCategory) throw new ApiError(StatusCodes.BAD_REQUEST,"Create category failed")
        
        return newCategory
    }

    update = async (categoryID: string, category: Partial<ICategory>): Promise<ICategory> => { //dùng Partial để không bắt buộc phỉa truyền đầy đủ cấc trường trong object
        const newCategory = await categoryModel.findByIdAndUpdate(categoryID, category, {new: true})
        
        if(!newCategory) throw new ApiError(StatusCodes.NOT_FOUND, "Category not found")
        return newCategory
    }

    delete = async (categoryID: string): Promise<ICategory> => {
        const deletedCategory = await categoryModel.findByIdAndDelete(categoryID)

        if(!deletedCategory) throw new ApiError(StatusCodes.NOT_FOUND, "Category not found")
        return deletedCategory
    }
}

export default new CategoryService()