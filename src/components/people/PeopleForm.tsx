import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Plus, X } from 'lucide-react';
import type { Person } from '@/interfaces/Person';

interface PeopleFormProps {
	person?: Person;
	onSave: (name: string) => void;
	onCancel?: () => void;
	placeholder?: string;
}

const PeopleForm = ({ person, onSave, onCancel, placeholder }: PeopleFormProps) => {
	const { t } = useTranslation();
	const [name, setName] = useState(person?.name || '');

	const handleSave = () => {
		if (name.trim()) {
			onSave(name.trim());
		}
		setName('');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSave();
		} else if (e.key === 'Escape') {
			onCancel?.();
		}
	};

	return (
		<>
			<Input
				className="w-full"
				type="text"
				placeholder={placeholder || t('enterPersonName')}
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={handleKeyDown}
				autoFocus
			/>
			<Button onClick={handleSave} variant="ghost" size="sm" disabled={!name.trim()}>
				{onCancel ? <Check className="size-4" /> : <Plus className="size-4" />}
			</Button>
			{onCancel && (
				<Button onClick={onCancel} variant="ghost" size="sm">
					<X className="size-4" />
				</Button>
			)}
		</>
	);
};

export default PeopleForm;
