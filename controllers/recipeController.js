const AppError = require("../utils/AppError");
const Recipe = require("./../modal/recipeModal");
const Review = require("./../modal/reviewModal");
const catchAsyc = require("./../utils/catchAsyc");

exports.getAllRecipies = catchAsyc(async (req, res, next) => {
  //BUILD QUERY
  //)1filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  //2)Avanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Recipe.find(JSON.parse(queryStr));

  //2)SORTING
  if (req.query.sort) {
    query = query.sort(req.query.sort);
  }

  //3)Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields); // Use the select method properly
  } else {
    query = query.select("-__v");
  }

  //4) Pagination

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numRecipe = await Recipe.countDocuments();
    if (skip >= numRecipe)
      return next(new AppError("Page does not exist", 404));
  }
  //EXECUTE QUERY
  const recipies = await query;
  //SEND RESPONSE
  res.status(200).json({
    total: recipies.length,
    data: recipies,
  });
});

exports.getRecipe = catchAsyc(async (req, res, next) => {
  const name = req.params.name;
  const trimmedName = name.trim();
  const regexName = new RegExp(trimmedName, "i");
  const recipe = await Recipe.find({ name: regexName });

  if (recipe.length === 0) {
    return next(new AppError("Recipe does not exist ", 404));
  }

  res.status(200).json({
    status: "success",
    recipe: recipe,
  });
});

exports.getAllRecipeThroughIngredients = catchAsyc(async (req, res, next) => {
  const ingredientName = req.params.name;

  const recipes = await Recipe.find();
  const matchingRecipes = [];

  recipes.forEach((recipe) => {
    const ingredients = recipe.ingredients;

    // Check if the ingredientName is included in any of the ingredients
    const matchingIngredients = ingredients.filter((ingredient) =>
      ingredient.toLowerCase().includes(ingredientName.toLowerCase())
    );

    if (matchingIngredients.length > 0) {
      matchingRecipes.push(recipe);
    } else {
      return next(
        new AppError(
          `There is no recipe present in this app with ${ingredientName}`,
          404
        )
      );
    }
  });

  res.status(200).json({ matchingRecipes });
});
exports.getAllRecipeReview = catchAsyc(async (req, res) => {
  const reviews = await Review.find({ recipeId: req.params.recipeId })
    .select("review rating userId")
    .populate("userId", "username");

  const formattedReviews = reviews.map((review) => ({
    user: review.userId.username,
    rating: review.rating,
    review: review.review,
  }));
  res.status(200).json({
    total: formattedReviews.length,
    formattedReviews,
  });
});
