const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: String,
  ratingsAverage: Number,
  cuisine: String,
  type: String,
  backgroundImage: String,
  ingredients: [String],
  instructions: [String],
  servings: Number,
  prepTime: String,
  cookTime: String,
  totalTime: String,
  ratingCounts: Number,
  ratingsAverage: Number,
});

const recipe = mongoose.model("Recipe", recipeSchema);

module.exports = recipe;
