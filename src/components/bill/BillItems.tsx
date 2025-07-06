import React, { useState } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BillItem } from '@/interfaces/Bill';

interface BillItemsProps {
	items: BillItem[];
	isReadOnly: boolean;
	addItem: (name: string, price: string) => void;
	removeItem: (id: string) => void;
	onEditItem: (id: string, name: string, price: string) => void;
}

const BillItems: React.FC<BillItemsProps> = ({ items, isReadOnly, addItem, removeItem, onEditItem }) => {
	const [itemName, setItemName] = useState('');
	const [itemPrice, setItemPrice] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [editPrice, setEditPrice] = useState('');

	const handleAddItem = () => {
		if (!itemName.trim() || isNaN(Number(itemPrice)) || Number(itemPrice) < 0) return;
		addItem(itemName, itemPrice);
		setItemName('');
		setItemPrice('');
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
			{items.length === 0 ? (
				<>
					<p className="text-muted-foreground mb-2">No items yet.</p>
					<div className="flex w-full max-w-md gap-2">
						<Input
							type="text"
							value={itemName}
							onChange={(e) => setItemName(e.target.value)}
							placeholder="Item name"
							disabled={isReadOnly}
						/>
						<Input
							type="text"
							value={itemPrice}
							onChange={(e) => setItemPrice(e.target.value)}
							placeholder="Price"
							disabled={isReadOnly}
						/>
						<Button type="button" onClick={handleAddItem} disabled={isReadOnly}>
							Add
						</Button>
					</div>
				</>
			) : (
				<div className="space-y-2">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-2 border-b py-2">
							{editingId === item.id ? (
								<>
									<Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
									<Input
										type="text"
										value={editPrice}
										onChange={(e) => setEditPrice(e.target.value)}
									/>
									<Button
										type="button"
										onClick={() => saveEdit(item.id)}
										variant="secondary"
										size="sm"
										title="Save"
									>
										<Check size={18} />
									</Button>
									<Button type="button" onClick={cancelEdit} variant="ghost" size="sm" title="Cancel">
										<X size={18} />
									</Button>
								</>
							) : (
								<>
									<span className="flex-1 truncate">{item.name.original}</span>
									<span className="w-24 text-right">{item.amount.amount}</span>
									{!isReadOnly && (
										<div className="flex gap-1">
											<Button
												type="button"
												onClick={() => startEdit(item)}
												variant="ghost"
												size="sm"
												title="Edit"
											>
												<Pencil size={18} />
											</Button>
											<Button
												type="button"
												onClick={() => removeItem(item.id)}
												variant="ghost"
												size="sm"
												title="Delete"
											>
												<Trash2 size={18} />
											</Button>
										</div>
									)}
								</>
							)}
						</div>
					))}
					{/* Add new item row */}
					{!isReadOnly && (
						<div className="mt-2 flex items-center gap-2">
							<Input
								type="text"
								value={itemName}
								onChange={(e) => setItemName(e.target.value)}
								placeholder="Item name"
							/>
							<Input
								type="text"
								value={itemPrice}
								onChange={(e) => setItemPrice(e.target.value)}
								placeholder="Price"
							/>
							<Button type="button" onClick={handleAddItem}>
								Add
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default BillItems;
