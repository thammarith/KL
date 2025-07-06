import React from 'react';
import { useTranslation } from 'react-i18next';

const BillContent: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className="p-4 border rounded-xl bg-background">
			{t('billContent')}
		</div>
	);
};

export default BillContent;
