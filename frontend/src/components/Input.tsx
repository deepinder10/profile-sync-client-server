import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { SaveProfile } from "../common/types";

interface InputProps {
	label: string;
	fieldName: keyof SaveProfile;
	register: UseFormRegister<SaveProfile>;
	errors: FieldErrors<SaveProfile>;
	isDirty: boolean;
	validationObject?: object;
}

export default function Input({
	label,
	fieldName,
	register,
	errors,
	isDirty,
	validationObject = {},
}: InputProps) {
	return (
		<div className="text-left">
			<label className="block text-sm font-medium text-gray-700">{label}</label>

			<input
				data-testid={fieldName}
				{...register(fieldName, validationObject)}
				className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
			/>
			<ErrorMessage
				errors={errors}
				name={fieldName}
				render={({ message }) =>
					isDirty && <p className="text-red-900 text-sm">{message}</p>
				}
			/>
		</div>
	);
}
