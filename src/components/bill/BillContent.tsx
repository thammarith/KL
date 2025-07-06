import React from 'react';
import { useTranslation } from 'react-i18next';

const BillContent: React.FC = () => {
	const { t } = useTranslation();
	return <div className="bg-background rounded-xl border p-4">{t('billContent')}</div>;
};

export default BillContent;
