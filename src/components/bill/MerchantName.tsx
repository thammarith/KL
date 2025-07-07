import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Pencil, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BillFormValues } from '@/types/billForm';

const fieldName = 'merchant.name.original';

const MerchantName: React.FC = () => {
	const [isEditingName, setIsEditingName] = useState(false);
	const form = useFormContext<BillFormValues>();
	const { t } = useTranslation();

	const handleEditToggle = () => {
		setIsEditingName((prev) => !prev);
	};

	const handleSaveName = () => {
		setIsEditingName(false);
		if (form.getValues(fieldName).trim() === '') {
			form.setValue(fieldName, `${t('bill')} #${form.getValues('id')}`);
			form.trigger(fieldName);
		}
	};

	return (
		<div className="flex items-center gap-1">
			{isEditingName ? (
				<FormField
					name={fieldName}
					render={({ field }) => (
						<FormItem className="flex flex-row items-center gap-2">
							<FormControl>
								<Input {...field} autoFocus className="h-8 text-lg font-bold" />
							</FormControl>
							<Button
								type="button"
								size="icon"
								variant="ghost"
								onClick={handleSaveName}
								aria-label={t('save') || 'Save'}
							>
								<Check className="h-4 w-4" />
							</Button>
						</FormItem>
					)}
				/>
			) : (
				<>
					<h1 className="inline-block text-lg font-bold" onClick={handleEditToggle}>
						{/* TODO: default bill name to ID */}
						{form.getValues(fieldName) || t('untitled')}
					</h1>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						onClick={handleEditToggle}
						aria-label={t('edit') || 'Edit'}
					>
						<Pencil className="h-4 w-4" />
					</Button>
				</>
			)}
		</div>
	);
};

export default MerchantName;
