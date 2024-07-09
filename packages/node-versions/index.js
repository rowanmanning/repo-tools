'use strict';

const PackageJson = require('@npmcli/package-json');

PackageJson.load(`${__dirname}/test`).then((pkg) => console.log(pkg.content.engines));

/**
 * @typedef {object} GetSupportedNodeVersionsOptions
 * @property {string} path
 */

/**
 * @param {GetSupportedNodeVersionsOptions} options
 * @returns {Promise<string[]>}
 */
async function getSupportedNodeVersions({ path }) {
	const pkg = await PackageJson.load(path); // TODO custom errors?
	const engines = pkg.content.engines?.node;

	if (typeof engines !== 'string') {
		return []; // TODO error?
	}

	// biome-ignore lint/nursery/noConsole: temporary
	console.log(`TODO parse engines: ${engines}`);

	// TODO
	return [];
}

exports.getSupportedNodeVersions = getSupportedNodeVersions;
