'use strict';

const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const { AssertionError } = require('node:assert');
const quibble = require('quibble');

describe('@rowanmanning/node-versions/lib/fetch-node-versions', () => {
	let json;
	let response;
	let subject;

	beforeEach(() => {
		json = [{ version: '1.2.3' }, { version: '4.5.6' }];
		response = { json: mock.fn(async () => json) };
		mock.method(global, 'fetch', async () => response);

		quibble('../../../package.json', {
			name: 'mock-name',
			version: 'mock-version',
			homepage: 'mock-home-page'
		});

		subject = require('../../../lib/fetch-node-versions');
	});

	afterEach(() => {
		global.fetch.mock.restore();
		quibble.reset();
	});

	describe('.fetchNodeVersions(path)', () => {
		let resolvedValue;

		beforeEach(async () => {
			resolvedValue = await subject.fetchNodeVersions();
		});

		it('fetches the Node.js versions from the live website', () => {
			assert.equal(global.fetch.mock.callCount(), 1);
			assert.deepEqual(global.fetch.mock.calls.at(0).arguments, [
				'https://nodejs.org/dist/index.json',
				{ headers: { 'user-agent': 'npm:mock-name/mock-version (mock-home-page)' } }
			]);
			assert.equal(response.json.mock.callCount(), 1);
		});

		it('resolves with an array of version strings', () => {
			assert.deepEqual(resolvedValue, ['1.2.3', '4.5.6']);
		});

		describe('when the fetch fails', () => {
			let fetchError;
			let rejectedError;

			beforeEach(async () => {
				fetchError = new Error('mock fetch error');
				global.fetch.mock.mockImplementation(() => {
					throw fetchError;
				});
				try {
					await subject.fetchNodeVersions();
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with the error', () => {
				assert.equal(rejectedError, fetchError);
			});
		});

		describe('when the JSON body parsing fails', () => {
			let jsonError;
			let rejectedError;

			beforeEach(async () => {
				jsonError = new Error('mock json error');
				response.json.mock.mockImplementation(() => {
					throw jsonError;
				});
				try {
					await subject.fetchNodeVersions();
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with the error', () => {
				assert.equal(rejectedError, jsonError);
			});
		});

		describe('when the JSON is not an array', () => {
			let rejectedError;

			beforeEach(async () => {
				response.json.mock.mockImplementation(() => ({ notAnArray: true }));
				try {
					await subject.fetchNodeVersions();
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with an error', () => {
				assert.ok(rejectedError instanceof AssertionError);
				assert.equal(rejectedError.message, 'versions are not an array');
			});
		});

		describe('when the items in the JSON array are not all objects', () => {
			let rejectedError;

			beforeEach(async () => {
				response.json.mock.mockImplementation(() => [{ version: '1.2.3' }, null]);
				try {
					await subject.fetchNodeVersions();
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with an error', () => {
				assert.ok(rejectedError instanceof AssertionError);
				assert.equal(rejectedError.message, 'version (index 1) is not an object');
			});
		});

		describe('when items in the JSON array have non-string version properties', () => {
			let rejectedError;

			beforeEach(async () => {
				response.json.mock.mockImplementation(() => [
					{ version: '1.2.3' },
					{ version: [] }
				]);
				try {
					await subject.fetchNodeVersions();
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with an error', () => {
				assert.ok(rejectedError instanceof AssertionError);
				assert.equal(
					rejectedError.message,
					'version (index 1) has a non-string "version" property'
				);
			});
		});
	});
});
