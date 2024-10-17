const express = require("express");
const methodOverride = require("method-override");
const app = express();
app.use(methodOverride("_method"));
const router = require("./routes/router");
const path = require("path");
const flash = require("connect-flash");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const session = require("express-session"); //
const passport = require("passport"); //
const LocalStrategy = require("passport-local").Strategy; //
const { PrismaClient } = require("@prisma/client"); //
const { PrismaSessionStore } = require("@quixo3/prisma-session-store"); //
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

//задаю шаблонизатор ejs
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");
//

//всё, что касается аутентификации
app.use(
	session(
		{
			secret: "cats",
			resave: false,
			saveUninitialized: true,
			store: new PrismaSessionStore(prisma, {
				checkPeriod: 2 * 60 * 1000,
				//dbRecordIdIsSessionId: true,
			}),
		},
		(err) => {
			if (err) {
				console.error("Session save error: ", err);
			}
		}
	)
);

app.use(passport.initialize()); //
app.use(passport.session()); //
app.use(flash());

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({
				where: { nickname: username },
			});

			const match = await bcrypt.compare(password, user.password);
			if (!user) {
				return done(null, false, { message: "Incorrect username" });
			}
			if (!match) {
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: id },
		});

		done(null, user);
	} catch (err) {
		done(err);
	}
});
//всё, что касается аутентификации

//  обработка корневого маршрута (чтобы не было ошибки Cannot GET /)
app.use("/", router);
app.get("/", (req, res) => {
	res.render("welcomePage");
});
//

//настройка порта
const PORT = 3015;
const server = app.listen(PORT, () =>
	console.log(`Express app listening on port ${PORT}!`)
);
