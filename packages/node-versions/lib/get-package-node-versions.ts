import type { AnyPackageLock, PackageJson } from '@rowanmanning/package-json';
import { getEnginesNodeVersions, type Options } from './get-engines-node-versions.ts';

/**
 * Get supported Node.js versions from a package.json or package-lock.json "engines" property.
 */
export function getPackageNodeVersions(
	pkg: Partial<AnyPackageLock> | Partial<PackageJson>,
	options: Options = {}
) {
	let engines: unknown;

	// We can only extract engines data from a v2+ lockfile
	if (typeof pkg?.lockfileVersion === 'number' && pkg.lockfileVersion > 1) {
		engines = pkg?.packages?.['']?.engines?.node;
	} else {
		engines = pkg?.engines?.node;
	}

	if (typeof engines !== 'string') {
		return [];
	}
	return getEnginesNodeVersions(engines, options);
}
