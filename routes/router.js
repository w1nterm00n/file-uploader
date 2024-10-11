const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { signUpValidate, logInValidate } = require("../validations/validation");

router.get("/", controller.getWelcomePage);
router.get("/logIn", controller.getlogInPage);
router.get("/signUp", controller.getSignUpPage);
router.get("/main", controller.getMainPage);

router.post("/user/create", signUpValidate, controller.createUser);
router.post("/user/auth", logInValidate, controller.authUser);

module.exports = router;
