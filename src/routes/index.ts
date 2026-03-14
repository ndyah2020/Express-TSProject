import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route"
import productRoutes from  "./product.route"
import customerRoute from './customer.route';
import categotyRoutes from "./category.route"
const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/categories', categotyRoutes)
router.use('/customers', customerRoute)

export default router