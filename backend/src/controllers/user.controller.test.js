const {
	getUser,
	createUser,
	updateUser,
} = require("../controllers/user.controller");
const userService = require("../services/user.service");

jest.mock("../services/user.service");

describe("User Controller", () => {
	const mockUser = { name: "Jane Doe", email: "jane@example.com" };
	const mockUserWithId = { id: 1, ...mockUser };
	const mockError = new Error("Internal server error");
	let mockReq, mockRes;

	beforeEach(() => {
		mockReq = {};
		mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
	});

	describe("getUser", () => {
		beforeEach(() => {
			mockReq.params = { id: mockUserWithId.id };
		});

		test("getUser should retrieve and send user data", async () => {
			userService.getUser.mockResolvedValue(mockUser);

			await getUser(mockReq, mockRes);
			expect(mockRes.json).toHaveBeenCalledWith(mockUser);
		});
		test("should handle errors", async () => {
			userService.getUser.mockRejectedValue(mockError);

			await getUser(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message });
		});
	});

	describe("createUser", () => {
		beforeEach(() => {
			mockReq = { body: mockUser };
		});

		test("should create and send back the new user data", async () => {
			userService.createUser.mockResolvedValue(mockUser);

			await createUser(mockReq, mockRes);
			expect(userService.createUser).toHaveBeenCalledWith(mockUser);
			expect(mockRes.json).toHaveBeenCalledWith(mockUser);
		});

		test("should handle errors", async () => {
			userService.createUser.mockRejectedValue(mockError);

			await createUser(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message });
		});
	});

	describe("updateUser", () => {
		beforeEach(() => {
			mockReq = {
				params: {
					id: mockUserWithId.id,
				},
				body: mockUser,
			};
		});

		test("should update and send back the updated user data", async () => {
			userService.updateUser.mockResolvedValue(mockUser);

			await updateUser(mockReq, mockRes);
			expect(mockRes.json).toHaveBeenCalledWith(mockUser);
		});

		test("should handle errors", async () => {
			userService.updateUser.mockRejectedValue(mockError);

			await updateUser(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message });
		});
	});
});
