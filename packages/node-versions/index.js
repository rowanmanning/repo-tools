'use strict';

const possibleNodeVersions = require('./data/versions.json');
const semver = require('semver');

/**
 * @import nodeVersions from '@rowanmanning/node-versions'
 */

/**
 * @typedef {object} Options
 * @property {boolean} [majorsOnly]
 */

/** @type {nodeVersions['nodeVersions']} */
exports.nodeVersions = Object.freeze(possibleNodeVersions);

/** @type {nodeVersions['getEnginesNodeVersions']} */
exports.getEnginesNodeVersions = function getEnginesNodeVersions(engines, options = {}) {
	if (typeof engines !== 'string' || !semver.validRange(engines)) {
		return [];
	}

	const supportedNodeVersions = possibleNodeVersions.filter((version) =>
		semver.satisfies(version, engines)
	);

	// Flag to only return the major versions
	if (options.majorsOnly) {
		const majorVersions = new Set(
			supportedNodeVersions.map((version) => `${semver.major(version)}`)
		);
		return [...majorVersions];
	}

	return supportedNodeVersions;
};

/** @type {nodeVersions['getPackageNodeVersions']} */
exports.getPackageNodeVersions = function getPackageNodeVersions(packageJson, options) {
	/** @type {any} */
	let engines;

	// We can only extract engines data from a v2+ lockfile
	if (typeof packageJson?.lockfileVersion === 'number' && packageJson.lockfileVersion > 1) {
		engines = packageJson?.packages?.['']?.engines?.node;
	} else {
		engines = packageJson?.engines?.node;
	}

	if (typeof engines !== 'string') {
		return [];
	}
	return exports.getEnginesNodeVersions(engines, options);
};
