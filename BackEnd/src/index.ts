import dotenv from "dotenv";
import express from "express";
import apiRouter from "./domain/routes/api.js"; // Đường dẫn router đã đổi
import { initPool } from "./application/constant/databaseConnection.js";
import { readOnly } from "./application/config/readPublic.js";

// 🔧 Load .env theo môi trường
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "local"}`
});

const app = express();

// 🧩 Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Đọc file tĩnh (public)
readOnly(app);

// ⚙️ Khởi tạo kết nối Oracle Pool (chạy 1 lần duy nhất khi start server)
(async () => {
  try {
    await initPool();
  } catch (err) {
    process.exit(1); // Dừng server nếu kết nối DB lỗi
  }
})();

// 🛣️ Khai báo route
app.use("/", apiRouter);

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
