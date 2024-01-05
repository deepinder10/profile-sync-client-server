const { getUser, createUser, updateUser } = require("./user.service");
const prisma = require("../prisma");

jest.mock("../prisma", () => ({
	user: {
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	},
}));

const mockUserData = { id: 1, name: "John Doe", email: "john@example.com" };

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getUser", () => {
	test("should retrieve a user successfully", async () => {
		prisma.user.findUnique.mockResolvedValue(mockUserData);

		const user = await getUser(mockUserData.id);
		expect(user).toEqual(mockUserData);
		expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
	});

	test("should handle errors when retrieving a user", async () => {
		prisma.user.findUnique.mockRejectedValue(new Error("Failed to get user"));

		await expect(getUser(mockUserData.id)).rejects.toThrow(
			"Failed to get user"
		);
		expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
	});
});

describe("createUser", () => {
	test("should create a new user successfully", async () => {
		prisma.user.create.mockResolvedValue(mockUserData);

		const newUser = await createUser(mockUserData);
		expect(newUser).toEqual(mockUserData);
		expect(prisma.user.create).toHaveBeenCalledWith({ data: mockUserData });
		expect(prisma.user.create).toHaveBeenCalledTimes(1);
	});

	test("should handle errors when creating a user", async () => {
		prisma.user.create.mockRejectedValue(new Error("Failed to create user"));

		await expect(createUser(mockUserData)).rejects.toThrow(
			"Failed to create user"
		);
		expect(prisma.user.create).toHaveBeenCalledTimes(1);
	});
});

describe("updateUser", () => {
	const userId = mockUserData.id;

	test("should update an existing user successfully", async () => {
		prisma.user.findUnique.mockResolvedValue(mockUserData);
		prisma.user.update.mockResolvedValue({ ...mockUserData, name: "Jane Doe" });

		const updatedUser = await updateUser(userId, { name: "Jane Doe" });
		expect(updatedUser.name).toBe("Jane Doe");
		expect(prisma.user.update).toHaveBeenCalledWith({
			where: { id: userId },
			data: { name: "Jane Doe" },
		});
		expect(prisma.user.update).toHaveBeenCalledTimes(1);
	});

	test("should handle errors when updating a user", async () => {
		prisma.user.findUnique.mockResolvedValue(mockUserData);
		prisma.user.update.mockRejectedValue(new Error("Failed to update user"));

		await expect(updateUser(userId, mockUserData)).rejects.toThrow(
			"Failed to update user"
		);
		expect(prisma.user.update).toHaveBeenCalledTimes(1);
	});
});
