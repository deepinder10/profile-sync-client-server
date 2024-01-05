const prisma = require("../prisma");

const getUser = async (userId) => {
	try {
		return await prisma.user.findUnique({ where: { id: Number(userId) } });
	} catch (error) {
		console.error(error);
		throw new Error("Failed to get user");
	}
};

const createUser = async (userData) => {
	try {
		return await prisma.user.create({ data: userData });
	} catch (error) {
		console.error(error);
		throw new Error("Failed to create user");
	}
};

const updateUser = async (userId, updateData) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: Number(userId) },
		});
		
		if (!user) {
			throw new Error("User not found");
		}

		let updatedUser = await prisma.user.update({
			where: { id: Number(userId) },
			data: updateData,
		});

		return updatedUser;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to update user");
	}
};

module.exports = { getUser, createUser, updateUser };
