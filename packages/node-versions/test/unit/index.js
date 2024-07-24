'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const quibble = require('quibble');

describe('@rowanmanning/node-versions', () => {
	let loadPackage;
	let nodeVersions;
	let semver;
	let subject;

	beforeEach(() => {
		loadPackage = mock.fn();
		nodeVersions = ['3.0.0', '2.1.0', '2.0.1', '2.0.0', '1.1.0', '1.0.0'];
		semver = {
			validRange: mock.fn(),
			satisfies: mock.fn(),
			major: mock.fn()
		};

		quibble('../../lib/load-package', { loadPackage });
		quibble('../../data/versions.json', nodeVersions);
		quibble('semver', semver);

		subject = require('../..');
	});

	afterEach(() => quibble.reset());

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
			beforeEach(async () => {
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
			beforeEach(async () => {
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
		let resolvedValue;

		beforeEach(async () => {
			subject.getEnginesNodeVersions = mock.fn(() => 'mock-engines-node-versions');
			loadPackage.mock.mockImplementation(() => ({
				engines: {
					node: 'mock-engines'
				}
			}));
			resolvedValue = await subject.getPackageNodeVersions('mock-path', 'mock-options');
		});

		it('loads the package from the given path', () => {
			assert.equal(loadPackage.mock.callCount(), 1);
			assert.deepEqual(loadPackage.mock.calls.at(0).arguments, ['mock-path']);
		});

		it('gets the Node.js versions for the package engines.node property, passing on options', () => {
			assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 1);
			assert.deepEqual(subject.getEnginesNodeVersions.mock.calls.at(0).arguments, [
				'mock-engines',
				'mock-options'
			]);
		});

		it('resolves with the result of getting the engines Node.js versions', () => {
			assert.deepEqual(resolvedValue, 'mock-engines-node-versions');
		});

		describe('when the package does not have an engines property', () => {
			beforeEach(async () => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				loadPackage.mock.mockImplementation(() => ({}));
				resolvedValue = await subject.getPackageNodeVersions('mock-engines');
			});

			it('does not get the Node.js versions', () => {
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(resolvedValue, []);
			});
		});

		describe('when the package does not have an engines.node property', () => {
			beforeEach(async () => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				loadPackage.mock.mockImplementation(() => ({
					engines: { npm: 'mock-npm-engines' }
				}));
				resolvedValue = await subject.getPackageNodeVersions('mock-engines');
			});

			it('does not get the Node.js versions', () => {
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(resolvedValue, []);
			});
		});

		describe('when the package engines.node property is not a string', () => {
			beforeEach(async () => {
				subject.getEnginesNodeVersions.mock.resetCalls();
				loadPackage.mock.mockImplementation(() => ({
					engines: { node: 123 }
				}));
				resolvedValue = await subject.getPackageNodeVersions('mock-engines');
			});

			it('does not get the Node.js versions', () => {
				assert.equal(subject.getEnginesNodeVersions.mock.callCount(), 0);
			});

			it('resolves with an empty array', () => {
				assert.deepEqual(resolvedValue, []);
			});
		});
	});
});
