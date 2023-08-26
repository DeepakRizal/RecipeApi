const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  rating: Number,
  review: String,
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
