import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { generateUniqueId } from '@/utils/nanoId';
import BillItem from './BillItem';
import type { BillFormValues } from '@/types/billForm';
import { useTranslation } from 'react-i18next';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import type { Person } from '@/interfaces/Person';

const BillContent: React.FC = () => {
	const { t } = useTranslation();
	const form = useFormContext<BillFormValues>();

	const items = form.watch('items') || [];
	const [localItems, setLocalItems] = useState<BillItemType[]>(items);

	// Sync localItems with form.items
	useEffect(() => {
		setLocalItems(items);
	}, [items]);

	const handleAddItem = (item: { name: string; amount: string }) => {
		if (!item.name || !item.amount) return;
		const newBillItem = {
			id: generateUniqueId(),
			name: { original: item.name, english: '' },
			amount: Number(item.amount),
			selectedPeople: [], // Add the required selectedPeople field
		};
		const updatedItems = [...(localItems || []), newBillItem];
		setLocalItems(updatedItems);
		form.setValue('items', updatedItems);
	};

	const handleEdit = (id: string, updated: { name: string; amount: string }) => {
		const updatedItems = localItems.map((item) =>
			item.id === id
				? {
						...item,
						name: { ...item.name, original: updated.name },
						// TODO: use currency.js
						amount: Number(updated.amount),
					}
				: item
		);
		setLocalItems(updatedItems);
		form.setValue('items', updatedItems);
	};

	const handleDelete = (id: string) => {
		const updatedItems = localItems.filter((item) => item.id !== id);
		setLocalItems(updatedItems);
		form.setValue('items', updatedItems);
	};

	const handlePeopleChange = (id: string, selectedPeople: Person[]) => {
		const updatedItems = localItems.map((item) =>
			item.id === id
				? {
						...item,
						selectedPeople,
					}
				: item
		);
		setLocalItems(updatedItems);
		form.setValue('items', updatedItems);
	};

	return (
		<section className="flex flex-col gap-4">
			<div className="font-heading flex font-semibold">
				<div className="flex-1">{t('itemName')}</div>
				<div className="">{t('price')}</div>
			</div>
			<div className="flex flex-col gap-2">
				{localItems && localItems.length > 0 ? (
					localItems.map((item) => (
						<BillItem
							key={item.id}
							item={item}
							onEdit={(updated) => handleEdit(item.id, updated)}
							onDelete={() => handleDelete(item.id)}
							onAdd={() => {}}
							onPeopleChange={(people) => handlePeopleChange(item.id, people)}
						/>
					))
				) : (
					<div>{t('noItems')}</div>
				)}
			</div>
			<BillItem
				mode="add"
				onAdd={handleAddItem}
				onEdit={() => {}}
				onDelete={() => {}}
				item={undefined}
				onPeopleChange={() => {}}
			/>
		</section>
	);
};

export default BillContent;
