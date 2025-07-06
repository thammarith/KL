import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBillContext } from '@/contexts/BillContext';
import { formatDate, formatTime } from '@/utils/time';

const BillInfo: React.FC = () => {
	const { t } = useTranslation();
	const { currentId, getBillById } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;

	return (
		<section className="font-heading flex justify-between gap-2">
			<div>
				{bill?.date && (
					<p className="text-muted-foreground text-sm">
						{formatDate(new Date(bill.date))}
						&nbsp;&middot;&nbsp;
						{bill.time && formatTime(new Date(`${bill.date} ${bill.time}`))}
					</p>
				)}
				<h1 className="mb-2 text-lg font-semibold">
					{bill?.merchant?.name?.original || t('untitled')}
					<p className="text-muted-foreground text-sm font-normal">{bill?.merchant?.name?.english}</p>
				</h1>
			</div>
			<div>
				{/* currency */}
				<div> currency</div>
			</div>
		</section>
	);
};

export default BillInfo;
