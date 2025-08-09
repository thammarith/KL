import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '@/components/Header';
import { BillProvider } from '@/contexts/BillContext';
import { PeopleProvider } from '@/contexts/PeopleContext';
import { useRouterState } from '@tanstack/react-router';
import { UserProvider } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { getCountryCode } from '@/utils/geo';
import { Toaster } from '@/components/ui/sonner';

const RootComponent = () => {
	const { location } = useRouterState();
	const id = location?.search?.id;

	const [countryCode, setCountryCode] = useState<string>();

	useEffect(() => {
		getCountryCode()
			.then((code) => setCountryCode(code))
			.catch(() => {});
	}, []);

	return (
		<UserProvider countryCode={countryCode}>
			<section className="box-border flex min-h-screen w-full flex-col px-[env(safe-area-inset-left)] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
				<Header />
				<div className="flex gap-2 p-2">
					<Link to="/" className="[&.active]:font-bold">
						Home
					</Link>{' '}
					<Link to="/about" className="[&.active]:font-bold">
						About
					</Link>
					<Link to="/bill" className="[&.active]:font-bold">
						Bill
					</Link>
					<Link to="/people" className="[&.active]:font-bold">
						People
					</Link>
				</div>
				<hr />
				<PeopleProvider>
					<BillProvider id={id}>
						<Outlet />
					</BillProvider>
				</PeopleProvider>
			</section>
			<Toaster />
			<TanStackRouterDevtools />
		</UserProvider>
	);
};

export const Route = createRootRoute({
	component: RootComponent,
});
