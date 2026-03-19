// Auth validations
export {
    registerBodySchema,
    loginBodySchema
} from './auth.validation'

// User validations
export {
    userIdParamSchema,
    getUsersQuerySchema,
    updateUserBodySchema
} from './user.validation'
// Product validations

export {
    createOrderSchema,
    idParamsSchema,
    customerIdParamsSchema,
    sellerIdParamsSchema,
    timeRangeParamsSchema
} from './order.validation'

