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
					await db.createDefaultFolder(req.body.nickname);
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

//main
exports.getMainPage = async (req, res, next) => {
	try {
		let lastFolder = await db.getLastFolder(req.user);
		let allFolders = await db.getAllFolders(req.user);
		res.render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "lastFolder",
			folder: lastFolder,
		});
	} catch (err) {
		return next(err);
	}
};

exports.getFolderForm = async (req, res, next) => {
	try {
		let allFolders = await db.getAllFolders(req.user);
		res.render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "newFolderForm",
		});
	} catch (err) {
		return next(err);
	}
};

exports.createNewFolder = async (req, res, next) => {
	let allFolders = await db.getAllFolders(req.user);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "newFolderForm",
			errors: errors.array(),
		});
	}

	try {
		await db.createFolder(req.body.name, req);
		res.redirect("/folders/last");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
};

exports.getFolderById = async (id, req, res) => {
	try {
		let allFolders = await db.getAllFolders(req.user);
		let folder = await db.getFolder(id);

		if (!folder) {
			return res.status(404).render("mainPage", {
				user: req.user,
				folders: allFolders,
				content: "error",
				errorMessage: "Folder not found",
			});
		}

		res.render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "folder",
			folder: folder,
		});
	} catch (err) {
		console.error(err); // Логируем ошибку
		res.status(500).render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "error",
		});
	}
};

exports.getFileForm = async (req, res, next) => {
	try {
		let allFolders = await db.getAllFolders(req.user);
		res.render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "newFileForm",
		});
	} catch (err) {
		return next(err);
	}
};

exports.deleteFolderById = async (id, req, res) => {
	await db.deleteFolder(id);
	res.redirect("/folders/last");
};
