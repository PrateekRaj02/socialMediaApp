const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const dbConnect = require("./dbConnect");
const authRouter = require("./router/authRouter");
const postRouter = require("./router/postRouter");
const userRouter = require("./router/userRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config({ path: "./.env" });

// Configuration
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);

dbConnect();

app.listen(PORT, () => console.log(`Listing on port ${PORT}`));
