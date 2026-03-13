import { NextFunction, Request, Response, } from "express";
import { saveUserFileAsync } from "../service/file.service.js";
import { sendError } from "../utils/response.util.js";


export default async function saveFile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // req.body = JSON.parse(req.body.products);
        const organizationId = req.body.organizationId;
        const file = req.file; // multer attaches the uploaded file here

        if (!organizationId || !file) {
            console.log("Content-Type header:", req.headers["content-type"]);
            // console.log(req)
            console.log("req.body:", req.body);
            console.log("req.file:", req.file);
            throw new Error("Invalid organization id or file");
        }

        const fileUrl = await saveUserFileAsync(file, Number(organizationId));
        req.body.fileUrl = fileUrl;
        console.log("body", req.body);

        next();
    } catch (err: any) {
        console.error("saveFile error", err);
        return sendError(res, 400, "Validation failed", err.message);
    }
}