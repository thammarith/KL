import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/shadcn';
import type { Adjustment } from '@/interfaces/Bill';

interface AdjustmentItemProps {
	adjustment: Adjustment;
	index: number;
	currency: string;
	isEditing: boolean;
	isAnyEditing: boolean;
	onEdit: (index: number) => void;
	onDelete: (index: number) => void;
}

const AdjustmentItem = ({
	adjustment,
	index,
	currency,
	isEditing,
	isAnyEditing,
	onEdit,
	onDelete,
}: AdjustmentItemProps) => {
	return (
		<div
			className={cn(
				'font-content grid grid-cols-[2fr_1fr] items-center gap-2 py-2 tabular-nums',
				isEditing && 'opacity-50'
			)}
		>
			<div className="flex items-center gap-1">
				<span className="text-base">{adjustment.name.original}</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onEdit(index)}
					disabled={isAnyEditing}
				>
					<Edit2 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onDelete(index)}
					disabled={isAnyEditing}
				>
					<Trash2 className="h-4 w-4 text-red-500" />
				</Button>
			</div>
			<div
				className={cn(
					'flex justify-end whitespace-nowrap',
					adjustment.amount < 0 && 'text-red-700'
				)}
			>
				{formatCurrency(adjustment.amount, currency, 'narrowSymbol')}
			</div>
		</div>
	);
};

export default AdjustmentItem;
