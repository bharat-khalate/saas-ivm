import fs from "fs/promises";
import path from "path";
import { BASE_API_PATH, FILE_BASE_PATH } from "../config/global.config.js";

import mime from "mime-types";


/**
 * Persists uploaded file and returns public API URL.
 * @param {{ originalname: string; path: string; buffer: Buffer }} file - Uploaded file payload.
 * @param {number} organizationId - Organization identifier.
 * @returns {Promise<string>} Public URL for uploaded file.
 */
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

/**
 * Reads an uploaded file for a user and resolves mime metadata.
 * @param {string} userId - User or organization folder identifier.
 * @param {string} filename - File name to load.
 * @returns {Promise<{ buffer: Buffer; contentType: string | false; fileName: string }>} File binary and metadata.
 */
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