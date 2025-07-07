import React from 'react';
import BillItem from '@/components/bill/BillItem';
import { useTranslation } from 'react-i18next';
import { useBillContext } from '@/contexts/BillContext';

const BillItems: React.FC = () => {
	const { t } = useTranslation();
	const { currentId, getBillById } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;

	if (!bill || !bill.items || bill.items.length === 0) {
		return <div>{t('noItems')}</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{bill.items.map((item) => (
				<BillItem key={item.id} item={item} />
			))}
		</div>
	);
};

export default BillItems;
