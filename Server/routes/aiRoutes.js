const express = require("express");

const router = express.Router();

const {
  generateTryOn,
  getSmartFashionSuggestion
} = require("../controllers/aiController");


// TRY ON ROUTE
router.post("/tryon", generateTryOn);


// AI SUGGESTION ROUTE
router.post(
  "/smart-suggestion",
  getSmartFashionSuggestion
);


module.exports = router;