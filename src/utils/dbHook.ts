import { Schema } from "mongoose";
import ApiError from "./ApiError";
import { StatusCodes } from 'http-status-codes';

interface PreventDeleteOptions {
    refModel: string,
    foreign_field: string,
    message: string
}

export const preventDeletePlugin = (schema: Schema, options: PreventDeleteOptions) => {
    schema.pre("findOneAndDelete", async function(next) {
        const doc = await this.model.findOne(this.getQuery())
        if(!doc) return next()

        const refModel = this.model.db.model(options.refModel)

        const count = await refModel.countDocuments({
            [options.foreign_field]: doc._id
        })

        if (count > 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, options.message)
        }
    })
}
