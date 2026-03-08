import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.get('/get', authMiddleware.isAuthorized)

export default router