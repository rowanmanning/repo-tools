'use strict';

const assert = require('node:assert/strict');
const pkg = require('../package.json');

const versionsEndpoint = 'https://nodejs.org/dist/index.json';
const userAgent = `npm:${pkg.name}/${pkg.version} (${pkg.homepage})`;

/**
 * @returns {Promise<string[]>}
 */
exports.fetchNodeVersions = async function fetchNodeVersions() {
	const response = await fetch(versionsEndpoint, {
		headers: { 'user-agent': userAgent }
	});
	const versions = await response.json();

	// Validate the version data
	assert.ok(Array.isArray(versions), 'versions are not an array');
	for (const [key, value] of Object.entries(versions)) {
		assert.ok(value, `version (index ${key}) is not an object`);
		assert.equal(typeof value, 'object', `version (index ${key}) is not an object`);
		assert.notEqual(Array.isArray(value), `version (index ${key}) is not an object`);
		assert.equal(
			typeof value?.version,
			'string',
			`version (index ${key}) has a non-string "version" property`
		);
	}

	return versions.map(({ version }) => version);
};
