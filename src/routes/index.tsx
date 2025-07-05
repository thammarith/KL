import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import InstallPrompt from '@components/pwa/InstallPrompt';
import UpdateNotification from '@components/pwa/UpdateNotification';

const Index = () => {
	const { t } = useTranslation();
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1 className="font-heading">{t('testThai')}</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>{t('countIs', { count })}</button>
				<p>
					<Trans i18nKey="editAndSave">
						Edit <code>src/App.tsx</code> and save to test HMR
					</Trans>
				</p>
			</div>
			<p className="read-the-docs">{t('clickLearnMore')}</p>

			{/* PWA Components */}
			<UpdateNotification />
			<InstallPrompt />
		</>
	);
};

export const Route = createFileRoute('/')({
	component: Index,
});
