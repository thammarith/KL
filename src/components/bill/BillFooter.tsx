import React from 'react';
import { useTranslation } from 'react-i18next';

const BillFooter: React.FC = () => {
	const { t } = useTranslation();
	return <footer className="text-muted-foreground p-4 text-center">{t('billFooter')}</footer>;
};

export default BillFooter;
