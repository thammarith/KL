declare module '../../package.json' {
	interface PackageJson {
		name: string;
		version: string;
		buildDate?: string;
	}

	const packageJson: PackageJson;
	export default packageJson;
}
