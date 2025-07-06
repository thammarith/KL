import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Check } from 'lucide-react';
import type { Bill } from '@/interfaces/Bill';

interface BillMerchantDateRowProps {
	bill: Bill;
	setBill: Dispatch<SetStateAction<Bill>>;
	isReadOnly: boolean;
	isCreateMode: boolean;
}

const BillMerchantDateRow = ({ bill, setBill, isReadOnly, isCreateMode }: BillMerchantDateRowProps) => {
	const { t } = useTranslation();
	const [isEditingDate, setIsEditingDate] = useState(false);

	return (
		<div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-4">
			<div className="flex-1">
				<label htmlFor="merchant-original" className="mb-1 block text-sm font-medium text-gray-700">
					{t('merchantName')}
				</label>
				<input
					id="merchant-original"
					type="text"
					value={bill.merchant.name.original}
					onChange={(e) => setBill((prev) => ({
						...prev,
						merchant: {
							...prev.merchant,
							name: {
								...prev.merchant.name,
								original: e.target.value,
							},
						},
					}))}
					readOnly={isReadOnly}
					required
					className={`w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-base ${
						isReadOnly ? 'bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:outline-none'
					}`}
					placeholder={t('merchantNamePlaceholder')}
				/>
			</div>
			<div className="flex-1 flex flex-col">
				<label htmlFor="bill-date" className="mb-1 block text-sm font-medium text-gray-700">
					{t('date')}
				</label>
				{isCreateMode ? (
					<div className="flex items-center gap-2 h-10">
						{isEditingDate ? (
							<>
								<input
									id="bill-date"
									type="date"
									value={bill.date.toISOString().slice(0, 10)}
									onChange={(e) => setBill((prev) => ({
										...prev,
										date: new Date(e.target.value),
									}))}
									required
									className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
									placeholder={t('datePlaceholder')}
								/>
								<button
									type="button"
									className="ml-2 p-2 rounded hover:bg-gray-100"
									onClick={() => setIsEditingDate(false)}
									title={t('confirmDate')}
								>
									<Check className="w-5 h-5 text-green-600" />
								</button>
							</>
						) : (
							<>
								<span className="text-base text-gray-800">
									{new Intl.DateTimeFormat(undefined, {
										weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
									}).format(bill.date)}
								</span>
								<button
									type="button"
									className="ml-2 p-2 rounded hover:bg-gray-100"
									onClick={() => setIsEditingDate(true)}
									title={t('editDate')}
								>
									<Pencil className="w-5 h-5 text-gray-500" />
								</button>
							</>
						)}
					</div>
				) : (
					<input
						id="bill-date"
						type="date"
						value={bill.date.toISOString().slice(0, 10)}
						onChange={(e) => setBill((prev) => ({
							...prev,
							date: new Date(e.target.value),
						}))}
						readOnly={isReadOnly}
						required
						className={`w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-base ${
							isReadOnly ? 'bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:outline-none'
						}`}
						placeholder={t('datePlaceholder')}
					/>
				)}
			</div>
		</div>
	);
};

export default BillMerchantDateRow;
