'use strict';

const assert = require('node:assert/strict');
const { describe, it, mock } = require('node:test');

const nodeVersions = ['3.0.0', '2.1.0', '2.0.1', '2.0.0', '1.1.0', '1.0.0'];
mock.module('../../data/versions.json', { defaultExport: nodeVersions });

const getEnginesNodeVersions = 'mock-get-engines-node-versions';
mock.module('../../lib/get-engines-node-versions.js', { namedExports: { getEnginesNodeVersions } });

const getPackageNodeVersions = 'mock-get-package-node-versions';
mock.module('../../lib/get-package-node-versions.js', { namedExports: { getPackageNodeVersions } });

const subject = require('@rowanmanning/node-versions');

describe('@rowanmanning/node-versions', () => {
	describe('.nodeVersions', () => {
		it('is a read-only copy of the versions.json file', () => {
			assert.deepEqual(subject.nodeVersions, nodeVersions);
			assert.ok(Object.isFrozen(subject.nodeVersions));
		});
	});

	describe('.getEnginesNodeVersions', () => {
		it('is an alias for lib/get-engines-node-versions', () => {
			assert.strictEqual(subject.getEnginesNodeVersions, getEnginesNodeVersions);
		});
	});

	describe('.getPackageNodeVersions', () => {
		it('is an alias for lib/get-package-node-versions', () => {
			assert.strictEqual(subject.getPackageNodeVersions, getPackageNodeVersions);
		});
	});
});
