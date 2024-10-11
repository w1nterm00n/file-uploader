const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { signUpValidate, logInValidate } = require("../validations/validation");
const passport = require("passport"); //

router.get("/", controller.getWelcomePage);
router.get("/logIn", controller.getlogInPage);
router.get("/signUp", controller.getSignUpPage);
router.post("/user/create", signUpValidate, controller.createUser);
// router.get("/main", (req, res) => {
// 	res.render("mainPage", { user: req.user });
// });
router.get("/main", controller.getMainPage);

router.get("/folder/create", (req, res) => {
	res.render("folderFormPage", { user: req.user });
});

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

router.get("/log-out", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

module.exports = router;
