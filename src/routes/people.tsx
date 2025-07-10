import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import PeopleList from '@/components/people/PeopleList';

const PeoplePage = () => {
	const { t } = useTranslation();

	return (
		<main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4">
			<div className="mb-2">
				<h1 className="mb-2 text-2xl font-bold">{t('people', 'People')}</h1>
			</div>

			<PeopleList />
		</main>
	);
};

export const Route = createFileRoute('/people')({
	component: PeoplePage,
});
