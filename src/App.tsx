import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import InstallPrompt from './components/pwa/InstallPrompt';
import UpdateNotification from './components/pwa/UpdateNotification';
import Header from '@/components/Header';

function App() {
	const { t } = useTranslation();
	const [count, setCount] = useState(0);

	return (
		<section className="box-border flex min-h-screen w-full flex-col px-[env(safe-area-inset-left)] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
			<Header />
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
		</section>
	);
}

export default App;
