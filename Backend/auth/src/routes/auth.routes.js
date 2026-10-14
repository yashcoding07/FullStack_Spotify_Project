import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as validationRules from "../middlewares/validation.middleware.js";
import passport from "passport";

const router = express.Router();

router.post(
  "/register",
  validationRules.registerUserValidationRules,
  authController.register,
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    authController.googleAuthCallback
);

router.post(
  "/login",
  validationRules.loginUserValidation,
  authController.login
)
export default router;