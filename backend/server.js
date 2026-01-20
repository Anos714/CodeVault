import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectToDB } from "./database/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(cookieParser());

//routes
app.use("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    msg: "pong",
  });
});

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    throw new Error(error.message);
  });
