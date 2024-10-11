const { validationResult } = require("express-validator");
const db = require("../db/queries");

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
	console.log("... creation of user...");
	console.log(req.body.nickname, " ", req.body.pwd);
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("signUpPage", {
				errors: errors.array(),
			});
		}
		try {
			await db.createUser(req.body.nickname, req.body.pwd);
			res.render("mainPage");
		} catch (error) {
			console.error("Error creating user: ", error);
			res.status(500).send("Internal Server Error");
		}
	} catch (err) {
		next(err);
	}
};

exports.authUser = async (req, res, next) => {
	console.log("...auth ...");
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("logInPage", {
				errors: errors.array(),
			});
		}
		res.redirect("/mainPage");
	} catch (err) {
		next(err);
	}
};
