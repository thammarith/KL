import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';

interface AdjustmentFormProps {
	name: string;
	amount: string;
	isEditing: boolean;
	onNameChange: (name: string) => void;
	onAmountChange: (amount: string) => void;
	onAdd: () => void;
	onUpdate: () => void;
	onCancel: () => void;
}

const AdjustmentForm = ({
	name,
	amount,
	isEditing,
	onNameChange,
	onAmountChange,
	onAdd,
	onUpdate,
	onCancel,
}: AdjustmentFormProps) => {
	const isFormValid = name.trim() && amount;
	const isAmountValid = amount && !isNaN(parseFloat(amount));

	return (
		<div className="border-t pt-4">
			<div className="font-content mb-3 grid grid-cols-[2fr_1fr] gap-2">
				<Input
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
					placeholder="Adjustment name"
					className="text-base"
				/>
				<Input
					type="number"
					step="0.01"
					value={amount}
					onChange={(e) => onAmountChange(e.target.value)}
					placeholder="0.00"
					className="tabular-nums"
				/>
			</div>
			<div className="flex gap-2">
				{isEditing ? (
					<>
						<Button onClick={onUpdate} disabled={!isFormValid} size="sm">
							<Check className="mr-1 h-4 w-4" />
							Save
						</Button>
						<Button variant="outline" size="sm" onClick={onCancel}>
							<X className="mr-1 h-4 w-4" />
							Cancel
						</Button>
					</>
				) : (
					<Button onClick={onAdd} disabled={!isFormValid} size="sm">
						<Plus className="mr-1 h-4 w-4" />
						Add
					</Button>
				)}
			</div>
			{isAmountValid && (
				<div className="text-muted-foreground mt-2 text-xs">
					Tip: Use negative amounts for discounts
				</div>
			)}
		</div>
	);
};

export default AdjustmentForm;
