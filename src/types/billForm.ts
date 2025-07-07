import z from 'zod/v4';

// Form schema for Bill editing
export const billFormSchema = z.object({
	id: z.string(),
	date: z.string().optional(),
	time: z.string().optional(),
	merchant: z.object({
		id: z.string(),
		name: z.object({
			original: z.string().trim().min(1),
			english: z.string().optional(),
		}),
	}),
	items: z.array(
		z.object({
			id: z.string(),
			name: z.object({
				original: z.string(),
				english: z.string().optional(),
			}),
			quantity: z.number(),
			amount: z.object({
				amount: z.number(),
				currency: z.string(),
			}),
		})
	),
});

export type BillFormValues = z.infer<typeof billFormSchema>;
