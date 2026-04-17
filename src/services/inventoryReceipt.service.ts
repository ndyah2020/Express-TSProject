// import mongoose from "mongoose"
import { IInventoryReceiptRes, InventoryReceiptDetailRes, InventoryReceiptRes } from "../interfaces/inventoryReceipt"
import inventoryReceiptModel, { IInventoryReceipt } from "../models/InventoryReceipt.model"
import { CreateInventoryReceiptReq, GetDateInventoryReceiptQueryReq, GetInventoryReceiptQueryReq } from '../validations/inventoryReceipt.validation';
import { toInventoryReceipt, toInventoryReceiptDetail } from "../mapper/inventoryReceipt.mapper"
import inventoryReceiptDetailModel from "../models/inventoryReceiptDetail.model"
import productModel from "../models/product.model"
import ApiError from "../utils/ApiError"
import { StatusCodes } from "http-status-codes"
import { FilterQuery } from "mongoose";
import InventoryReceiptModel from "../models/InventoryReceipt.model";


export class InventoryReceiptService {

    get = async(query: GetInventoryReceiptQueryReq): Promise<InventoryReceiptRes[]> => {
        const page = query.page
        const limit = query.limit
        const skip = (page - 1) * limit

        const filter: FilterQuery<IInventoryReceipt> = {}

        if(query.minPrice || query.maxPrice) {
            filter.total_mount = {}

            if(query.minPrice) filter.total_mount.$gte = query.minPrice
            if(query.maxPrice) filter.total_mount.$lte = query.maxPrice
        }

       
        let receiptSort = query.sort
        receiptSort = query.sort.split(',').join(' ')

        const inventoryReceipts = await inventoryReceiptModel.find(filter).limit(limit).skip(skip).sort(receiptSort).lean()
        
        return inventoryReceipts.map(inventoryReceipt => toInventoryReceipt(inventoryReceipt))
    }

    getAllDetail = async(): Promise<InventoryReceiptDetailRes[]> => {
        const inventoryReceipts = await inventoryReceiptModel.find().populate({
            path: 'details',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }).lean<IInventoryReceiptRes[]>();
        
        if(inventoryReceipts.length === 0) throw new ApiError(StatusCodes.NOT_FOUND, "Invenroy receipt does not exist")
            
        return inventoryReceipts.map(receipt => 
            toInventoryReceiptDetail(receipt)
        )
    }

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

    getDate = async(query: GetDateInventoryReceiptQueryReq): Promise<InventoryReceiptDetailRes[]> => {
        const filter: FilterQuery<IInventoryReceipt> = {}

        if(query.startDate || query.endDate) {
            filter.import_date = {}
            if(query.startDate)  filter.import_date.$gte = query.startDate

            if(query.endDate) filter.import_date.$lt = query.endDate
        }

        const receipts = await InventoryReceiptModel.find(filter).populate({
            path: 'details',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }).lean<IInventoryReceiptRes[]>()

        return receipts.map(receipt => toInventoryReceiptDetail(receipt))
    }
}
export default new InventoryReceiptService()