import { AssertionError } from 'node:assert';
import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

mock.module('../../../package.json', {
	defaultExport: {
		name: 'mock-name',
		version: 'mock-version',
		homepage: 'mock-home-page'
	}
});

const json = [{ version: '1.2.3' }, { version: '4.5.6' }];
const response = { json: mock.fn(async () => json) };
mock.method(global, 'fetch', async () => response);

const subject = await import('../../../lib/fetch-node-versions.js');

describe('@rowanmanning/node-versions/lib/fetch-node-versions', () => {
	describe('.fetchNodeVersions(path)', () => {
		let resolvedValue;

		before(async () => {
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

			before(async () => {
				fetchError = new Error('mock fetch error');
				global.fetch.mock.mockImplementationOnce(() => {
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

			before(async () => {
				jsonError = new Error('mock json error');
				response.json.mock.mockImplementationOnce(() => {
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

			before(async () => {
				response.json.mock.mockImplementationOnce(() => ({ notAnArray: true }));
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

			before(async () => {
				response.json.mock.mockImplementationOnce(() => [{ version: '1.2.3' }, null]);
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

			before(async () => {
				response.json.mock.mockImplementationOnce(() => [
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
				assert.ok(
					rejectedError.message.startsWith(
						'version (index 1) has a non-string "version" property'
					)
				);
			});
		});
	});
});
