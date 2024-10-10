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
