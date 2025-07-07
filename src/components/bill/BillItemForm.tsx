import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';

interface BillItemFormProps {
	item?: { name: string; amount: string };
	onSave: (item: { name: string; amount: string }) => void;
	onCancel?: () => void;
}

const BillItemForm: React.FC<BillItemFormProps> = ({ item, onSave, onCancel }) => {
	const { t } = useTranslation();
	const [name, setName] = useState(item?.name || '');
	const [amount, setAmount] = useState(item?.amount || '');

	useEffect(() => {
		setName(item?.name || '');
		setAmount(item?.amount || '');
	}, [item]);

	const handleSave = () => {
		onSave({ name, amount });
		if (!item) {
			setName('');
			setAmount('');
		}
	};

	const isEditing = !!item;
	const isDisabled = !name || !amount;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<Input
					id="item-name"
					className="w-full"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder={t('itemName')}
					required
				/>
				<div className="w-32">
					<Input
						id="item-amount"
						type="text"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder={t('price')}
						required
					/>
				</div>
			</div>
			<div className="flex self-end">
				<Button
					type="button"
					variant={isEditing || isDisabled ? 'ghost' : 'default'}
					disabled={isDisabled}
					onClick={handleSave}
					aria-label={isEditing ? t('save') : t('add')}
				>
					{isEditing ? (
						<>
							<CheckIcon className="h-4 w-4" />
							{t('save')}
						</>
					) : (
						<>
							<PlusIcon className="h-4 w-4" /> {t('add')}
						</>
					)}
				</Button>
				{onCancel && (
					<Button type="button" variant="ghost" onClick={onCancel} aria-label={t('cancel')}>
						<XIcon className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
};

export default BillItemForm;
