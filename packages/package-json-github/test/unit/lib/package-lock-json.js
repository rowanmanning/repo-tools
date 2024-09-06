'use strict';

const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const quibble = require('quibble');

describe('@rowanmanning/package-json-github/lib/package-lock-json', () => {
	let fromString;
	let getRepoContent;
	let subject;

	beforeEach(() => {
		fromString = mock.fn();
		quibble('@rowanmanning/package-json', { packageLock: { fromString } });

		getRepoContent = mock.fn();
		quibble('../../../lib/github', { getRepoContent });

		subject = require('../../../lib/package-lock-json');
	});

	afterEach(() => {
		quibble.reset();
		mock.restoreAll();
	});

	describe('.fromGitHubRepo(options)', () => {
		let resolvedValue;

		beforeEach(async () => {
			getRepoContent.mock.mockImplementation(() => Promise.resolve('mock-repo-contents'));
			fromString.mock.mockImplementation(() => 'mock-json');
			resolvedValue = await subject.fromGitHubRepo({
				auth: 'mock-auth',
				owner: 'mock-owner',
				repo: 'mock-repo'
			});
		});

		it('fetches repo content from GitHub', () => {
			assert.equal(getRepoContent.mock.callCount(), 1);
			assert.deepEqual(getRepoContent.mock.calls.at(0).arguments, [
				{
					auth: 'mock-auth',
					owner: 'mock-owner',
					repo: 'mock-repo',
					path: 'package-lock.json'
				}
			]);
		});

		it('calls `fromString` with the repo content', () => {
			assert.equal(fromString.mock.callCount(), 1);
			assert.deepEqual(fromString.mock.calls.at(0).arguments, ['mock-repo-contents']);
		});

		it('resolves with the resolved value of `fromString`', () => {
			assert.equal(resolvedValue, 'mock-json');
		});

		describe('when `options.path` is set', () => {
			beforeEach(async () => {
				getRepoContent.mock.resetCalls();
				resolvedValue = await subject.fromGitHubRepo({
					auth: 'mock-auth',
					owner: 'mock-owner',
					repo: 'mock-repo',
					path: 'mock-path'
				});
			});

			it('fetches repo content from GitHub with the given path', () => {
				assert.equal(getRepoContent.mock.callCount(), 1);
				assert.deepEqual(getRepoContent.mock.calls.at(0).arguments, [
					{
						auth: 'mock-auth',
						owner: 'mock-owner',
						repo: 'mock-repo',
						path: 'mock-path'
					}
				]);
			});
		});
	});
});
