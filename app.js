const express = require("express");
const app = express();
const router = require("./routes/router");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//задаю шаблонизатор ejs
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
//

//  обработка корневого маршрута (чтобы не было ошибки Cannot GET /)
app.use("/", router);
app.get("/", (req, res) => {
	res.render("welcomePage");
});
//

//prisma stuff, I wil move it to queries.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
	const allUsers = await prisma.user.findMany();
	console.log("all users:", allUsers);

	// const user = await prisma.user.create({
	//     data: {
	//       email: 'elsa@prisma.io',
	//       name: 'Elsa Prisma',
	//     },
	// })
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
//prisma stuff, I wil move it to queries.js

//настройка порта
const PORT = 3015;
const server = app.listen(PORT, () =>
	console.log(`Express app listening on port ${PORT}!`)
);
