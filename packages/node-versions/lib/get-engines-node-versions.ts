import semver from 'semver';
import possibleNodeVersions from '../data/versions.json' with { type: 'json' };

export interface Options {
	majorsOnly?: boolean | undefined;
}

/**
 * Get supported Node.js versions from a valid package.json "engines" string.
 */
export function getEnginesNodeVersions(engines: string, options: Options = {}) {
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
