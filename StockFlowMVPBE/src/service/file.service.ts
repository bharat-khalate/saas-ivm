import fs from "fs/promises";
import path from "path";
import { BASE_API_PATH, FILE_BASE_PATH } from "../config/global.config.js";

import mime from "mime-types";


export async function saveUserFileAsync(
    file: { originalname: string; path: string, buffer: Buffer },
    organizationId: number,
): Promise<string> {
    const userFolder = path.join(FILE_BASE_PATH, String(organizationId));
    // create folder asynchronously
    await fs.mkdir(userFolder, { recursive: true });
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const destination = path.join(userFolder, uniqueName);
    // move file asynchronously
    await fs.writeFile(destination, file.buffer);
    return `${BASE_API_PATH}/files/${organizationId}/${uniqueName}`;
}

export const getUserFile = async (
    userId: string,
    filename: string
) => {
    const safeName = path.basename(filename);
    const filePath = path.join(FILE_BASE_PATH, userId, safeName);
    const buffer = await fs.readFile(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";
    return {
        buffer,
        contentType,
        fileName: safeName
    };
};