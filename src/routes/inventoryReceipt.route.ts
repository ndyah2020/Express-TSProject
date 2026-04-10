import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import inventoryController from "../controllers/inventoryReceipt.controller";
import { validate } from "../middlewares/validate.middleware";
import { createInventoryReceiptSchema } from "../validations/inventoryReceipt.validation";


const router = Router()
router.use(authMiddleware.isAuthorized)
router.get('/get', inventoryController.get)
router.post('/create', validate({body: createInventoryReceiptSchema}), inventoryController.create)
router.get('/get/:id', inventoryController.getById)


export default router
