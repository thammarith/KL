import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getNanoId } from '@/utils/nanoId';
import BillItems from './BillItems';
import BillAddItem from './BillAddItem';
import type { BillFormValues } from '@/types/billForm';
import { useTranslation } from 'react-i18next';

const BillContent: React.FC = () => {
	const { t } = useTranslation();
	const form = useFormContext<BillFormValues>();
	const [newItem, setNewItem] = useState({
		name: '',
		amount: '',
	});

	const items = form.watch('items');

	const handleAddItem = () => {
		if (!newItem.name || !newItem.amount) return;
		const item = {
			id: getNanoId(),
			name: { original: newItem.name, english: '' },
			amount: { amount: Number(newItem.amount), currency: 'THB' },
			quantity: 1,
		};
		form.setValue('items', [...(items || []), item]);
		setNewItem({ name: '', amount: '' });
	};

	return (
		<section className="flex flex-col gap-2">
			<div className="flex font-semibold font-heading">
				<div className="flex-1">{t('itemName')}</div>
				<div className="">{t('price')}</div>
			</div>
			<BillItems items={items} />
			<BillAddItem newItem={newItem} setNewItem={setNewItem} handleAddItem={handleAddItem} />
		</section>
	);
};

export default BillContent;
