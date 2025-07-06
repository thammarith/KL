import React from 'react';
import { useTranslation } from 'react-i18next';

const BillInfo: React.FC = () => {
	const { t } = useTranslation();
	return <div className="bg-muted rounded-xl border p-4">{t('billInfo')}</div>;
};

export default BillInfo;
