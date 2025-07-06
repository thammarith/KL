import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BillItem } from '@/interfaces/Bill';
import { useTranslation } from 'react-i18next';

interface ItemRowProps {
	item: BillItem;
	isReadOnly: boolean;
	onEdit: () => void;
	onRemove: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, isReadOnly, onEdit, onRemove }) => {
	const { t } = useTranslation();
	return (
		<div className="flex items-center gap-2 border-b py-2">
			<span className="flex-1 truncate">{item.name.original}</span>
			<span className="w-24 text-right">{item.amount.amount}</span>
			{!isReadOnly && (
				<div className="flex gap-1">
					<Button type="button" onClick={onEdit} variant="ghost" size="sm" title={t('edit')}>
						<Pencil size={18} />
					</Button>
					<Button type="button" onClick={onRemove} variant="ghost" size="sm" title={t('delete')}>
						<Trash2 size={18} />
					</Button>
				</div>
			)}
		</div>
	);
};

export default ItemRow;
