import InventoryReceiptModel from "../models/InventoryReceipt.model"
export class InventoryReceiptService {
    get = async() => {
        return InventoryReceiptModel.find()
    }
}
export default new InventoryReceiptService()