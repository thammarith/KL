import packageInfo from '../../package.json';

const Footer = () => {
	return (
		<footer className="mt-auto border-t bg-gray-50/50 p-2 text-center text-xs text-gray-500">
			KL v{packageInfo.version}
			{packageInfo.buildDate && (
				<> | Built: {new Date(packageInfo.buildDate).toLocaleString()}</>
			)}
		</footer>
	);
};

export default Footer;
