import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getItem, setItem, removeItem } from '@/utils/localStorage';

const AutoUpdateToast = () => {
	const { t } = useTranslation();

	useEffect(() => {
		const key = 'pwa.isJustUpdated';
		const isJustUpdated = getItem<boolean>(key);
		if (isJustUpdated) {
			toast.success(t('appUpdated'), { duration: 3000 });
			removeItem(key);
		}

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
								setItem(key, true);
								newWorker.postMessage({ type: 'SKIP_WAITING' });
								window.location.reload();
							}
						});
					}
				});
			});
		}
	}, [t]);

	return null;
};

export default AutoUpdateToast;
