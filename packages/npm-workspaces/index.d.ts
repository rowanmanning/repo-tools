import type { PackageLockV2, PackageLockV3 } from '@rowanmanning/package-json';

declare module '@rowanmanning/npm-workspaces' {
	export function getPackageWorkspaces(
		pkg: Partial<PackageLockV2> | Partial<PackageLockV3>
	): string[];
}
