'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { getPackageNodeVersions } = require('../..');

describe('@rowanmanning/node-versions (end-to-end)', () => {
	describe('package-invalid-engines-array.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(
				require('./fixtures/package-invalid-engines-array.json'),
				{ majorsOnly: true }
			);
			assert.deepEqual(engines, []);
		});
	});

	describe('package-invalid-null.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(
				require('./fixtures/package-invalid-null.json'),
				{ majorsOnly: true }
			);
			assert.deepEqual(engines, []);
		});
	});

	describe('package-lock-v1.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(require('./fixtures/package-lock-v1.json'), {
				majorsOnly: true
			});
			assert.deepEqual(engines, []);
		});
	});

	describe('package-lock-v2.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(require('./fixtures/package-lock-v2.json'), {
				majorsOnly: true
			});
			assert.deepEqual(engines, ['8', '6']);
		});
	});

	describe('package-lock-v3.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(require('./fixtures/package-lock-v3.json'), {
				majorsOnly: true
			});
			assert.deepEqual(engines, ['8', '6']);
		});
	});

	describe('package-no-engines-node.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(
				require('./fixtures/package-no-engines-node.json'),
				{ majorsOnly: true }
			);
			assert.deepEqual(engines, []);
		});
	});

	describe('package-no-engines.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(require('./fixtures/package-no-engines.json'), {
				majorsOnly: true
			});
			assert.deepEqual(engines, []);
		});
	});

	describe('package.json', () => {
		it('has the expected engines', () => {
			const engines = getPackageNodeVersions(require('./fixtures/package.json'), {
				majorsOnly: true
			});
			assert.deepEqual(engines, ['8', '6']);
		});
	});
});
