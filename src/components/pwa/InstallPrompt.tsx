import React, { useState, useEffect } from 'react';
import { APP_NAME } from '@constants/meta';
import { getItemWithExpiry, setItemWithExpiry } from '@utils/localStorage';
import { toMs } from '@utils/time';

const DISMISS_KEY = 'pwa.install.prompt.dismissed';
const DISMISS_TTL = toMs({ days: 7 });

const InstallPrompt: React.FC = () => {
	const [shouldShow, setShouldShow] = useState<boolean>();

	useEffect(() => {
		const dismissedFlag = getItemWithExpiry<boolean>(DISMISS_KEY);
		setShouldShow(!dismissedFlag);
	}, []);

	const handleDismiss = () => {
		setShouldShow(false);
		setItemWithExpiry(DISMISS_KEY, true, DISMISS_TTL);
	};

	if (!shouldShow) return null;

	return (
		<div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-sm rounded-[22px] border bg-white p-4 shadow-lg">
			<div className="flex items-start space-x-3">
				<div className="flex-shrink-0">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
						<span className="text-lg font-bold text-white">{APP_NAME}</span>
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="text-sm font-medium text-gray-900">Install {APP_NAME} App</h3>
					<p className="mt-1 text-sm text-gray-500">
						You can install this app for a better experience. Look for <b>Install</b> or{' '}
						<b>Add to Home Screen</b> in your browser menu.
					</p>
				</div>
				<button
					onClick={handleDismiss}
					className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
					aria-label="Dismiss"
				>
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>
			<div className="mt-4 flex space-x-2">
				<button
					onClick={handleDismiss}
					className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
				>
					Dismiss
				</button>
			</div>
		</div>
	);
};

export default InstallPrompt;
