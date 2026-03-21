import { StatusCodes } from "http-status-codes";
import categoryModel from "../models/category.model";
import ApiError from "../utils/ApiError";
import {
  CreateCategoryReq,
  UpdateCategoryReq,
} from "../validations/category.validation";
import { CategoryRes } from "../interfaces/category.interface";
import { toCategoryRes } from "../mapper/category.mapper";

export class CategoryService {
  get = async (): Promise<CategoryRes[]> => {
    const category = await categoryModel.find().lean(); //mặc định là nó sẽ trả về  HydratedDocument<ICategory> nến .lean() để nó thành plain object
    const categoryRes: CategoryRes[] = category.map((categories) =>
      toCategoryRes(categories),
    );
    return categoryRes;
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
