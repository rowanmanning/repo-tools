import { packageLock } from '@rowanmanning/package-json';
import { getRepoContent } from './github.js';

/**
 * @import { packageLock as packageLockGitHub } from '@rowanmanning/package-json-github'
 */

/** @type {packageLockGitHub['fromGitHubRepo']} */
export async function fromGitHubRepo(options) {
	const optionsWithPath = Object.assign({ path: 'package-lock.json' }, options);
	return packageLock.fromString(await getRepoContent(optionsWithPath));
}
