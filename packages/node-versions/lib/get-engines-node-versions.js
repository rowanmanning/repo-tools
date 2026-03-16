import semver from 'semver';
import possibleNodeVersions from '../data/versions.json' with { type: 'json' };

/**
 * @import { getEnginesNodeVersions } from '@rowanmanning/node-versions'
 */

/** @type {getEnginesNodeVersions} */
export function getEnginesNodeVersions(engines, options = {}) {
	if (typeof engines !== 'string' || !semver.validRange(engines)) {
		return [];
	}

	const supportedNodeVersions = possibleNodeVersions.filter((version) =>
		semver.satisfies(version, engines)
	);

	// Flag to only return the major versions
	if (options.majorsOnly) {
		const majorVersions = new Set(
			supportedNodeVersions.map((version) => `${semver.major(version)}`)
		);
		return [...majorVersions];
	}

	return supportedNodeVersions;
}
