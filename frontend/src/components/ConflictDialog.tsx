import { useContext, useEffect, useRef } from "react";
import { UserProfileContext } from "../context/UserProfileContext";
import { Profile, UserProfileProps } from "../common/types";

interface ProfileOptionProps {
	profile: Profile;
	onSelect: (profile: Profile) => void;
}

interface ConflictDialogProps {
	conflicts: Profile[] | null;
}

const ProfileOption = ({ profile, onSelect }: ProfileOptionProps) => (
	<button
		onClick={() => onSelect(profile)}
		type="submit"
		className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded grid"
	>
		<span>{profile.name}</span>
		<span>{profile.email}</span>
		<span>{new Date(profile.createdAt).toDateString()}</span>
		<span>{new Date(profile.createdAt).toLocaleTimeString()}</span>
	</button>
);

const ConflictDialog = ({ conflicts }: ConflictDialogProps) => {
	const { onConflictResolutionSelect } = useContext(UserProfileContext as unknown as React.Context<UserProfileProps>);

	const dialog = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!dialog.current) return;
		dialog.current.showModal();
	}, []);

	return (
		<dialog ref={dialog} className="p-4 grid space-y-4 rounded" id="modal">
			<h1 className="text-red-800 text-center text-lg font-semibold">
				There is a conflict between the local and server data.
				<br />
				Please select which version you would like to keep.
			</h1>
			{conflicts ? (
				<div className="grid gap-4 grid-cols-2">
					{conflicts?.map((profile, index) => (
						<ProfileOption
							key={index}
							profile={profile}
							onSelect={onConflictResolutionSelect}
						/>
					))}
				</div>
			) : null}
		</dialog>
	);
};

export default ConflictDialog;
