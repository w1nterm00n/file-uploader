const { body } = require("express-validator");

const existsErr = "is required";
const matchSymbolsErr = "can only contain letters, numbers, -, _ ";

const signUpValidate = [
	body("nickname")
		.exists({ checkFalsy: true })
		.withMessage(`nickname ${existsErr}`)
		.isString()
		.withMessage("nickname should be string")
		.isLength({ min: 5 })
		.withMessage("nickname must be at least 5 characters long!"),
	body("pwd")
		.trim()
		.exists({ checkFalsy: true })
		.withMessage(`Password ${existsErr}`)
		.isLength({ min: 6 })
		.withMessage(`Password must be at least 6 characters long!`)
		.matches(/^[a-zA-Z0-9-_@]+$/)
		.withMessage(`Password ${matchSymbolsErr} and @ `),
	body("pwdRepeat")
		.trim()
		.exists({ checkFalsy: true })
		.withMessage(`Password repeat ${existsErr}`)
		.isLength({ min: 6 })
		.matches(/^[a-zA-Z0-9-_@]+$/)
		.withMessage(`Password must be at least 6 characters long! `)
		.custom((value, { req }) => {
			if (value !== req.body.pwd) {
				throw new Error("Passwords do not match");
			}
			return true;
		}),
];

const logInValidate = [
	body("nickname")
		.exists({ checkFalsy: true })
		.withMessage("nickname is required")
		.isLength({ min: 5 })
		.withMessage("nickname must be at least 5 characters long!"),

	body("password")
		.trim()
		.exists({ checkFalsy: true })
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];

const newFolderValidate = [
	body("name")
		.exists({ checkFalsy: true })
		.withMessage("name is required")
		.isLength({ min: 2, max: 25 })
		.withMessage("name must be between 2 and 25 characters long!"),
];

const newFileValidate = [
	body("name")
		.exists({ checkFalsy: true })
		.withMessage("name is required")
		.isLength({ min: 2, max: 25 })
		.withMessage("name must be between 2 and 25 characters long!"),
];

module.exports = {
	signUpValidate,
	logInValidate,
	newFolderValidate,
	newFileValidate,
};
