'use strict';

const { getRepoContent } = require('./github');
const {
	packageLock: { fromString }
} = require('@rowanmanning/package-json');

/**
 * @import { packageLock } from '@rowanmanning/package-json-github'
 */

/** @type {packageLock['fromGitHubRepo']} */
exports.fromGitHubRepo = async function fromGitHubRepo(options) {
	const optionsWithPath = Object.assign({ path: 'package-lock.json' }, options);
	return fromString(await getRepoContent(optionsWithPath));
};
