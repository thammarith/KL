import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import UpdateNotification from '@/components/pwa/UpdateNotification';
import { billsMemory } from './bill';
import { format } from 'date-fns';
import type { Bill } from '@/interfaces/Bill';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
							<Link
								to="/bill"
								search={{ id: Number(bill.id) }}
								key={bill.id}
								className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
								style={{ textDecoration: 'none' }}
							>
								<Card className="transition-shadow hover:shadow-lg cursor-pointer">
									<CardHeader className="pb-2">
										<CardTitle>{bill.merchant?.name?.original || t('untitled')}</CardTitle>
									</CardHeader>
									<CardContent className="pt-0 text-xs text-gray-500">
										{bill.date ? format(new Date(bill.date), 'yyyy-MM-dd') : ''}
									</CardContent>
								</Card>
							</Link>
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
