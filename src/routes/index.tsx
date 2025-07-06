import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import UpdateNotification from '@/components/pwa/UpdateNotification';
import { billsMemory } from './bill';
import { format } from 'date-fns';
import type { Bill } from '@/interfaces/Bill';

const Index = () => {
	const { t } = useTranslation();

	return (
		<>
			<div className="mt-8">
				<h2 className="text-lg font-bold mb-2">{t('billsList')}</h2>
				{billsMemory.length === 0 ? (
					<p className="text-muted-foreground">{t('noBills')}</p>
				) : (
					<div className="flex flex-col gap-2">
						{billsMemory.map((bill: Bill) => (
							<div key={bill.id} className="flex items-center justify-between rounded border p-3 bg-white shadow-sm">
								<div>
									<div className="font-medium">{bill.merchant?.name?.original || t('untitled')}</div>
									<div className="text-xs text-gray-500">{bill.date ? format(new Date(bill.date), 'yyyy-MM-dd') : ''}</div>
								</div>
								<Link
									to="/bill"
									search={{ id: Number(bill.id) }}
									className="ml-2 text-blue-600 hover:underline text-sm font-semibold"
								>
									{t('viewBill')}
								</Link>
							</div>
						))}
					</div>
				)}
			</div>

			{/* PWA Components */}
			<UpdateNotification />
			<InstallPrompt />
		</>
	);
};

export const Route = createFileRoute('/')({
	component: Index,
});
