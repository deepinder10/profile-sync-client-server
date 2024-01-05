const userService = require("../services/user.service");

const getUser = async (req, res) => {
	try {
		const { id: userId } = req.params;
		const user = await userService.getUser(userId);
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
};

const createUser = async (req, res) => {
	try {
		const user = await userService.createUser(req.body);
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
}

const updateUser = async (req, res) => {
	try {
		const { id: userId } = req.params;
		const updatedUser = await userService.updateUser(userId, req.body);
		res.json(updatedUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
};

module.exports = { getUser, createUser,  updateUser };
