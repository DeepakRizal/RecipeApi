const Review = require("./../modal/reviewModal");
const catchAsync = require("./../utils/catchAsyc");
const AppError = require("./../utils/AppError");
const Recipe = require("./../modal/recipeModal");

exports.createReview = catchAsync(async (req, res, next) => {
  // Check if the user has already reviewed this recipe
  const existingReview = await Review.findOne({
    userId: req.body.userId,
    recipeId: req.body.recipeId,
  });

  if (existingReview) {
    return next(
      new AppError("You have already reviewed this recipe you can update it ")
    );
  }

  const review = await Review.create({
    userId: req.body.userId,
    recipeId: req.body.recipeId,
    rating: req.body.rating,
    review: req.body.review,
  });

  const { recipeId } = review;

  const allReviews = await Review.find({ recipeId });

  // Calculate new ratingsAverage and ratingsCounts
  let totalRatings = 0;
  allReviews.forEach((review) => {
    totalRatings += review.rating;
  });

  const ratingCounts = allReviews.length;
  const ratingsAverage = totalRatings / ratingCounts;

  // Update the recipe with the new ratingsAverage and ratingsCounts
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    { ratingCounts, ratingsAverage },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    review,
    updatedRecipe,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { rating, review, userId } = req.body;
  const { recipeId, reviewId } = req.params;

  const findReview = await Review.findOne({ userId, recipeId });

  if (!findReview.userId.equals(userId)) {
    return next(
      new AppError(
        "You have not written a review. Please write a review to update it.",
        400
      )
    );
  }
  // Find the review
  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { rating, review },
    { new: true, runValidators: true }
  );

  // Find all reviews for the same recipe
  const allReviews = await Review.find({ recipeId });

  // Calculate new ratingsAverage and ratingsCounts
  let totalRatings = 0;
  allReviews.forEach((review) => {
    totalRatings += review.rating;
  });

  const ratingCounts = allReviews.length;
  const ratingsAverage = totalRatings / ratingCounts;

  // Update the recipe with the new ratingsAverage and ratingsCounts
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    { ratingCounts, ratingsAverage },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    updatedReview,
    updatedRecipe,
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;

  const reviewToDelete = await Review.findById(reviewId);

  if (!reviewToDelete) {
    return next(new AppError("review not found", 404));
  } else {
    await Review.findByIdAndDelete(reviewId);
  }
  res.status(200).json({
    message: "Review has been deleted successfully",
  });
});

exports.getYourReview = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  const userReview = await Review.findOne({ userId: userId }).select(
    "review rating"
  );
  res.status(200).json({ review: userReview });
});
