import { useBillContext } from "@/contexts/BillContext";

const BillHeader = () => {
	const { mode } = useBillContext();

	return <div>{mode}</div>;
};

export default BillHeader;
