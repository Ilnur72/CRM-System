const express = require("express");
const genValidator = require("../shared/validator");
const { isLoggedIn, hasRole } = require("../shared/auth");
const schemas = require("../controllers/direction/schemas");
const {
  getDirections,
  showDirections,
  postDirections,
  patchDirections,
  deleteDirection,
} = require("../controllers/direction");

const mGerDirections = [isLoggedIn];
const mShowDirections = [isLoggedIn];
const mPostDirections = [
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  genValidator(schemas.postDirection),
];
const mPatchDirections = [isLoggedIn, hasRole(["admin", "super_admin"])];
const mDeleteDirection = [isLoggedIn, hasRole(["admin", "super_admin"])];

const router = express.Router();
router.get("/directions", mGerDirections, getDirections);
router.get("/directions/:id", mShowDirections, showDirections);
router.post("/directions", mPostDirections, postDirections);
router.patch("/directions/:id", mPatchDirections, patchDirections);
router.delete("/directions/:id", mDeleteDirection, deleteDirection);

module.exports = router;
