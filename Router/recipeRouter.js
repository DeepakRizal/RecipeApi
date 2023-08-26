const express = require("express");
const recipeController = require("./../controllers/recipeController");
const { getAllRecipeReview } = require("../controllers/reviewController");

const router = express.Router();

router.get("/", recipeController.getAllRecipies);

router.get("/:name", recipeController.getRecipe);
router.get(
  "/ingredient/:name",
  recipeController.getAllRecipeThroughIngredients
);
router.get("/:recipeId/reviews", recipeController.getAllRecipeReview);

module.exports = router;
