import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface AddButtonProps {
	onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
	const { t } = useTranslation();
	return (
		<div className="mt-2">
			<Button
				variant="outline"
				className="w-full flex items-center justify-center gap-2 border-dashed border-2 border-muted-foreground py-6 text-muted-foreground hover:border-primary hover:text-primary"
				onClick={onClick}
			>
				<span className="text-lg font-medium">{t('add')}</span>
				<span className="text-2xl leading-none">+</span>
			</Button>
		</div>
	);
};

export default AddButton;
