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

async function getAllUsers() {
	const users = await prisma.user.findMany({
		orderBy: {
			id: "desc",
		},
	});
	return users;
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
	return folders;
}

async function createFolder(name, req) {
	const authorId = req.session.passport.user;
	await prisma.folder.create({
		data: {
			name: name,
			authorId: authorId,
		},
	});
}

async function getFolder(id) {
	const folder = await prisma.folder.findUnique({
		where: {
			id: id,
		},
		include: {
			files: true,
		},
	});
	return folder;
}

async function deleteFolder(id) {
	await prisma.folder.delete({
		where: {
			id: id,
		},
	});
}

async function deleteFile(id) {
	await prisma.file.delete({
		where: {
			id: id,
		},
	});
}

async function createFile(name, original_name, type, size, url, folderId) {
	await prisma.file.create({
		data: {
			name: name,
			original_name: original_name,
			type: type,
			size: size,
			cloud_url: url,
			folderId: folderId,
		},
	});
}

async function getFile(id) {
	const file = await prisma.file.findUnique({
		where: {
			id: id,
		},
	});
	return file;
}

module.exports = {
	createUser,
	getAllUsers,
	createDefaultFolder,
	getLastFolder,
	getAllFolders,
	createFolder,
	getFolder,
	deleteFolder,
	createFile,
	getFile,
	deleteFile,
};
