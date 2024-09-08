'use strict';

const { join: joinPath } = require('node:path');
const { readFile } = require('node:fs/promises');

const validLockfileVersions = [1, 2, 3];

/**
 * @import { packageLock } from '@rowanmanning/package-json'
 */

/** @type {packageLock['fromObject']} */
exports.fromObject = function fromObject(packageObject) {
	try {
		// Package-lock.json root element must be an object "{}"
		if (!packageObject || typeof packageObject !== 'object' || Array.isArray(packageObject)) {
			throw new TypeError('Package-lock.json root element is not an object');
		}

		// We require at least a name, version, and lockfile version
		if (typeof packageObject.name !== 'string') {
			throw new TypeError('Package-lock.json name property is not a string');
		}
		if (typeof packageObject.version !== 'string') {
			throw new TypeError('Package-lock.json version property is not a string');
		}
		if (typeof packageObject.lockfileVersion !== 'number') {
			throw new TypeError('Package-lock.json lockfileVersion property is not a number');
		}
		if (!validLockfileVersions.includes(packageObject.lockfileVersion)) {
			throw new TypeError(
				`Package-lock.json lockfileVersion property is not one of ${validLockfileVersions.join(',')}`
			);
		}

		return packageObject;
	} catch (/** @type {any} */ error) {
		error.code = 'PACKAGE_LOCK_JSON_INVALID';
		throw error;
	}
};

/** @type {packageLock['fromString']} */
exports.fromString = function fromString(jsonString) {
	if (typeof jsonString !== 'string') {
		throw new TypeError('Invalid argument: jsonString must be a string');
	}
	try {
		return exports.fromObject(JSON.parse(jsonString));
	} catch (/** @type {any} */ error) {
		let cause = error;
		if (cause instanceof SyntaxError) {
			cause = new Error('Package-lock.json is not valid JSON', { cause });
			cause.code = 'PACKAGE_LOCK_JSON_INVALID';
		}
		throw cause;
	}
};

/** @type {packageLock['fromFile']} */
exports.fromFile = async function fromFile(path) {
	if (typeof path !== 'string') {
		throw new TypeError('Invalid argument: path must be a string');
	}
	try {
		return exports.fromString(await readFile(path, 'utf-8'));
	} catch (/** @type {any} */ error) {
		let cause = error;
		if (cause.code === 'ENOENT') {
			cause = new Error(`Package-lock.json file not found at ${path}`, { cause });
			cause.code = 'PACKAGE_LOCK_JSON_NOT_FOUND';
		}
		if (cause.code === 'EISDIR') {
			cause = new Error(`Package-lock.json at ${path} is a directory`, { cause });
			cause.code = 'PACKAGE_LOCK_JSON_NOT_FOUND';
		}
		throw cause;
	}
};

/** @type {packageLock['fromDirectory']} */
exports.fromDirectory = async function fromDirectory(path) {
	if (typeof path !== 'string') {
		throw new TypeError('Invalid argument: path must be a string');
	}
	return await exports.fromFile(joinPath(path, 'package-lock.json'));
};
