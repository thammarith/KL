import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBillContext } from '@/contexts/BillContext';
import { CrudMode } from '@/constants/crudMode';
import BillItems from './BillItems';

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
		<section>
			<BillItems />
		</section>
	);
};

export default BillContent;
