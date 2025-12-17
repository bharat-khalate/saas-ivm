import express,{ Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/products.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";



const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

const port = Number(process.env.PORT) || 5000;

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
