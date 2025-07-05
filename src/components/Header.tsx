import i18n from '@/utils/i18n';

const Header = () => {
	return (
		<div className="flex justify-end gap-2 p-2">
			<button
				onClick={() => i18n.changeLanguage('en-GB')}
				className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
			>
				EN
			</button>
			<button
				onClick={() => i18n.changeLanguage('th')}
				className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
			>
				TH
			</button>
		</div>
	);
};

export default Header;
