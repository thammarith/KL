import { useTranslation } from 'react-i18next';
import { useState } from 'react';
// Only import Pencil, Check, X if used for merchant name editing
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Bill } from '@/interfaces/Bill';
import type { Dispatch, SetStateAction } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';

interface BillHeaderProps {
	bill: Bill;
	setBill: Dispatch<SetStateAction<Bill>>;
	isReadOnly: boolean;
}

const BillHeader = ({ bill, setBill, isReadOnly }: BillHeaderProps) => {
	const { t } = useTranslation();
	const [editName, setEditName] = useState(false);
	const [nameInput, setNameInput] = useState(bill.merchant.name.original || '');

	// Ensure bill.date is always set to a Date
	const billDate = bill.date instanceof Date ? bill.date : new Date();

	// Determine if bill name is empty
	const isBillNameEmpty = !bill.merchant.name.original?.trim();

	const handleNameSave = () => {
		const trimmed = nameInput.trim();
		setBill((prev: Bill) => ({
			...prev,
			merchant: {
				...prev.merchant,
				name: {
					...prev.merchant.name,
					original: trimmed,
				},
			},
		}));
		if (trimmed) {
			setEditName(false);
		} else {
			setEditName(true);
		}
	};

	const formattedDate = new Intl.DateTimeFormat(undefined, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(billDate);

	const [datePickerOpen, setDatePickerOpen] = useState(false);

	return (
		<div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-4">
			<div className="flex flex-1 flex-col">
				<label htmlFor="bill-name" className="mb-1 block text-sm font-medium text-gray-700">
					{t('billName')}
				</label>
				{(editName && !isReadOnly) || isBillNameEmpty ? (
					<div className="flex items-center gap-2">
						<Input
							id="bill-name"
							type="text"
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
							required
							placeholder={t('billNamePlaceholder')}
						/>
						<Button type="button" variant="ghost" size="icon" onClick={handleNameSave} title={t('save')}>
							<Check />
						</Button>
						{!isBillNameEmpty && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setEditName(false)}
								title={t('cancel')}
							>
								<X />
							</Button>
						)}
					</div>
				) : (
					<div className="flex items-center gap-2">
						<span className="text-base">{bill.merchant.name.original}</span>
						{!isReadOnly && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => {
									setNameInput(bill.merchant.name.original || '');
									setEditName(true);
								}}
								title={t('edit')}
							>
								<Pencil />
							</Button>
						)}
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col">
				<label htmlFor="bill-date" className="mb-1 block text-sm font-medium text-gray-700">
					{t('date')}
				</label>
				<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							id="bill-date"
							className="w-48 justify-start font-normal"
							onClick={() => setDatePickerOpen(true)}
						>
							<CalendarIcon className="h-4 w-4" />
							{billDate ? formattedDate : t('datePlaceholder')}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={billDate}
							onSelect={(date) => {
								if (date) {
									setBill((prev: Bill) => ({ ...prev, date }));
								}
								setDatePickerOpen(false);
							}}
							captionLayout="dropdown"
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default BillHeader;
