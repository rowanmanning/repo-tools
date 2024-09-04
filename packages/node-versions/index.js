'use strict';

const { loadPackage } = require('./lib/load-package');
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
exports.getPackageNodeVersions = async function getPackageNodeVersions(path, options) {
	const packageJson = await loadPackage(path);
	if (typeof packageJson.engines?.node !== 'string') {
		return [];
	}
	return exports.getEnginesNodeVersions(packageJson.engines.node, options);
};
