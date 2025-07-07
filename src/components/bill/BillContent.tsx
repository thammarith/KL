import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getNanoId } from '@/utils/nanoId';
import BillItems from './BillItems';
import BillItemForm from './BillItemForm';
import type { BillFormValues } from '@/types/billForm';
import { useTranslation } from 'react-i18next';

const BillContent: React.FC = () => {
	const { t } = useTranslation();
	const form = useFormContext<BillFormValues>();

	const items = form.watch('items');

	const handleAddItem = (item: { name: string; amount: string }) => {
		if (!item.name || !item.amount) return;
		const newBillItem = {
			id: getNanoId(),
			name: { original: item.name, english: '' },
			amount: Number(item.amount),
		};
		form.setValue('items', [...(items || []), newBillItem]);
	};

	return (
		<section className="flex flex-col gap-4">
			<div className="font-heading flex font-semibold">
				<div className="flex-1">{t('itemName')}</div>
				<div className="">{t('price')}</div>
			</div>
			<BillItems />
			<BillItemForm onSave={handleAddItem} />
		</section>
	);
};

export default BillContent;
