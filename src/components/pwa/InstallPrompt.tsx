import React, { useState } from 'react';
import { APP_NAME } from 'constants/meta';

const InstallPrompt: React.FC = () => {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-50 max-w-sm mx-auto">
			<div className="flex items-start space-x-3">
				<div className="flex-shrink-0">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-lg">{APP_NAME}</span>
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-medium text-gray-900">Install {APP_NAME} App</h3>
					<p className="text-sm text-gray-500 mt-1">
						You can install this app for a better experience. Look for <b>Install</b> or <b>Add to Home Screen</b> in your browser menu.
					</p>
				</div>
				<button
					onClick={() => setDismissed(true)}
					className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Dismiss"
				>
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
					onClick={() => setDismissed(true)}
					className="flex-1 bg-gray-200 text-gray-800 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
				>
					Dismiss
				</button>
			</div>
		</div>
	);
};

export default InstallPrompt;
