import { useContext } from "react";
import ProfileForm from "../components/ProfileForm";
import { UserProfileContext } from "../context/UserProfileContext";
import ConflictDialog from "../components/ConflictDialog";
import { UserProfileProps } from "../common/types";

const UserProfile = () => {
	const { profile, isOnline, isLoading, pendingConflicts } =
		useContext<UserProfileProps>(UserProfileContext as unknown as React.Context<UserProfileProps>);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto flex flex-col items-center justify-center h-screen space-y-4">
				<p className="text-sm">
					Internet status: {isOnline ? <span className="text-green-600">Online</span> : <span className="text-red-600">Offline</span>}
				</p>
				{!profile && (
					<p className="text-sm text-red-800">
						No profile found. Create a new user below.
					</p>
				)}
				<ProfileForm profile={profile} />
			</div>
			{!!pendingConflicts && <ConflictDialog conflicts={pendingConflicts} />}
		</>
	);
};

export default UserProfile;
