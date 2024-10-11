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

async function createDefaultFolder(nickname) {
	const user = await prisma.user.findUnique({
		where: {
			nickname: nickname,
		},
	});
	await prisma.folder.create({
		data: {
			name: "Default Folder",
			authorId: user.id,
			files: [],
		},
	});
}

async function getLastFolder(user) {
	const folder = await prisma.folder.findFirst({
		where: {
			authorId: user.id,
		},
		orderBy: {
			id: "desc",
		},
		include: {
			files: true,
		},
	});
	return folder;
}

async function getAllFolders(user) {
	const folders = await prisma.folder.findMany({
		where: {
			authorId: user.id,
		},
		orderBy: {
			id: "desc",
		},
	});
	console.log(folders);
	return folders;
}

module.exports = {
	createUser,
	createDefaultFolder,
	getLastFolder,
	getAllFolders,
};
