import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BillItem } from '@/interfaces/Bill';
import ItemRow from '@/components/bill/ItemRow';
import EditRow from '@/components/bill/EditRow';
import AddItemInput from '@/components/bill/AddItemInput';
import AddButton from '@/components/bill/AddButton';

interface BillItemsProps {
	items: BillItem[];
	isReadOnly: boolean;
	addItem: (name: string, price: string) => void;
	removeItem: (id: string) => void;
	onEditItem: (id: string, name: string, price: string) => void;
	hasBillId: boolean;
}

const BillItems: React.FC<BillItemsProps> = ({ items, isReadOnly, addItem, removeItem, onEditItem, hasBillId }) => {
	const { t } = useTranslation();
	const [itemName, setItemName] = useState('');
	const [itemPrice, setItemPrice] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [editPrice, setEditPrice] = useState('');
	const [showAddInput, setShowAddInput] = useState(false);

	const handleAddItem = () => {
		if (!itemName.trim() || isNaN(Number(itemPrice)) || Number(itemPrice) < 0) return;
		addItem(itemName, itemPrice);
		setItemName('');
		setItemPrice('');
		if (hasBillId) setShowAddInput(false);
	};

	const startEdit = (item: BillItem) => {
		setEditingId(item.id);
		setEditName(item.name.original);
		setEditPrice(item.amount.amount.toString());
	};

	const saveEdit = (id: string) => {
		if (!editName.trim() || isNaN(Number(editPrice)) || Number(editPrice) < 0) return;
		onEditItem(id, editName, editPrice);
		setEditingId(null);
		setEditName('');
		setEditPrice('');
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditName('');
		setEditPrice('');
	};

	return (
		<div className="mb-8">
			{items.length === 0 && <p className="text-muted-foreground mb-2">{t('noItems')}</p>}
			<div className="space-y-2">
				{items.map((item) =>
					editingId === item.id ? (
						<EditRow
							key={item.id}
							editName={editName}
							editPrice={editPrice}
							setEditName={setEditName}
							setEditPrice={setEditPrice}
							onSave={() => saveEdit(item.id)}
							onCancel={cancelEdit}
						/>
					) : (
						<ItemRow
							key={item.id}
							item={item}
							isReadOnly={isReadOnly}
							onEdit={() => startEdit(item)}
							onRemove={() => removeItem(item.id)}
						/>
					)
				)}
				{!isReadOnly &&
					(hasBillId ? (
						showAddInput ? (
							<AddItemInput
								itemName={itemName}
								itemPrice={itemPrice}
								setItemName={setItemName}
								setItemPrice={setItemPrice}
								onAdd={handleAddItem}
								onCancel={() => setShowAddInput(false)}
							/>
						) : (
							<AddButton onClick={() => setShowAddInput(true)} />
						)
					) : (
						<AddItemInput
							itemName={itemName}
							itemPrice={itemPrice}
							setItemName={setItemName}
							setItemPrice={setItemPrice}
							onAdd={handleAddItem}
						/>
					))}
			</div>
		</div>
	);
};

export default BillItems;
