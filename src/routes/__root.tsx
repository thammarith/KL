import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '@components/Header';

const RootComponent = () => (
	<>
		<section className="box-border flex min-h-screen w-full flex-col px-[env(safe-area-inset-left)] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
			<Header />
			<div className="flex gap-2 p-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{' '}
				<Link to="/about" className="[&.active]:font-bold">
					About
				</Link>
			</div>
			<hr />
			<Outlet />
		</section>
		<TanStackRouterDevtools />
	</>
);

export const Route = createRootRoute({
	component: RootComponent,
});
