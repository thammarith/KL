import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddItemInputProps {
	itemName: string;
	itemPrice: string;
	setItemName: (v: string) => void;
	setItemPrice: (v: string) => void;
	onAdd: () => void;
	onCancel?: () => void;
}

const AddItemInput: React.FC<AddItemInputProps> = ({
	itemName,
	itemPrice,
	setItemName,
	setItemPrice,
	onAdd,
	onCancel,
}) => {
	const { t } = useTranslation();
	return (
		<div className="mt-2 flex items-center gap-2">
			<Input
				type="text"
				value={itemName}
				onChange={(e) => setItemName(e.target.value)}
				placeholder={t('itemName')}
			/>
			<Input
				type="text"
				value={itemPrice}
				onChange={(e) => setItemPrice(e.target.value)}
				placeholder={t('price')}
			/>
			<Button type="button" onClick={onAdd}>
				{t('add')}
			</Button>
			{onCancel && (
				<Button type="button" onClick={onCancel} variant="ghost" size="sm" title={t('cancel')}>
					<X size={18} />
				</Button>
			)}
		</div>
	);
};

export default AddItemInput;
