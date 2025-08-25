import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { db } from "./db/db.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import adminApiRouter from "./routes/adminApiRoutes.js";
import { AdminPage } from "./controller/adminController.js";
import mapRoutes from "./routes/mapRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.TOKEN_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", adminApiRouter);
app.get("/admin/dashboard", AdminPage);
app.use("/", mapRoutes);

// Start server after DB connects
db().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
