'use strict';

const { loadPackage } = require('./lib/load-package');
const possibleNodeVersions = require('./data/versions.json');
const semver = require('semver');

/**
 * @typedef {object} Options
 * @property {boolean} [majorsOnly]
 */

exports.nodeVersions = Object.freeze(possibleNodeVersions);

/**
 * @param {string} engines
 * @param {Options} [options]
 * @returns {string[]}
 */
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

/**
 * @param {string} path
 * @param {Options} [options]
 * @returns {Promise<string[]>}
 */
exports.getPackageNodeVersions = async function getPackageNodeVersions(path, options) {
	const packageJson = await loadPackage(path);
	if (typeof packageJson.engines?.node !== 'string') {
		return [];
	}
	return exports.getEnginesNodeVersions(packageJson.engines.node, options);
};
