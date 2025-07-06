import React from 'react';
import { useTranslation } from 'react-i18next';

const BillFooter: React.FC = () => {
	const { t } = useTranslation();
	return (
		<footer className="p-4 border-t text-center text-muted-foreground">
			{t('billFooter')}
		</footer>
	);
};

export default BillFooter;
