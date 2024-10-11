const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { signUpValidate, logInValidate } = require("../validations/validation");
const passport = require("passport"); //

router.get("/", controller.getWelcomePage);
router.get("/logIn", controller.getlogInPage);
router.get("/signUp", controller.getSignUpPage);
router.post("/user/create", signUpValidate, controller.createUser);

router.post(
	"/user/auth",
	logInValidate,
	passport.authenticate("local", {
		failureRedirect: "/logIn",
		failureFlash: true,
	}),
	(req, res) => {
		res.redirect("/main");
	}
);

router.get("/main", (req, res) => {
	res.render("mainPage", { user: req.user });
});

module.exports = router;
