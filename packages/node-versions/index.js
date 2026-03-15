'use strict';

const possibleNodeVersions = require('./data/versions.json');
const { getEnginesNodeVersions } = require('./lib/get-engines-node-versions.js');
const { getPackageNodeVersions } = require('./lib/get-package-node-versions.js');

/**
 * @import nodeVersions from '@rowanmanning/node-versions'
 */

/** @type {nodeVersions['nodeVersions']} */
exports.nodeVersions = Object.freeze(possibleNodeVersions);

exports.getEnginesNodeVersions = getEnginesNodeVersions;
exports.getPackageNodeVersions = getPackageNodeVersions;
