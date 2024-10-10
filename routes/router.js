const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.getWelcomePage);
router.get("/logIn", controller.getlogInPage);
router.get("/signUp", controller.getSignUpPage);
router.get("/main", controller.getMainPage);

module.exports = router;
