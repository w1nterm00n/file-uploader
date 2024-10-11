const { validationResult } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");

exports.getWelcomePage = (req, res) => {
	res.render("welcomePage");
};

exports.getlogInPage = (req, res) => {
	const messages = req.flash("error"); // Получаем сообщения об ошибках
	res.render("logInPage", { messages });
};

exports.getSignUpPage = (req, res) => {
	res.render("signUpPage");
};

exports.createUser = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("signUpPage", {
				errors: errors.array(),
			});
		}
		try {
			bcrypt.hash(req.body.pwd, 10, async (err, hashedPassword) => {
				if (err) {
					return next(err);
				}
				try {
					await db.createUser(req.body.nickname, hashedPassword);
					res.redirect("/logIn");
				} catch (err) {
					return next(err); // Обработка ошибок при сохранении в базе данных
				}
			});
			// await db.createUser(req.body.nickname, req.body.pwd);
			// res.redirect("/logIn");
		} catch (error) {
			console.error("Error creating user: ", error);
			res.status(500).send("Internal Server Error");
		}
	} catch (err) {
		next(err);
	}
};
