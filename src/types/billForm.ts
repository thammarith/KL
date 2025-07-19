import z from 'zod/v4';

// Name schema for reuse
export const nameSchema = z.object({
	original: z.string().trim().min(1),
	english: z.string().optional(),
});

// Person schema for reuse
export const personSchema = z.object({
	id: z.string(),
	name: z.string(),
});

// Form schema for Bill editing
export const billFormSchema = z.object({
	id: z.string(),
	date: z.string().optional(),
	time: z.string().optional(),
	name: nameSchema,
	currency: z.object({
		original: z.string(),
		target: z.string().optional(),
	}),
	items: z.array(
		z.object({
			id: z.string(),
			name: nameSchema,
			amount: z.number(),
			selectedPeople: z.array(personSchema), // People who should pay for this item
		})
	),
	adjustments: z.array(
		z.object({
			id: z.string(),
			name: nameSchema,
			amount: z.number(),
			ref: z.string(),
		})
	),
	totals: z.object({
		subTotal: z.number(),
		grandTotal: z.number(),
	}),
});

export type BillFormValues = z.infer<typeof billFormSchema>;
