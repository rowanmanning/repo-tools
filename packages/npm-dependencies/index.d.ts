import type { PackageJson, PackageLockV2, PackageLockV3 } from '@rowanmanning/package-json';

declare module '@rowanmanning/npm-dependencies' {
	export interface Dependency {
		name: string;
		version: string;
		isBundled: boolean;
		isDev: boolean;
		isOptional: boolean;
		isPeer: boolean;
	}

	export interface Options {
		workspace?: string;
	}

	export function getPackageDependencies(
		pkg: Partial<PackageJson> | Partial<PackageLockV2> | Partial<PackageLockV3>,
		options?: Options | undefined
	): Dependency[];
}
