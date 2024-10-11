const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser(nickname, password) {
	await prisma.user.create({
		data: {
			nickname: nickname,
			password: password,
		},
	});
}

module.exports = {
	createUser,
};
