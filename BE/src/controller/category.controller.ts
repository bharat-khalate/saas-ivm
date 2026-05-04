import { Response, Request } from "express";
import { createCategory, getAllCategories } from "../service/category.service.js"
import { sendError, sendSuccess } from "../utils/response.util.js";
import { validator } from "../validator/data.validator.js";
import { TEXT } from "../constants/text.js";



export const listCategory = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();;
        return sendSuccess(
            res,
            200,
            req.t("category.categoryFetchMessage"),
            categories
        )
    } catch (err: any) {
        console.error("getProductByIdController error", err);
        return sendError(res, 500, req.t("category.categoryFetchFailedMessage"), req.t("category.categoryFetchFailedMessage"));
    }
}


export const insertCategory = async (req: Request, res: Response) => {
    try {
        validator.string().parse(req.body.category);
        const categories = await createCategory(req.body.category);;
        return sendSuccess(
            res,
            200,
            req.t("category.categoryCreatedMessage"),
            categories
        )
    } catch (err: any) {
        console.error("getProductByIdController error", err);
        return sendError(res, 500, req.t("category.categoryCreateFailedMessage"), req.t("category.categoryCreateFailedMessage"));
    }
}