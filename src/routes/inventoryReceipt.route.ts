import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import inventoryController from "../controllers/inventoryReceipt.controller";
import { validate } from "../middlewares/validate.middleware";
import { createInventoryReceiptSchema, getInventoryReceiptQuerySchema, getDateInventoryReceiptQuerySchema } from '../validations/inventoryReceipt.validation';


const router = Router()
router.use(authMiddleware.isAuthorized)
router.get('/get', validate({query: getInventoryReceiptQuerySchema}), inventoryController.get)
router.get('/get-all-detail', inventoryController.getAllDetail)
router.post('/create', validate({body: createInventoryReceiptSchema}), inventoryController.create)
router.get('/get/:id', inventoryController.getById)
router.get('/get-date', validate({query: getDateInventoryReceiptQuerySchema}),inventoryController.getDate)

export default router
