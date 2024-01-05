import { createContext, useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as apiService from "../services/api";
import * as localStorageService from "../services/localStorage";
import { PROFILE_INFO_KEY, USER_API_BASE_PATH } from "../common/keys";
import { Profile } from "../common/types";

export const UserProfileContext = createContext({});

export const UserProfileProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [pendingConflicts, setPendingConflicts] = useState<Profile[] | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);

	const saveProfileOnClient = useCallback((profile: Profile) => {
		localStorageService.setItem(PROFILE_INFO_KEY, profile);
		setProfile(profile);
	}, []);

	// Update profile data on the server and in local storage
	const updateProfile = useCallback(
		async (updatedProfile: Profile) => {
			try {
				const promise = apiService.patch(
					`${USER_API_BASE_PATH}/${updatedProfile.id}`,
					updatedProfile
				);
				toast.promise(promise, {
					loading: "Saving to server.",
					success: "Saved to server!",
					error: "Failed to save to server.",
				});
			} catch (error) {
				console.error(error);
			}

			saveProfileOnClient(updatedProfile);
		},
		[saveProfileOnClient]
	);

	const saveOrCreateProfile = useCallback((data: Profile) => {
		const localProfile = localStorageService.getItem(PROFILE_INFO_KEY);

		const userObject = {
			...data,
			id: localProfile?.id,
			createdAt: data.createdAt || new Date().toISOString(),
		};

		if (isOnline) {
			const userExistsOnServer = !!userObject.id;

			// If user is assigned an id, that means it exists on the server. We update the user else create a new one.
			if (userExistsOnServer) {
				updateProfile(userObject);
			} else {
				createUserOnServer(userObject);
			}
		} else {
			toast.success("Saving profile to local storage.");
			saveProfileOnClient(userObject);
		}
	}, [isOnline]);

	const saveDataFromClientToServer = useCallback(
		(localProfile: Profile) => {
			saveOrCreateProfile(localProfile);
		},
		[saveOrCreateProfile]
	);

	// Check for conflicts between local and server data and open conflict resolution dialog if server data is more recent than local data
	const handleDataConflicts = useCallback(
		(localProfile: Profile, serverProfile: Profile) => {
			const localDate = new Date(localProfile.createdAt);
			const serverDate = new Date(serverProfile.createdAt);

			if (localDate > serverDate) {
				// Local profile is more recent than server, update server
				saveDataFromClientToServer(localProfile);
			} else if (localDate < serverDate) {
				// Server profile is more recent than server, open conflict resolution dialog
				setPendingConflicts([localProfile, serverProfile]);
			} else {
				setProfile(localProfile);
			}
		},
		[saveDataFromClientToServer]
	);

	const handleProfileSynchronization = useCallback(
		async (localProfile: Profile, serverProfile: Profile) => {
			if (serverProfile && localProfile) {
				// If there is both a local and server profile, check for conflicts
				handleDataConflicts(localProfile, serverProfile);
			} else {
				// If there is no local or server profile, set profile to null
				setProfile(null);
			}
		},
		[handleDataConflicts]
	);

	// Fetch profile from server, compare with local changes and check for conflicts
	const fetchProfileFromServer = useCallback(async () => {
		setIsLoading(true);
		const localProfile = localStorageService.getItem(PROFILE_INFO_KEY);

		const userId = localProfile?.id;

		// If user is online, and has a profile created (we have user id) fetch profile from server and compare with local profile.
		try {
			const serverProfile = await apiService.get(
				`${USER_API_BASE_PATH}/${userId}`
			);
			handleProfileSynchronization(localProfile, serverProfile);
		} catch (error) {
			console.error(error);
			toast.error("Failed to fetch profile from server.");
			setProfile(localProfile);
		}

		setIsLoading(false);
	}, [handleProfileSynchronization]);

	const fetchProfileFromClient = useCallback(() => {
		const localProfile = localStorageService.getItem(PROFILE_INFO_KEY);

		setProfile(localProfile || null);
	}, []);

	const onConflictResolutionSelect = (profile: Profile) => {
		toast.success("Resolving conflict.");
		saveOrCreateProfile(profile);
		setPendingConflicts(null);
	};

	const createUserOnServer = async (data: Profile) => {
		try {
			const createUserPromise = apiService.post(USER_API_BASE_PATH, data);
			toast.promise(createUserPromise, {
				loading: "Creating user on server.",
				success: "User created on server!",
				error: "Failed to create user on server.",
			});

			const createdProfile = await createUserPromise;
			toast.success("Saving user id to local storage.");
			saveProfileOnClient(createdProfile);
		} catch (error) {
			console.error(error);
			saveProfileOnClient(data);
		}
	};

	const fetchOrCreateProfile = () => {
		const localProfile = localStorageService.getItem(PROFILE_INFO_KEY);

		setProfile(localProfile);
		// If user is online and has an existing profile on local storage
		if (isOnline && localProfile) {
			// If user is assigned an id, that means it exists on the server.
			const userExistsOnServer = !!localProfile.id;

			if (userExistsOnServer) {
				fetchProfileFromServer();
			} else {
				createUserOnServer(localProfile);
			}
		} else {
			// User is offline, fetch data from the local storge.
			fetchProfileFromClient();
		}
	};

	useEffect(() => {
		fetchOrCreateProfile();
	}, [isOnline]);

	// Effect to handle online/offline status
	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return (
		<UserProfileContext.Provider
			value={{
				profile,
				saveOrCreateProfile,
				isOnline,
				isLoading,
				pendingConflicts,
				onConflictResolutionSelect,
			}}
		>
			{children}
			<Toaster />
		</UserProfileContext.Provider>
	);
};
