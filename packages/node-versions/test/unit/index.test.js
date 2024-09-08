'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const quibble = require('quibble');

describe('@rowanmanning/node-versions', () => {
	let nodeVersions;
	let semver;
	let subject;

	beforeEach(() => {
		nodeVersions = ['3.0.0', '2.1.0', '2.0.1', '2.0.0', '1.1.0', '1.0.0'];
		semver = {
			validRange: mock.fn(),
			satisfies: mock.fn(),
			major: mock.fn()
		};

		quibble('../../data/versions.json', nodeVersions);
		quibble('semver', semver);

		subject = require('../..');
	});

	afterEach(() => quibble.reset());

	describe('.nodeVersions', () => {
		it('is a read-only copy of the versions.json file', () => {
			assert.deepEqual(subject.nodeVersions, nodeVersions);
			assert.ok(Object.isFrozen(subject.nodeVersions));
		});
	});

	describe('.getEnginesNodeVersions(engines)', () => {
		let returnedValue;

		beforeEach(() => {
			semver.validRange.mock.mockImplementation(() => true);
			semver.satisfies.mock.mockImplementation((version) => version.startsWith('2.'));
			returnedValue = subject.getEnginesNodeVersions('mock-engines');
		});

		it('checks that the engines string contains a valid semver range', () => {
			assert.equal(semver.validRange.mock.callCount(), 1);
			assert.deepEqual(semver.validRange.mock.calls.at(0).arguments, ['mock-engines']);
		});

		it('checks whether each valid Node.js version is satisfied by the engines string', () => {
			assert.equal(semver.satisfies.mock.callCount(), 6);
			assert.deepEqual(semver.satisfies.mock.calls.at(0).arguments, [
				'3.0.0',
				'mock-engines'
			]);
			assert.deepEqual(semver.satisfies.mock.calls.at(1).arguments, [
				'2.1.0',
				'mock-engines'
			]);
			assert.deepEqual(semver.satisfies.mock.calls.at(2).arguments, [
				'2.0.1',
				'mock-engines'
			]);
			assert.deepEqual(semver.satisfies.mock.calls.at(3).arguments, [
				'2.0.0',
				'mock-engines'
			]);
			assert.deepEqual(semver.satisfies.mock.calls.at(4).arguments, [
				'1.1.0',
				'mock-engines'
			]);
			assert.deepEqual(semver.satisfies.mock.calls.at(5).arguments, [
				'1.0.0',
				'mock-engines'
			]);
		});

		it('returns an array of version strings that were satisfied by the engines string', () => {
			assert.deepEqual(returnedValue, ['2.1.0', '2.0.1', '2.0.0']);
		});

		describe('when the engines string is not a string', () => {
			beforeEach(() => {
				semver.validRange.mock.resetCalls();
				semver.satisfies.mock.resetCalls();
				returnedValue = subject.getEnginesNodeVersions(123);
			});

			it('does not check whether the engines is valid semver', () => {
				assert.equal(semver.validRange.mock.callCount(), 0);
				assert.equal(semver.satisfies.mock.callCount(), 0);
			});

			it('returns an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});

		describe('when the engines string is not a valid semver range', () => {
			beforeEach(() => {
				semver.satisfies.mock.resetCalls();
				semver.validRange.mock.mockImplementation(() => false);
				returnedValue = subject.getEnginesNodeVersions('mock-engines');
			});

			it('does not check whether any versions satisfy the engines string', () => {
				assert.equal(semver.satisfies.mock.callCount(), 0);
			});

			it('returns an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});
	});

	describe('.getEnginesNodeVersions(engines, options)', () => {
		let returnedValue;

		beforeEach(() => {
			semver.validRange.mock.mockImplementation(() => true);
			semver.satisfies.mock.mockImplementation(() => false);
		});

		describe('when options.majorsOnly is true', () => {
			beforeEach(() => {
				semver.satisfies.mock.mockImplementation(
					(version) => version.startsWith('2.') || version.startsWith('3.')
				);
				semver.major.mock.mockImplementation((version) =>
					Number.parseInt(version.split('.').at(0), 10)
				);
				returnedValue = subject.getEnginesNodeVersions('mock-engines', {
					majorsOnly: true
				});
			});

			it('extracts the major version from each version that is satisfied by the engines string', () => {
				assert.equal(semver.major.mock.callCount(), 4);
				assert.deepEqual(semver.major.mock.calls.at(0).arguments, ['3.0.0']);
				assert.deepEqual(semver.major.mock.calls.at(1).arguments, ['2.1.0']);
				assert.deepEqual(semver.major.mock.calls.at(2).arguments, ['2.0.1']);
				assert.deepEqual(semver.major.mock.calls.at(3).arguments, ['2.0.0']);
			});

			it('returns a deduplicated array of major version strings that were satisfied by the engines string', () => {
				assert.deepEqual(returnedValue, ['3', '2']);
			});
		});
	});

	describe('.getPackageNodeVersions(path, options)', () => {
		let returnedValue;

		beforeEach(() => {
			subject.getEnginesNodeVersions = mock.fn(() => 'mock-engines-node-versions');
			returnedValue = subject.getPackageNodeVersions(
				{
					engines: {
						node: 'mock-engines'
					}
				},
				'mock-options'
			);
		});

		it('gets the Node.js versions for the package engines.node property, passing on options', () => {
			assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 1);
			assert.deepEqual(subject.getEnginesNodeVersions.mock.calls.at(0).arguments, [
				'mock-engines',
				'mock-options'
			]);
		});

		it('resolves with the result of getting the engines Node.js versions', () => {
			assert.deepEqual(returnedValue, 'mock-engines-node-versions');
		});

		describe('when the package has a lockfileVersion greater than 1', () => {
			beforeEach(() => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				returnedValue = subject.getPackageNodeVersions(
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
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 1);
				assert.deepEqual(subject.getEnginesNodeVersions.mock.calls.at(0).arguments, [
					'mock-engines',
					'mock-options'
				]);
			});
		});

		describe('when the package does not have an engines property', () => {
			beforeEach(() => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				returnedValue = subject.getPackageNodeVersions({});
			});

			it('does not get the Node.js versions', () => {
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});

		describe('when the package does not have an engines.node property', () => {
			beforeEach(() => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				returnedValue = subject.getPackageNodeVersions({
					engines: { npm: 'mock-npm-engines' }
				});
			});

			it('does not get the Node.js versions', () => {
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});

		describe('when the package engines.node property is not a string', () => {
			beforeEach(() => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				returnedValue = subject.getPackageNodeVersions({
					engines: { node: 123 }
				});
			});

			it('does not get the Node.js versions', () => {
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(returnedValue, []);
			});
		});
	});
});
