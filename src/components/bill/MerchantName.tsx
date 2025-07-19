import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Pencil, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BillFormValues } from '@/types/billForm';
import { getDefaultBillName } from '@/utils/bill';

const fieldNameOriginal = 'name.original';
// const fieldNameEnglish = 'name.english';

const MerchantName: React.FC = () => {
	const [isEditingName, setIsEditingName] = useState(false);
	const form = useFormContext<BillFormValues>();
	const { t } = useTranslation();

	const handleEditToggle = () => {
		setIsEditingName((prev) => !prev);
	};

	const handleSaveName = () => {
		setIsEditingName(false);
		if (form.getValues(fieldNameOriginal).trim() === '') {
			form.setValue(fieldNameOriginal, getDefaultBillName(t('bill'), form.getValues('id')));
			form.trigger(fieldNameOriginal);
		}
	};

	return (
		<div className="flex flex-col">
			{isEditingName ? (
				<FormField
					name={fieldNameOriginal}
					render={({ field }) => (
						<FormItem className="flex flex-row items-center gap-2">
							<FormControl>
								<Input {...field} autoFocus className="h-8 text-lg font-semibold" />
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
				<div className="flex items-center gap-1">
					<h1 className="block text-3xl font-semibold" onClick={handleEditToggle}>
						{/* TODO: default bill name to ID */}
						{form.getValues(fieldNameOriginal) || t('untitled')}
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
				</div>
			)}
			{/* {form.getValues(fieldNameEnglish) && (
				<p className="text-muted-foreground text-base font-normal">{form.getValues(fieldNameEnglish)}</p>
			)} */}
		</div>
	);
};

export default MerchantName;
