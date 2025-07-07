import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from 'lucide-react';

interface BillAddItemProps {
	newItem: { name: string; amount: string };
	setNewItem: React.Dispatch<React.SetStateAction<{ name: string; amount: string }>>;
	handleAddItem: () => void;
}

const BillAddItem: React.FC<BillAddItemProps> = ({ newItem, setNewItem, handleAddItem }) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<Input
					id="item-name"
					className="w-full"
					value={newItem.name}
					onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
					placeholder={t('itemName')}
					required
				/>
				<Input
					id="item-amount"
					type="text"
					value={newItem.amount}
					onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
					placeholder={t('price')}
					required
				/>
			</div>
			<div className="self-end">
				<Button type="button" disabled={!newItem.name || !newItem.amount} onClick={handleAddItem}>
					<PlusIcon className="w-4 h-4" />
					{t('add')}
				</Button>
			</div>
		</div>
	);
};

export default BillAddItem;
