import { packageJson } from '@rowanmanning/package-json';
import { getRepoContent } from './github.js';

/**
 * @import { packageJson as packageJsonGitHub } from '@rowanmanning/package-json-github'
 */

/** @type {packageJsonGitHub['fromGitHubRepo']} */
export async function fromGitHubRepo(options) {
	const optionsWithPath = Object.assign({ path: 'package.json' }, options);
	return packageJson.fromString(await getRepoContent(optionsWithPath));
}
