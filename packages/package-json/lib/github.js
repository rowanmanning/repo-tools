'use strict';

const { name, version, homepage } = require('../package.json');

/**
 * @import { GitHubOptions } from '@rowanmanning/package-json'
 */

const userAgent = `${name}/${version} (${homepage})`;

/**
 * @param {GitHubOptions & { path: string }} options
 * @returns {Promise<string>}
 */
exports.getRepoContent = async function getRepoContent({ auth, owner, repo, path, ref }) {
	const endpoint = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
	if (ref) {
		endpoint.searchParams.set('ref', ref);
	}
	const headers = {
		accept: 'application/vnd.github.raw+json',
		authorization: `Bearer ${auth}`,
		'x-github-api-version': '2022-11-28',
		'user-agent': userAgent
	};
	const response = await fetch(endpoint.toString(), { headers });
	if (!response.ok) {
		// TODO 404
		// TODO 403
		// TODO 401
		throw Object.assign(new Error(`GitHub responded with a ${response.status} status code`), {
			code: 'GITHUB_ERROR',
			status: response.status,
			statusCode: response.status
		});
	}
	return await response.text();
};
