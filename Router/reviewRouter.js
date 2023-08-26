const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authContoller");

const router = express.Router();

router.post(
  "/:recipeId",
  authController.protect,

  reviewController.createReview
);
router.put(
  "/:reviewId/:recipeId",
  authController.protect,
  reviewController.updateReview
);
router.delete(
  "/:reviewId",
  authController.protect,
  reviewController.deleteReview
);
router.get("/:userId/review", reviewController.getYourReview);

module.exports = router;
