export interface ProductRes {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  inventory_quantity: number;
  categoryId: string;
  supplier: string;
  createdAt?: Date;
  updatedAt?: Date;
}