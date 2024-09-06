'use strict';

const { getRepoContent } = require('./github');
const {
	packageJson: { fromString }
} = require('@rowanmanning/package-json');

/**
 * @import { packageJson } from '@rowanmanning/package-json-github'
 */

/** @type {packageJson['fromGitHubRepo']} */
exports.fromGitHubRepo = async function fromGitHubRepo(options) {
	const optionsWithPath = Object.assign({ path: 'package.json' }, options);
	return fromString(await getRepoContent(optionsWithPath));
};
