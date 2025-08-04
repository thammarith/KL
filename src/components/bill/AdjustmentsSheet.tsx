import type { ComponentProps } from 'react';
import { useState, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/button';
import {
	Drawer,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
} from '@/components/ui/drawer';
import { generateUniqueId } from '@/utils/nanoId';
import type { BillFormValues } from '@/types/billForm';
import type { Adjustment } from '@/interfaces/Bill';
import AdjustmentListHeader from './adjustments/AdjustmentListHeader';
import AdjustmentItem from './adjustments/AdjustmentItem';
import EmptyAdjustments from './adjustments/EmptyAdjustments';
import AdjustmentForm from './adjustments/AdjustmentForm';

interface AdjustmentFormData {
	name: string;
	amount: string;
}

const AdjustmentsSheet = ({ ...props }: ComponentProps<typeof Drawer>) => {
	const form = useFormContext<BillFormValues>();
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [adjustmentForm, setAdjustmentForm] = useState<AdjustmentFormData>({
		name: '',
		amount: '',
	});

	const { fields, append, update, remove } = useFieldArray({
		control: form.control,
		name: 'adjustments',
	});

	const currency = form.watch('currency');

	// Get existing adjustment IDs to avoid duplicates
	const existingIds = useMemo(() => fields.map((field) => field.id), [fields]);

	const handleAddAdjustment = () => {
		if (!adjustmentForm.name.trim() || !adjustmentForm.amount) return;

		const amount = parseFloat(adjustmentForm.amount);
		if (isNaN(amount)) return;

		const newAdjustment: Adjustment = {
			id: generateUniqueId(existingIds),
			name: {
				original: adjustmentForm.name.trim(),
			},
			amount,
			ref: generateUniqueId(), // Generate a ref for tracking
		};

		append(newAdjustment);
		resetForm();
	};

	const handleEditAdjustment = (index: number) => {
		const adjustment = fields[index];
		setAdjustmentForm({
			name: adjustment.name.original,
			amount: adjustment.amount.toString(),
		});
		setEditingIndex(index);
	};

	const handleUpdateAdjustment = () => {
		if (editingIndex === null || !adjustmentForm.name.trim() || !adjustmentForm.amount) return;

		const amount = parseFloat(adjustmentForm.amount);
		if (isNaN(amount)) return;

		const updatedAdjustment: Adjustment = {
			...fields[editingIndex],
			name: {
				...fields[editingIndex].name,
				original: adjustmentForm.name.trim(),
			},
			amount,
		};

		update(editingIndex, updatedAdjustment);
		resetForm();
	};

	const handleDeleteAdjustment = (index: number) => {
		remove(index);
	};

	const resetForm = () => {
		setAdjustmentForm({ name: '', amount: '' });
		setEditingIndex(null);
	};

	const handleSubmit = () => {
		// Close the drawer - the form data is already updated via useFieldArray
		if (props.onOpenChange) {
			props.onOpenChange(false);
		}
	};

	return (
		<Drawer {...props}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Update adjustments</DrawerTitle>
					<DrawerDescription>
						Add, edit, or delete adjustments such as service charge, taxes, discounts,
						fees, etc.
					</DrawerDescription>
				</DrawerHeader>

				<section className="flex-1 overflow-y-auto px-4">
					<AdjustmentListHeader />

					<div className="mb-4">
						{fields.map((field, index) => (
							<AdjustmentItem
								key={field.id}
								adjustment={field}
								index={index}
								currency={currency?.original ?? 'THB'}
								isEditing={editingIndex === index}
								isAnyEditing={editingIndex !== null}
								onEdit={handleEditAdjustment}
								onDelete={handleDeleteAdjustment}
							/>
						))}

						{fields.length === 0 && <EmptyAdjustments />}
					</div>

					<AdjustmentForm
						name={adjustmentForm.name}
						amount={adjustmentForm.amount}
						isEditing={editingIndex !== null}
						onNameChange={(name) => setAdjustmentForm((prev) => ({ ...prev, name }))}
						onAmountChange={(amount) =>
							setAdjustmentForm((prev) => ({ ...prev, amount }))
						}
						onAdd={handleAddAdjustment}
						onUpdate={handleUpdateAdjustment}
						onCancel={resetForm}
					/>
				</section>

				<DrawerFooter className="mb-8">
					<Button onClick={handleSubmit}>Done</Button>
					<DrawerClose asChild>
						<Button variant="ghost">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default AdjustmentsSheet;
