
interface CategoryBase {
    category_name: string,
    description: string,
}
export interface CategoryRes extends CategoryBase{
    id: string,
}

export interface CategoryMapper extends CategoryBase{
    _id: string,
}