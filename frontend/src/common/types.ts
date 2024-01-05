export interface Profile {
	id: number;
	name: string;
	email: string;
	createdAt: string;
}

export interface SaveProfile extends Partial<Pick<Profile, 'name' | 'email'>> {}

export interface UserProfileProps {
	profile: Profile;
	saveOrCreateProfile: (data: object) => void;
	isOnline: boolean;
	isLoading: boolean;
	pendingConflicts: Profile[] | null;
	onConflictResolutionSelect: (profile: Profile) => void;
}
