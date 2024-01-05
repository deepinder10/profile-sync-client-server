import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { UserProfileContext } from "../context/UserProfileContext";
import UserProfile from "../containers/UserProfile";

// Mock the context
const mockContext = {
	profile: null,
	saveOrCreateProfile: vi.fn(),
	isOnline: true,
	isLoading: false,
	pendingConflicts: null,
	fetchOrCreateProfile: vi.fn(),
	onConflictResolutionSelect: vi.fn(),
};

const TEST_USER = {
	name: "Test User",
	email: "deepinder@abc.com",
	createdAt: "2021-09-01T00:00:00.000Z",
};

beforeAll(() => {
	HTMLDialogElement.prototype.show = vi.fn();
	HTMLDialogElement.prototype.showModal = vi.fn();
	HTMLDialogElement.prototype.close = vi.fn();
});

function renderUserProfile() {
	return render(
		<UserProfileContext.Provider value={mockContext}>
			<UserProfile />
		</UserProfileContext.Provider>
	);
}

describe("UserProfile", () => {
	it("renders loading state", () => {
		mockContext.isLoading = true;
		renderUserProfile();
		expect(screen.getByText("Loading...")).toBeInTheDocument();
		mockContext.isLoading = false;
	});

	it("renders no profile found message", () => {
		mockContext.profile = null;
		renderUserProfile();
		expect(
			screen.getByText("No profile found. Create a new user below.")
		).toBeInTheDocument();
	});

	describe("Creating a new profile", () => {
		beforeEach(() => {
			mockContext.isOnline = true;
			mockContext.profile = null; // Simulate no existing profile
			renderUserProfile();
		});

		it("calls createUserOnServer and saves profile to local storage", async () => {
			// Simulate user creating a profile
			const nameInput = screen.getByTestId("name");
			const emailInput = screen.getByTestId("email");
			const saveButton = screen.getByTestId("saveBtn");

			fireEvent.change(nameInput, { target: { value: TEST_USER.name } });
			fireEvent.change(emailInput, { target: { value: TEST_USER.email } });
			fireEvent.click(saveButton);

			await waitFor(() => {
				expect(mockContext.saveOrCreateProfile).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("Updating an user profile", () => {
		beforeEach(() => {
			mockContext.profile = TEST_USER;
			renderUserProfile();
		});

		it("calls updateProfile with the new profile", async () => {
			const newName = "Updated Name";
			const updatedProfile = { email: TEST_USER.email, name: newName };

			const nameInput = screen.getByTestId("name");
			const saveButton = screen.getByTestId("saveBtn");

			fireEvent.change(nameInput, {
				target: { value: newName },
			});

			fireEvent.click(saveButton);

			await waitFor(() =>
				expect(mockContext.saveOrCreateProfile).toHaveBeenCalledWith(updatedProfile)
			);
		});
	});

	describe("when profile is available", () => {
		beforeEach(() => {
			mockContext.profile = TEST_USER;
			renderUserProfile();
		});

		it("renders profile", () => {
			expect(screen.getByDisplayValue(TEST_USER.name)).toBeInTheDocument();
		});
	});

	describe("when there are pending conflicts", () => {
		beforeEach(() => {
			mockContext.pendingConflicts = [TEST_USER];
			renderUserProfile();
		});

		it("calls onConflictResolutionSelect", () => {
			fireEvent.click(screen.getByText(TEST_USER.name));
			expect(mockContext.onConflictResolutionSelect).toHaveBeenCalled();
		});
	});
});
