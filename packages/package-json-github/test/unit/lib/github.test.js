'use strict';

const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const quibble = require('quibble');

describe('@rowanmanning/package-json-github/lib/github', () => {
	let subject;

	beforeEach(() => {
		mock.method(global, 'fetch');
		quibble('../../../package.json', {
			name: 'mock-name',
			version: 'mock-version',
			homepage: 'mock-homepage'
		});

		subject = require('../../../lib/github');
	});

	afterEach(() => {
		quibble.reset();
		mock.restoreAll();
	});

	describe('.getRepoContent(options)', () => {
		let resolvedValue;
		let response;

		beforeEach(async () => {
			response = { ok: true, text: mock.fn() };
			response.text.mock.mockImplementation(() => Promise.resolve('mock-content'));
			global.fetch.mock.mockImplementation(() => Promise.resolve(response));
			resolvedValue = await subject.getRepoContent({
				auth: 'mock-auth',
				owner: 'mock-owner',
				repo: 'mock-repo',
				path: 'mock-path',
				ref: 'mock-ref'
			});
		});

		it('fetches repo content from GitHub', () => {
			assert.equal(global.fetch.mock.callCount(), 1);
			assert.deepEqual(global.fetch.mock.calls.at(0).arguments, [
				'https://api.github.com/repos/mock-owner/mock-repo/contents/mock-path?ref=mock-ref',
				{
					headers: {
						accept: 'application/vnd.github.raw+json',
						authorization: 'Bearer mock-auth',
						'x-github-api-version': '2022-11-28',
						'user-agent': 'mock-name/mock-version (mock-homepage)'
					}
				}
			]);
		});

		it('resolves with the text content of the response', () => {
			assert.equal(resolvedValue, 'mock-content');
		});

		describe('when `options.ref` is not defined', () => {
			beforeEach(async () => {
				global.fetch.mock.resetCalls();
				resolvedValue = await subject.getRepoContent({
					auth: 'mock-auth',
					owner: 'mock-owner',
					repo: 'mock-repo',
					path: 'mock-path'
				});
			});

			it('fetches repo content from GitHub without a ref param', () => {
				assert.equal(global.fetch.mock.callCount(), 1);
				assert.equal(
					global.fetch.mock.calls.at(0).arguments.at(0),
					'https://api.github.com/repos/mock-owner/mock-repo/contents/mock-path'
				);
			});
		});

		describe('when `options` is null', () => {
			it('throws a type error', async () => {
				assert.rejects(() => subject.getRepoContent(null), TypeError);
			});
		});

		describe('when `options` is not an object', () => {
			it('throws a type error', async () => {
				assert.rejects(() => subject.getRepoContent('string'), TypeError);
			});
		});

		describe('when `options` is an array', () => {
			it('throws a type error', async () => {
				assert.rejects(() => subject.getRepoContent([]), TypeError);
			});
		});

		describe('when `options.auth` is not a string', () => {
			it('throws a type error', async () => {
				assert.rejects(
					() =>
						subject.getRepoContent({
							auth: 123,
							owner: 'mock-owner',
							repo: 'mock-repo',
							path: 'mock-path',
							ref: 'mock-ref'
						}),
					TypeError
				);
			});
		});

		describe('when `options.owner` is not a string', () => {
			it('throws a type error', async () => {
				assert.rejects(
					() =>
						subject.getRepoContent({
							auth: 'mock-auth',
							owner: 123,
							repo: 'mock-repo',
							path: 'mock-path',
							ref: 'mock-ref'
						}),
					TypeError
				);
			});
		});

		describe('when `options.repo` is not a string', () => {
			it('throws a type error', async () => {
				assert.rejects(
					() =>
						subject.getRepoContent({
							auth: 'mock-auth',
							owner: 'mock-owner',
							repo: 123,
							path: 'mock-path',
							ref: 'mock-ref'
						}),
					TypeError
				);
			});
		});

		describe('when `options.path` is not a string', () => {
			it('throws a type error', async () => {
				assert.rejects(
					() =>
						subject.getRepoContent({
							auth: 'mock-auth',
							owner: 'mock-owner',
							repo: 'mock-repo',
							path: 123,
							ref: 'mock-ref'
						}),
					TypeError
				);
			});
		});

		describe('when `options.ref` is not a string', () => {
			it('throws a type error', async () => {
				assert.rejects(
					() =>
						subject.getRepoContent({
							auth: 'mock-auth',
							owner: 'mock-owner',
							repo: 'mock-repo',
							path: 'mock-path',
							ref: 123
						}),
					TypeError
				);
			});
		});

		describe('when the GitHub API response with a non-successful status code', () => {
			beforeEach(async () => {
				response.ok = false;
				response.status = 456;
				global.fetch.mock.resetCalls();
			});

			it('rejects with a descriptive error', async () => {
				try {
					await subject.getRepoContent({
						auth: 'mock-auth',
						owner: 'mock-owner',
						repo: 'mock-repo',
						path: 'mock-path',
						ref: 'mock-ref'
					});
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'GITHUB_API_ERROR');
					assert.equal(error.status, 456);
					assert.equal(error.statusCode, 456);
				}
			});
		});
	});
});
