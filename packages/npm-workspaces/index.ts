import { type PackageLockV2, type PackageLockV3, packageLock } from '@rowanmanning/package-json';

/**
 * List the npm workspaces that a `package-lock.json` file defines.
 */
export function getPackageWorkspaces(pkg: PackageLockV2 | PackageLockV3) {
	const lockfile = packageLock.fromObject(pkg);
	if (lockfile.lockfileVersion === 2 || lockfile.lockfileVersion === 3) {
		if (
			!lockfile.packages ||
			typeof lockfile.packages !== 'object' ||
			Array.isArray(lockfile.packages)
		) {
			return [];
		}
		return Object.keys(lockfile.packages).filter((key) => !key.includes('node_modules/'));
	}
	throw new TypeError('Invalid argument: pkg is a lockfile other than v2 or v3');
}
