'use strict';

const PackageJson = require('@npmcli/package-json');

/**
 * @param {string} path
 * @returns {Promise<PackageJson.Content>}
 */
exports.loadPackage = async function loadPackage(path) {
	try {
		const pkg = await PackageJson.load(path);
		return pkg.content;
	} catch (/** @type {any} */ cause) {
		if (cause.code === 'ENOENT') {
			throw Object.assign(new Error(`No package.json file found at ${path}`, { cause }), {
				code: 'PACKAGE_JSON_MISSING'
			});
		}
		if (cause.code === 'EJSONPARSE') {
			throw Object.assign(
				new Error(`Invalid package.json file found at ${path}`, { cause }),
				{
					code: 'PACKAGE_JSON_INVALID'
				}
			);
		}
		throw cause;
	}
};
