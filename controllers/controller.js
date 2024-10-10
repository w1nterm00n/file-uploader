const { validationResult } = require("express-validator");

exports.getWelcomePage = (req, res) => {
	res.render("welcomePage");
};

exports.getlogInPage = (req, res) => {
	res.render("logInPage");
};

exports.getSignUpPage = (req, res) => {
	res.render("signUpPage");
};

exports.getMainPage = (req, res) => {
	res.render("mainPage");
};

exports.createUser = async (req, res, next) => {
	console.log("here will be creation of user");
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("signUpPage", {
				errors: errors.array(),
			});
		}
		res.redirect("/mainPage");
	} catch (err) {
		next(err);
	}
};
