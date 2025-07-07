import React, { useState, useEffect } from 'react';
import BillItem from '@/components/bill/BillItem';
import { useTranslation } from 'react-i18next';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { useFormContext } from 'react-hook-form';
import type { BillFormValues } from '@/types/billForm';

const BillItems: React.FC = () => {
	const { t } = useTranslation();
	const form = useFormContext<BillFormValues>();
	const items = form.watch('items') || [];

	const [localItems, setLocalItems] = useState<BillItemType[]>(items);

	// Sync localItems with form.items
	useEffect(() => {
		setLocalItems(items);
	}, [items]);

	if (!localItems?.length) {
		return <div>{t('noItems')}</div>;
	}

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

	return (
		<div className="flex flex-col gap-2">
			{localItems.map((item) => (
				<BillItem
					key={item.id}
					item={item}
					onEdit={(updated) => handleEdit(item.id, updated)}
					currency={{
						original: form.watch('currency')?.original,
						target: form.watch('currency')?.target,
					}}
				/>
			))}
		</div>
	);
};

export default BillItems;
