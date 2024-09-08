'use strict';

const { packageLock } = require('@rowanmanning/package-json');

/**
 * @import npmWorkspaces from '@rowanmanning/npm-workspaces'
 */

/** @type {npmWorkspaces['getPackageWorkspaces']} */
exports.getPackageWorkspaces = function getPackageWorkspaces(pkg) {
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
};
