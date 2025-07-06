import React from 'react';
import { useTranslation } from 'react-i18next';

const BillInfo: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className="p-4 border rounded-xl bg-muted">
			{t('billInfo')}
		</div>
	);
};

export default BillInfo;
