const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const recipeRouter = require("./Router/recipeRouter");
const userRouter = require("./Router/userRouter");
const reviewRouter = require("./Router/reviewRouter");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

dotenv.config({ path: "./config.env" });

const DB = process.env.MONGODB_URI.replace("<password>", process.env.PASSWORD);
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connection to DB successfull");
  });

app.use(express.json());
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// app.use((err, req, res, next) => {
//   statusCode = err.statusCode || 500;
//   message = err.message || "Internal server Error";

//   res.status(statusCode).json({
//     success: false,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

app.listen(4000, () => {
  console.log("Connected to 4000");
});
