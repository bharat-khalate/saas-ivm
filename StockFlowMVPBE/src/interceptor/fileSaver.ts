import { NextFunction, Request, Response } from "express";
import { saveUserFileAsync } from "../service/file.service.js";
import { sendError } from "../utils/response.util.js";

export default async function saveFile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = req.body.organizationId;
    const file = req.file; // multer attaches the uploaded file here

    // For create (POST), file is required. For update (PATCH), file is optional.
    if (!file) {
      if (req.method === "POST") {
        // console.log("Content-Type header:", req.headers["content-type"]);
        // console.log("req.body:", req.body);
        // console.log("req.file:", req.file);
        throw new Error("Invalid organization id or file");
      }

      // No file provided on non-POST (e.g. PATCH) – just continue.
      return next();
    }

    if (!organizationId) {
      throw new Error("Invalid organization id");
    }

    const fileUrl = await saveUserFileAsync(file, Number(organizationId));
    req.body.fileUrl = fileUrl;
    

    next();
  } catch (err: any) {
    console.error("saveFile error", err);
    return sendError(res, 400, "Validation failed", err.message);
  }
}