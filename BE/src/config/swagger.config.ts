import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express-serve-static-core";
import { ENVIRONMENT, PORT } from "./env.js";


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Admin Backend APIs",
            version: "1.0.0",
            description: "API documentation for the project",
        },
        tags: [
            { name: "Users", description: "Manage users and authentication" },
            { name: "Products", description: "Manage Products" },
            { name: "Categories", description: "Categories management" },
            { name: "Settings", description: "Organization settings management" },
            { name: "Dashboard", description: "Dashboard metrics and summary" },
            { name: "Files", description: "File serving endpoints" },
        ],
        servers: [
            {
                url: `http://localhost:${PORT}/api/`,
                description: "Local server (v1 API)",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ENVIRONMENT == "production" ? ["./dist/routes/*.routes.js"] : ["./src/routes/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Mounts the Swagger UI and JSON spec onto the Express application.
 * Available at /api-docs in all environments.
 * @param {import('express').Application} app - The Express application instance.
 * @returns {void}
 */
export const setupSwagger = (app: Express) => {
    console.info("Starting execution of setupSwagger");
    try {
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        console.info(
            `Swagger UI available at http://localhost:${PORT}/api-docs`,
        );
    } catch (error) {
        console.error("Error occurred while executing setupSwagger\n" + error);
        throw error;
    }
};