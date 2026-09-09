import possibleNodeVersions from './data/versions.json' with { type: 'json' };

export { getEnginesNodeVersions } from './lib/get-engines-node-versions.ts';
export { getPackageNodeVersions } from './lib/get-package-node-versions.ts';

export const nodeVersions = Object.freeze(possibleNodeVersions);
