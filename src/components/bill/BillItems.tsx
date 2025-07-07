import React from 'react';
import BillItem from '@/components/bill/BillItem';
import { useTranslation } from 'react-i18next';
import { useBillContext } from '@/contexts/BillContext';
import type { BillItem as BillItemType } from '@/interfaces/Bill';

interface BillItemsProps {
	items?: BillItemType[];
}

const BillItems: React.FC<BillItemsProps> = ({ items }) => {
	const { t } = useTranslation();
	const { currentId, getBillById } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;
	const displayItems = items ?? bill?.items;

	if (!displayItems || displayItems.length === 0) {
		return <div>{t('noItems')}</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{displayItems.map((item) => (
				<BillItem key={item.id} item={item} />
			))}
		</div>
	);
};

export default BillItems;
