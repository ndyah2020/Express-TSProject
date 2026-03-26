import { StatusCodes } from "http-status-codes";
import categoryModel, { ICategory } from "../models/category.model";
import ApiError from "../utils/ApiError";
import { CreateCategoryReq, GetCategoryQueryReq, UpdateCategoryReq} from "../validations/category.validation";
import { CategoryRes } from "../interfaces/category.interface";
import { toCategoryRes } from "../mapper/category.mapper";
import { FilterQuery } from "mongoose";



export class CategoryService {
  getQuery = async (query: GetCategoryQueryReq): Promise<CategoryRes[]> => {
    console.log(query)
    const page = query.page
    const limit = query.limit
    const skip = (page - 1) * limit

    const filter: FilterQuery<ICategory> = {}

    if(query.search) {
      filter.$or = [
        {category_name: {$regex: query.search, $options: "i" }},
        {description: {$regex: query.search, $options: "i"}}
      ]
    }

    let categorySort = query.sort
    categorySort = categorySort.split(',').join(' ')

    const category = await categoryModel.find(filter).sort(categorySort).limit(limit).skip(skip).lean(); //mặc định là nó sẽ trả về  HydratedDocument<ICategory> nến .lean() để nó thành plain object
    return category.map((categories) =>
      toCategoryRes(categories),
    );;
  };

  getById = async (categoryID: string): Promise<CategoryRes> => {
    const category = await categoryModel.findById(categoryID).lean();
    if (!category)
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    return toCategoryRes(category);
  };

  create = async (category: CreateCategoryReq): Promise<CategoryRes> => {
    const newCategory = await categoryModel.create(category); //cái này là nó sẽ trả về HydratedDocument<ICategory>

    if (!newCategory)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create category failed");

    return toCategoryRes(newCategory);
  };

  update = async (
    categoryID: string,
    category: Partial<UpdateCategoryReq>,
  ): Promise<CategoryRes> => {
    //dùng Partial để không bắt buộc phỉa truyền đầy đủ cấc trường trong object
    const newCategory = await categoryModel
      .findByIdAndUpdate(categoryID, category, { new: true })
      .lean(); //.lean thì trả về plain object luôn
    if (!newCategory)
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");

    return toCategoryRes(newCategory);
  };

  delete = async (categoryID: string): Promise<CategoryRes> => {
    const deletedCategory = await categoryModel
      .findByIdAndDelete(categoryID)
      .lean();

    if (!deletedCategory)
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");

    return toCategoryRes(deletedCategory);
  };
}

export default new CategoryService();
