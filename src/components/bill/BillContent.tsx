import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBillContext } from '@/contexts/BillContext';
import { CrudMode } from '@/constants/crudMode';

const BillContent: React.FC = () => {
	const { t } = useTranslation();
	const { currentId, getBillById, mode } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;

	if (mode === CrudMode.Create || !bill) {
		return (
			<div className="bg-background rounded-xl border p-4">
				{t('billContent')}: {t('noItems')}
			</div>
		);
	}

	if (!bill.items || bill.items.length === 0) {
		return (
			<div className="bg-background rounded-xl border p-4">
				{t('billContent')}: {t('noItems')}
			</div>
		);
	}

	return (
		<div className="bg-background rounded-xl border p-4">
			<div className="mb-1 font-bold">{t('billContent')}</div>
			<ul className="list-disc pl-4">
				{bill.items.map((item) => (
					<li key={item.id} className="mb-1">
						<span className="font-medium">{item.name.original}</span> x{item.quantity} -{' '}
						{item.amount.amount} {item.amount.currency}
					</li>
				))}
			</ul>
		</div>
	);
};

export default BillContent;
