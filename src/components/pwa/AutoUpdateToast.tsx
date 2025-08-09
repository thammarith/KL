import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const AutoUpdateToast = () => {
	const { t } = useTranslation();

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.ready.then((registration) => {
				registration.addEventListener('updatefound', () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener('statechange', () => {
							if (
								newWorker.state === 'installed'
								&& navigator.serviceWorker.controller
							) {
								newWorker.postMessage({ type: 'SKIP_WAITING' });
								window.location.reload();
							}
						});
					}
				});
			});

			navigator.serviceWorker.addEventListener('controllerchange', () => {
				toast.success(t('appUpdated'), {
					duration: 3000,
				});
			});
		}
	}, [t]);

	return null;
};

export default AutoUpdateToast;
