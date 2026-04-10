// import mongoose from "mongoose"
import { IInventoryReceiptRes, InventoryReceiptDetailRes, InventoryReceiptRes } from "../interfaces/inventoryReceipt"
import inventoryReceiptModel from "../models/InventoryReceipt.model"
import { CreateInventoryReceiptReq } from "../validations/inventoryReceipt.validation"
import { toInventoryReceipt, toInventoryReceiptDetail } from "../mapper/inventoryReceipt.mapper"
import inventoryReceiptDetailModel from "../models/inventoryReceiptDetail.model"
import productModel from "../models/product.model"
import ApiError from "../utils/ApiError"
import { StatusCodes } from "http-status-codes"

export class InventoryReceiptService {
    getById = async(receiptId: string): Promise<InventoryReceiptDetailRes> => {
        const inventoryReceipt = await inventoryReceiptModel.findById(receiptId).populate({
            path: 'details',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }).lean<IInventoryReceiptRes>() 
        if(!inventoryReceipt) throw new ApiError(StatusCodes.NOT_FOUND, "Invenroy receipt does not exist")

        return toInventoryReceiptDetail(inventoryReceipt)
    }

    create = async(data: CreateInventoryReceiptReq, userId: string): Promise<InventoryReceiptRes> =>{
        // const session = await mongoose.startSession()
        // try {
            // session.startTransaction()

            const { supplierId, import_date, products } = data
            let totalMount = products.reduce((acc, product) => acc + product.import_price*product.quality, 0) 
            
            const receipts= await inventoryReceiptModel.create(
                [{
                    supplierId,
                    userId,
                    total_mount: totalMount,
                    import_date
                }],
                // { session }
            ); //trả về mảng do có truyền vào {session}
            const receipt = receipts[0]
            
            const receiptDetail = products.map(product => ({
                importReceiptId: receipt._id,
                productId: product.productId,
                quality: product.quality,
                import_price: product.import_price,
            }))

            await inventoryReceiptDetailModel.create(
                receiptDetail, 
                // {session}
            )

            for(const product of products) {
                await productModel.updateOne(
                    {_id: product.productId},
                    {$inc: {inventory_quantity: product.quality}},
                    // {session}
                )
            }
            // await session.commitTransaction()

            return toInventoryReceipt(receipt)
        // } catch (error) {
        //     await session.abortTransaction()
        //     throw error
        // } finally {
        //     session.endSession()
        // }
    }
}
export default new InventoryReceiptService()