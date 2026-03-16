import { getEnginesNodeVersions } from './get-engines-node-versions.js';

/**
 * @import { getPackageNodeVersions } from '@rowanmanning/node-versions'
 */

/** @type {getPackageNodeVersions} */
export function getPackageNodeVersions(pkg, options) {
	/** @type {any} */
	let engines;

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
