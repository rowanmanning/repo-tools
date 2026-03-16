import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

const nodeVersions = ['3.0.0', '2.1.0', '2.0.1', '2.0.0', '1.1.0', '1.0.0'];
mock.module('../../../data/versions.json', { defaultExport: nodeVersions });

const semver = {
	validRange: mock.fn(),
	satisfies: mock.fn(),
	major: mock.fn()
};
mock.module('semver', { defaultExport: semver });

const { getEnginesNodeVersions } = await import('../../../lib/get-engines-node-versions.js');

describe('@rowanmanning/node-versions/lib/get-engines-node-versions', () => {
	describe('.getEnginesNodeVersions(engines)', () => {
		let returnedValue;

		before(() => {
			semver.validRange.mock.mockImplementation(() => true);
			semver.satisfies.mock.mockImplementation((version) => version.startsWith('2.'));
			returnedValue = getEnginesNodeVersions('mock-engines');
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
			before(() => {
				semver.validRange.mock.resetCalls();
				semver.satisfies.mock.resetCalls();
				returnedValue = getEnginesNodeVersions(123);
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
			before(() => {
				semver.satisfies.mock.resetCalls();
				semver.validRange.mock.mockImplementation(() => false);
				returnedValue = getEnginesNodeVersions('mock-engines');
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

		before(() => {
			semver.validRange.mock.mockImplementation(() => true);
			semver.satisfies.mock.mockImplementation(() => false);
		});

		describe('when options.majorsOnly is true', () => {
			before(() => {
				semver.satisfies.mock.mockImplementation(
					(version) => version.startsWith('2.') || version.startsWith('3.')
				);
				semver.major.mock.mockImplementation((version) =>
					Number.parseInt(version.split('.').at(0), 10)
				);
				returnedValue = getEnginesNodeVersions('mock-engines', {
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
});
