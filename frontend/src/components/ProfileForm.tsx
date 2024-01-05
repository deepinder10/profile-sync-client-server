import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { SaveProfile, UserProfileProps } from "../common/types";
import Input from "./Input";
import { UserProfileContext } from "../context/UserProfileContext";

interface ProfileFormProps {
	profile: SaveProfile;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
	const { saveOrCreateProfile } = useContext(UserProfileContext as unknown as React.Context<UserProfileProps>);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isDirty },
	} = useForm<SaveProfile>();

	useEffect(() => {
		setValue("name", profile?.name);
		setValue("email", profile?.email);
	}, [profile]);

	const onSubmit = (data: SaveProfile) => {
		saveOrCreateProfile(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 border bg-slate-100 rounded p-4"
		>
			<Input
				label="Name"
				fieldName="name"
				register={register}
				errors={errors}
				isDirty={isDirty}
				validationObject={{
					required: "This is a required field",
				}}
			/>
			<Input
				label="Email"
				fieldName="email"
				register={register}
				errors={errors}
				isDirty={isDirty}
				validationObject={{
					required: "This is a required field",
					pattern: {
						value: /^\S+@\S+$/i,
						message: "Please enter a valid email",
					},
				}}
			/>
			<div className="flex justify-end">
				<button
					data-testid="saveBtn"
					type="submit"
					className="inline-flex justify-center py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
				>
					Save Changes
				</button>
			</div>
		</form>
	);
};

export default ProfileForm;
