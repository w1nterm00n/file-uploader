const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const {
	signUpValidate,
	logInValidate,
	newFolderValidate,
	newFileValidate,
} = require("../validations/validation");
const passport = require("passport");
//multer
const multer = require("multer");
const storage = multer.memoryStorage(); // Используем память для хранения файлов
const upload = multer({ storage: storage });
//multer

router.get("/", controller.getWelcomePage);

//logIn & signUp & logOut
router.get("/signUp", controller.getSignUpPage);
router.post("/signUp", signUpValidate, controller.createUser);
router.get("/logIn", controller.getlogInPage);
router.post(
	"/logIn",
	logInValidate,
	passport.authenticate("local", {
		failureRedirect: "/logIn",
		failureFlash: true,
	}),
	(req, res) => {
		res.redirect("/folders/last");
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
//logIn & signUp & logOut

router.get("/folders/last", controller.getMainPage);
router.get("/folders/create", controller.getFolderForm);
router.post("/folders/create", newFolderValidate, controller.createNewFolder);
router.get("/folders/:id", (req, res) => {
	const id = parseInt(req.params.id, 10);
	controller.getFolderById(id, req, res);
});
router.delete("/folders/:id", (req, res) => {
	const id = parseInt(req.params.id, 10);
	controller.deleteFolderById(id, req, res);
});
router.get("/folders/:id/files/create", controller.getFileForm);
router.post(
	"/folders/:id/files/create",
	upload.single("uploadedFile"),
	newFileValidate,
	controller.postFileForm
);
router.get("/folders/:id/files/:id", controller.getFileById);

router.delete("/folders/:folderId/files/:fileId", (req, res) => {
	controller.deleteFileById(req, res);
});

router.get("/download-file/:fileId", controller.downloadFile);

module.exports = router;
