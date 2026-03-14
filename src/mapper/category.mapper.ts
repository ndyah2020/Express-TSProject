import { Types } from 'mongoose';
import { CategoryDocument, ICategory } from '../models/category.model';
import { CategoryRes } from '../interfaces/category.interface';

type categoryInput = CategoryDocument | (ICategory & {_id: Types.ObjectId})

export const toCategoryRes = (doc: categoryInput): CategoryRes => {
    return {
        id: doc._id.toString(),
        category_name: doc.category_name,
        description: doc.description
    }
}