import {z} from "zod"
import dayjs from "../config/dayjs"
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const paginationBaseSchema = z.object({
    page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => Number(val))
        .refine((val) => val > 0, {
            message: "Page must be > 0"
        }),
    limit: z
        .string()
        .optional()
        .default("10")
        .transform((val) => Number(val))
        .refine((val) => val > 0 && val < 100, {
            message: "Limit must be between 1 and 100"
        }),
    sort: z
        .string()
        .optional()
        .default("-createdAt")
        .refine((val) => val.length > 0, {
            message: "sort must be name's field and not null"
        })
})

export const optionalNumberQuery = z.preprocess(
  (val) => {
    if (val === undefined || val === null || val === "") return undefined;
    return Number(val);
  },
  z.number().finite().min(0).optional()
);

export const optionalDateQuery = z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;

    if (typeof val !== "string") return undefined;

    const parsed = dayjs(val, "DD-MM-YYYY", true);
    if (!parsed.isValid()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid date format DD-MM-YYYY");
    }

    return parsed.toDate();
}, z.date().optional());

export type PaginationBase = z.infer<typeof paginationBaseSchema>

