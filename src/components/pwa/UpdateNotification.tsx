import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const UpdateNotification: React.FC = () => {
	const { t } = useTranslation();
	const [showUpdateNotification, setShowUpdateNotification] = useState(false);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				// A new service worker has taken control
				setShowUpdateNotification(true);
			});

			// Listen for waiting service worker
			navigator.serviceWorker.ready.then((registration) => {
				registration.addEventListener('updatefound', () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener('statechange', () => {
							if (
								newWorker.state === 'installed'
								&& navigator.serviceWorker.controller
							) {
								// New content is available
								setShowUpdateNotification(true);
							}
						});
					}
				});
			});
		}
	}, []);

	const handleUpdateClick = () => {
		if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
			// Tell the service worker to skip waiting and become active
			navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });

			// Reload the page to get the new content
			window.location.reload();
		}
	};

	const handleDismiss = () => {
		setShowUpdateNotification(false);
	};

	if (!showUpdateNotification) {
		return null;
	}

	return (
		<div className="fixed top-4 right-4 left-4 z-50 mx-auto max-w-sm rounded-lg bg-blue-600 p-4 text-white shadow-lg">
			<div className="flex items-start space-x-3">
				<div className="flex-shrink-0">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
						<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="text-sm font-medium">{t('updateAvailable')}</h3>
					<p className="mt-1 text-sm opacity-90">{t('updateDesc')}</p>
				</div>
				<button
					onClick={handleDismiss}
					className="flex-shrink-0 text-white/70 transition-colors hover:text-white"
					aria-label={t('dismiss')}
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
					onClick={handleUpdateClick}
					className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-100"
				>
					{t('updateNow')}
				</button>
				<button
					onClick={handleDismiss}
					className="flex-1 rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
				>
					{t('installLater')}
				</button>
			</div>
		</div>
	);
};

export default UpdateNotification;
