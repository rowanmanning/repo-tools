import type { AnyPackageLock, PackageJson } from '@rowanmanning/package-json';

declare module '@rowanmanning/node-versions' {
	export interface Options {
		majorsOnly?: boolean | undefined;
	}

	export const nodeVersions: readonly string[];

	export function getEnginesNodeVersions(
		engines: string,
		options?: Options | undefined
	): string[];

	export function getPackageNodeVersions(
		packageJson: Partial<PackageJson> | Partial<AnyPackageLock>,
		options?: Options | undefined
	): string[];
}
