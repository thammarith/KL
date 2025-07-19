import { Button } from "@/components/ui/button";

type SaveBillProps = {
	onSave: () => void;
};

const SaveBill = ({ onSave }: SaveBillProps) => {

	return (
		<div className="mt-8">
			<Button className="w-full" onClick={onSave}>
				Save & split bill
			</Button>
		</div>
	);
};

export default SaveBill;
