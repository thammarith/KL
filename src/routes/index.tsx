import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import UpdateNotification from '@/components/pwa/UpdateNotification';
import { format } from 'date-fns';
import type { Bill } from '@/interfaces/Bill';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useBillContext } from '@/contexts/BillContext';

const Index = () => {
	const { t } = useTranslation();
	const { bills } = useBillContext();

	return (
		<>
			<div className="mt-8">
				<h2 className="mb-2 text-lg font-bold">{t('billsList')}</h2>
				{bills.length === 0 ? (
					<p className="text-muted-foreground">{t('noBills')}</p>
				) : (
					<div className="flex flex-col gap-2">
						{bills.map((bill: Bill) => (
							<Link
								to="/bill"
								search={{ id: bill.id }}
								key={bill.id}
								className="focus-visible:ring-primary block w-full rounded-xl focus:outline-none focus-visible:ring-2"
								style={{ textDecoration: 'none' }}
							>
								<Card className="cursor-pointer transition-shadow hover:shadow-lg">
									<CardHeader className="pb-2">
										<CardTitle>{bill.name?.original || t('untitled')}</CardTitle>
										{bill.name?.english && (
											<span className="text-muted-foreground block text-xs">
												{bill.name.english}
											</span>
										)}
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
