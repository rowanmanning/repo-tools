import possibleNodeVersions from './data/versions.json' with { type: 'json' };

export { getEnginesNodeVersions } from './lib/get-engines-node-versions.js';
export { getPackageNodeVersions } from './lib/get-package-node-versions.js';

/**
 * @import nodeVersions from '@rowanmanning/node-versions'
 */

/** @type {nodeVersions['nodeVersions']} */
export const nodeVersions = Object.freeze(possibleNodeVersions);
