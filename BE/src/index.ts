import cors from "cors";
import express, { Request, Response } from "express";
import categoryRouter from "./routes/category.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import productRoutes from "./routes/products.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import userRoutes from "./routes/user.routes.js";
import { PORT } from "./config/env.js";
import { setupSwagger } from "./config/swagger.config.js";

const app = express();
app.use(express.json());
app.use(cors());
setupSwagger(app);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/files", express.static("uploads"));

const port = PORT;

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "StockFlow API is running",
    data: null,
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server Running On ${port}`);
});
