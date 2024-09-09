'use strict';

const { join: joinPath } = require('node:path');
const { readFile } = require('node:fs/promises');

/**
 * @import { packageJson } from '@rowanmanning/package-json'
 */

/** @type {packageJson['fromObject']} */
exports.fromObject = function fromObject(packageObject) {
	try {
		// Package.json root element must be an object "{}"
		if (!packageObject || typeof packageObject !== 'object' || Array.isArray(packageObject)) {
			throw new TypeError('Package.json root element is not an object');
		}

		// We require at least a name and version
		if (typeof packageObject.name !== 'string') {
			throw new TypeError('Package.json name property is not a string');
		}
		if (packageObject.version !== undefined && typeof packageObject.version !== 'string') {
			throw new TypeError('Package.json version property is not a string');
		}

		return packageObject;
	} catch (/** @type {any} */ error) {
		error.code = 'PACKAGE_JSON_INVALID';
		throw error;
	}
};

/** @type {packageJson['fromString']} */
exports.fromString = function fromString(jsonString) {
	if (typeof jsonString !== 'string') {
		throw new TypeError('Invalid argument: jsonString must be a string');
	}
	try {
		return exports.fromObject(JSON.parse(jsonString));
	} catch (/** @type {any} */ error) {
		let cause = error;
		if (cause instanceof SyntaxError) {
			cause = new Error('Package.json is not valid JSON', { cause });
			cause.code = 'PACKAGE_JSON_INVALID';
		}
		throw cause;
	}
};

/** @type {packageJson['fromFile']} */
exports.fromFile = async function fromFile(path) {
	if (typeof path !== 'string') {
		throw new TypeError('Invalid argument: path must be a string');
	}
	try {
		return exports.fromString(await readFile(path, 'utf-8'));
	} catch (/** @type {any} */ error) {
		let cause = error;
		if (cause.code === 'ENOENT') {
			cause = new Error(`Package.json file not found at ${path}`, { cause });
			cause.code = 'PACKAGE_JSON_NOT_FOUND';
		}
		if (cause.code === 'EISDIR') {
			cause = new Error(`Package.json at ${path} is a directory`, { cause });
			cause.code = 'PACKAGE_JSON_NOT_FOUND';
		}
		throw cause;
	}
};

/** @type {packageJson['fromDirectory']} */
exports.fromDirectory = async function fromDirectory(path) {
	if (typeof path !== 'string') {
		throw new TypeError('Invalid argument: path must be a string');
	}
	return await exports.fromFile(joinPath(path, 'package.json'));
};
