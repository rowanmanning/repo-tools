import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

const fromString = mock.fn();
mock.module('@rowanmanning/package-json', {
	namedExports: { packageLock: { fromString } }
});

const getRepoContent = mock.fn();
mock.module('../../../lib/github.js', { namedExports: { getRepoContent } });

const subject = await import('../../../lib/package-lock-json.js');

describe('@rowanmanning/package-json-github/lib/package-lock-json', () => {
	describe('.fromGitHubRepo(options)', () => {
		let resolvedValue;

		before(async () => {
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
			before(async () => {
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
