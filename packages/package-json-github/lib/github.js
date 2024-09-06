'use strict';

const { name, version, homepage } = require('../package.json');

/**
 * @import { GitHubOptions } from '@rowanmanning/package-json-github'
 */

const userAgent = `${name}/${version} (${homepage})`;

/**
 * @param {GitHubOptions & { path: string }} options
 * @returns {Promise<string>}
 */
exports.getRepoContent = async function getRepoContent(options) {
	if (!options || typeof options !== 'object' || Array.isArray(options)) {
		throw new TypeError('Invalid argument: options must be an object');
	}
	const { auth, owner, repo, path, ref } = options;
	if (typeof auth !== 'string') {
		throw new TypeError('Invalid argument: options.auth must be a string');
	}
	if (typeof owner !== 'string') {
		throw new TypeError('Invalid argument: options.owner must be a string');
	}
	if (typeof repo !== 'string') {
		throw new TypeError('Invalid argument: options.repo must be a string');
	}
	if (typeof path !== 'string') {
		throw new TypeError('Invalid argument: options.path must be a string');
	}
	if (ref !== undefined && typeof ref !== 'string') {
		throw new TypeError('Invalid argument: options.ref must be a string or undefined');
	}
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
		throw Object.assign(
			new Error(`GitHub API responded with a ${response.status} status code`),
			{
				code: 'GITHUB_API_ERROR',
				status: response.status,
				statusCode: response.status
			}
		);
	}
	return await response.text();
};
