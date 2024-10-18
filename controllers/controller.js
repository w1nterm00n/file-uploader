const { validationResult } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");

const supabaseUrl = "https://ajiieetzcagbtqatazpu.supabase.co"; // URL проекта Supabase
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaWllZXR6Y2FnYnRxYXRhenB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMDY4NjYsImV4cCI6MjA0NDU4Mjg2Nn0.Q-1J4MFWAXfbiTjO2ENyqljVYTW7_Iu4DODOc2lf5-c"; // Публичный ключ API
const supabase = createClient(supabaseUrl, supabaseKey);

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
		const id = parseInt(req.params.id, 10);
		let folder = await db.getFolder(id);

		res.render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "newFileForm",
			folder: folder,
		});
	} catch (err) {
		return next(err);
	}
};

exports.deleteFolderById = async (id, req, res) => {
	await db.deleteFolder(id);
	res.redirect("/folders/last");
};

exports.postFileForm = async (req, res, next) => {
	let allFolders = await db.getAllFolders(req.user);
	const errors = validationResult(req);
	const uploadedFile = req.file;
	const fileName = req.body.name;
	const folderId = parseInt(req.params.id, 10);

	if (uploadedFile) {
		const fileUrl = await uploadFile(fileName, uploadedFile);

		if (fileUrl) {
			try {
				await db.createFile(
					fileName,
					uploadedFile.originalname,
					uploadedFile.mimetype,
					uploadedFile.size,
					fileUrl,
					folderId
				);
			} catch (err) {
				console.error(err);
				res.status(500).send("Server Error");
			}
		}
	}

	if (!errors.isEmpty()) {
		const id = parseInt(req.params.id, 10);
		let folder = await db.getFolder(id);
		return res.status(400).render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "newFileForm",
			errors: errors.array(),
			folder: folder,
		});
	}
	try {
		res.redirect(`/folders/${folderId}`);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
};

exports.getFileById = async (req, res) => {
	const id = parseInt(req.params.id, 10);
	console.log("id of file: ", id);
	try {
		let allFolders = await db.getAllFolders(req.user);
		let file = await db.getFile(id);
		let folder = await db.getFolder(file.folderId);
		res.render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "file",
			file: file,
			folder: folder,
		});
	} catch (err) {
		console.error(err);
		res.status(500).render("mainPage", {
			user: req.user,
			folders: allFolders,
			content: "error",
		});
	}
};

exports.deleteFileById = async (req, res) => {
	const folderId = parseInt(req.params.folderId, 10);
	const fileId = parseInt(req.params.fileId, 10);

	await db.deleteFile(fileId);
	res.redirect(`/folders/${folderId}`);
};

exports.downloadFile = async (req, res) => {
	const fileId = parseInt(req.params.fileId, 10);
	let file = await db.getFile(fileId);

	try {
		const url = file.cloud_url;

		// Получаем файл с помощью axios
		const response = await axios({
			url: url,
			method: "GET",
			responseType: "stream", // Чтобы передать файл как поток
		});

		res.setHeader(
			"Content-Disposition",
			`attachment; filename=${file.original_name}`
		);

		// Передаём поток данных клиенту
		response.data.pipe(res);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error when uploading file");
	}
};

async function uploadFile(originalFileName, file) {
	const timestamp = Date.now();
	const fileName = `${timestamp}-${originalFileName}`;
	const filePath = `${fileName}`;
	const expirationTime = 60 * 60 * 24 * 7;

	const { data, error } = await supabase.storage
		.from("file-uploader")
		.upload(filePath, file.buffer, {
			//contentType: "image/jpeg",
		});

	if (error) {
		console.error("Error uploading file:", error.message);
		return null;
	}

	const { data: signedUrlData, error: urlError } = await supabase.storage
		.from("file-uploader")
		.createSignedUrl(filePath, expirationTime);

	if (urlError) {
		console.error("Error creating signed URL:", urlError.message);
		return null;
	}

	return signedUrlData.signedUrl;
}
