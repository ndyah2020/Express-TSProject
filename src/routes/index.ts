import { Router } from "express";
import authRoutes from "./auth.route";

import userRoutes from "./user.route";
import productRoutes from "./product.route";
import categotyRoutes from "./category.route";
import orderRoutes from "./order.route";
import customerRoute from './customer.route';

const router = Router()

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categotyRoutes);
router.use('/customers', customerRoute)
router.use("/orders", orderRoutes);

export default router;
