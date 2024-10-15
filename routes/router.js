const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const {
	signUpValidate,
	logInValidate,
	newFolderValidate,
} = require("../validations/validation");
const passport = require("passport"); //

router.get("/", controller.getWelcomePage);

//logIn & signUp & logOut
router.get("/logIn", controller.getlogInPage);
router.post(
	"/logIn",
	logInValidate,
	passport.authenticate("local", {
		failureRedirect: "/logIn",
		failureFlash: true,
	}),
	(req, res) => {
		res.redirect("/main/folders/last");
	}
);
router.get("/signUp", controller.getSignUpPage);
router.post("/signUp", signUpValidate, controller.createUser);
router.get("/log-out", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});
//logIn & signUp & logOut

router.get("/main/folders/last", controller.getMainPage);
router.get("/main/folders/create", controller.getFolderForm);
router.post(
	"/main/folders/create",
	newFolderValidate,
	controller.createNewFolder
);

module.exports = router;
