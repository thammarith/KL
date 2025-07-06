import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditRowProps {
	editName: string;
	editPrice: string;
	setEditName: (v: string) => void;
	setEditPrice: (v: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

const EditRow: React.FC<EditRowProps> = ({ editName, editPrice, setEditName, setEditPrice, onSave, onCancel }) => {
	const { t } = useTranslation();
	return (
		<div className="flex items-center gap-2 border-b py-2">
			<Input
				type="text"
				value={editName}
				onChange={(e) => setEditName(e.target.value)}
				placeholder={t('itemName')}
			/>
			<Input
				type="text"
				value={editPrice}
				onChange={(e) => setEditPrice(e.target.value)}
				placeholder={t('price')}
			/>
			<Button type="button" onClick={onSave} variant="secondary" size="sm" title={t('save')}>
				<Check size={18} />
			</Button>
			<Button type="button" onClick={onCancel} variant="ghost" size="sm" title={t('cancel')}>
				<X size={18} />
			</Button>
		</div>
	);
};

export default EditRow;
