import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import InstallPrompt from './components/pwa/InstallPrompt';
import UpdateNotification from './components/pwa/UpdateNotification';
import i18n from '@utils/i18n';

function App() {
	const { t } = useTranslation();
	const [count, setCount] = useState(0);

	return (
		<section className="box-border flex min-h-screen w-full flex-col px-[env(safe-area-inset-left)] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
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
