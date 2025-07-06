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
				className="border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 border-2 border-dashed py-6"
				onClick={onClick}
			>
				<span className="text-lg font-medium">{t('add')}</span>
				<span className="text-2xl leading-none">+</span>
			</Button>
		</div>
	);
};

export default AddButton;
