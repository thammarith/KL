import React from 'react';
import { useBillContext } from '@/contexts/BillContext';
import { formatDate, formatTime } from '@/utils/time';
import MerchantName from './MerchantName';

const BillInfo: React.FC = () => {
	const { currentId, getBillById } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;

	return (
		<section className="font-heading flex justify-between gap-2">
			<div className="flex flex-1 flex-col gap-2">
				{bill?.date && (
					<p className="text-muted-foreground text-sm">
						{formatDate(new Date(bill.date))}
						&nbsp;&middot;&nbsp;
						{bill.time && formatTime(new Date(`${bill.date} ${bill.time}`))}
					</p>
				)}
				<MerchantName />
			</div>
			<div>
				{/* currency */}
				<div> currency</div>
			</div>
		</section>
	);
};

export default BillInfo;
