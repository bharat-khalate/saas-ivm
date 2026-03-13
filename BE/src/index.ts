import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/products.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import categoryRouter from "./routes/category.route.js";
import fileRouter from "./routes/file.routes.js";



const app = express();
app.use(express.json());
app.use(cors());


// const upload = multer({ dest: "uploads/" });

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log(req.file);
//   res.send("File uploaded");
// });
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/files", express.static("uploads"));










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
