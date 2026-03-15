'use strict';

const assert = require('node:assert/strict');
const { before, describe, it, mock } = require('node:test');

const nodeVersions = ['3.0.0', '2.1.0', '2.0.1', '2.0.0', '1.1.0', '1.0.0'];
mock.module('../../../data/versions.json', { defaultExport: nodeVersions });

const getEnginesNodeVersions = mock.fn(() => 'mock-engines-node-versions');
mock.module('../../../lib/get-engines-node-versions.js', {
	namedExports: { getEnginesNodeVersions }
});

const { getPackageNodeVersions } = require('../../../lib/get-package-node-versions.js');

describe('@rowanmanning/node-versions/lib/get-engines-node-versions', () => {
	describe('.getPackageNodeVersions(path, options)', () => {
		let returnedValue;

		before(() => {
			returnedValue = getPackageNodeVersions(
				{
					engines: {
						node: 'mock-engines'
					}
				},
				'mock-options'
			);
		});

		it('gets the Node.js versions for the package engines.node property, passing on options', () => {
			assert.equal(getEnginesNodeVersions.mock.callCount(), 1);
			assert.deepEqual(getEnginesNodeVersions.mock.calls.at(0).arguments, [
				'mock-engines',
				'mock-options'
			]);
		});

		it('resolves with the result of getting the engines Node.js versions', () => {
			assert.deepEqual(returnedValue, 'mock-engines-node-versions');
		});

		describe('when the package has a lockfileVersion greater than 1', () => {
			before(() => {
				getEnginesNodeVersions.mock.resetCalls();
				returnedValue = getPackageNodeVersions(
					{
						lockfileVersion: 2,
						packages: {
							'': {
								engines: {
									node: 'mock-engines'
								}
							}
						}
					},
					'mock-options'
				);
			});

			it('gets the Node.js versions for the package packages."".engines.node property, passing on options', () => {
				assert.equal(getEnginesNodeVersions.mock.callCount(), 1);
				assert.deepEqual(getEnginesNodeVersions.mock.calls.at(0).arguments, [
					'mock-engines',
					'mock-options'
				]);
			});
		});

		describe('when the package does not have an engines property', () => {
			before(() => {
				getEnginesNodeVersions.mock.resetCalls();
				returnedValue = getPackageNodeVersions({});
			});

			it('does not get the Node.js versions', () => {
				assert.equal(getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});

		describe('when the package does not have an engines.node property', () => {
			before(() => {
				getEnginesNodeVersions.mock.resetCalls();
				returnedValue = getPackageNodeVersions({
					engines: { npm: 'mock-npm-engines' }
				});
			});

			it('does not get the Node.js versions', () => {
				assert.equal(getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});

		describe('when the package engines.node property is not a string', () => {
			before(() => {
				getEnginesNodeVersions.mock.resetCalls();
				returnedValue = getPackageNodeVersions({
					engines: { node: 123 }
				});
			});

			it('does not get the Node.js versions', () => {
				assert.equal(getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});
	});
});
