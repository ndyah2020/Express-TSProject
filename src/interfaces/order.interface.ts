export interface OrderRes {
  id: string;
  customerID: string;
  sellerID: string;
  totalCost: number;
  paymentMethod: string;
  details?: {
    productID: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
}
