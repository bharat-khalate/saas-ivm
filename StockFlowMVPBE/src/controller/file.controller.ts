import { Request, Response } from "express";
import { validator } from "../validator/data.validator.js";
import path from "path";
import { sendError } from "../utils/response.util.js";
import { getUserFile } from "../service/file.service.js";


export const serveFileController = async (req: Request, res: Response) => {
    try {
        const fileName = path.basename(req.params.filename);
        validator.string("Invalid File Name").parse(fileName);
        const file = await getUserFile(String((req as any).userId), fileName);
        res.setHeader("Content-Type", file.contentType);
        return res.send(file.buffer);
    } catch (err: any) {
        console.error("serveFileController error", err);
        return sendError(res, 400, "Failed to get file", err.message);
    }
};