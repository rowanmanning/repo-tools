'use strict';

const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const quibble = require('quibble');

describe('@rowanmanning/node-versions/lib/load-package', () => {
	let PackageJson;
	let subject;

	beforeEach(() => {
		PackageJson = { load: mock.fn(() => ({ content: 'mock-content' })) };
		quibble('@npmcli/package-json', PackageJson);

		subject = require('../../../lib/load-package');
	});

	afterEach(() => quibble.reset());

	describe('.loadPackage(path)', () => {
		let resolvedValue;

		beforeEach(async () => {
			resolvedValue = await subject.loadPackage('mock-path');
		});

		it('loads the package file', () => {
			assert.equal(PackageJson.load.mock.callCount(), 1);
			assert.deepEqual(PackageJson.load.mock.calls.at(0).arguments, ['mock-path']);
		});

		it('resolves with the package contents', () => {
			assert.equal(resolvedValue, 'mock-content');
		});

		describe('when the package.json file is not found', () => {
			let loadError;
			let rejectedError;

			beforeEach(async () => {
				loadError = new Error('mock file system error');
				loadError.code = 'ENOENT';
				PackageJson.load.mock.mockImplementation(() => {
					throw loadError;
				});
				try {
					await subject.loadPackage('mock-path');
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with a custom error', () => {
				assert.notEqual(rejectedError, loadError);
				assert.equal(rejectedError.cause, loadError);
				assert.equal(rejectedError.code, 'PACKAGE_JSON_MISSING');
			});
		});

		describe('when the package.json file is invalid JSON', () => {
			let loadError;
			let rejectedError;

			beforeEach(async () => {
				loadError = new Error('mock json error');
				loadError.code = 'EJSONPARSE';
				PackageJson.load.mock.mockImplementation(() => {
					throw loadError;
				});
				try {
					await subject.loadPackage('mock-path');
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with a custom error', () => {
				assert.notEqual(rejectedError, loadError);
				assert.equal(rejectedError.cause, loadError);
				assert.equal(rejectedError.code, 'PACKAGE_JSON_INVALID');
			});
		});

		describe('when loading package.json results in an unexpected error', () => {
			let loadError;
			let rejectedError;

			beforeEach(async () => {
				loadError = new Error('mock unexpected error');
				PackageJson.load.mock.mockImplementation(() => {
					throw loadError;
				});
				try {
					await subject.loadPackage('mock-path');
				} catch (error) {
					rejectedError = error;
				}
			});

			it('rejects with the error', () => {
				assert.equal(rejectedError, loadError);
			});
		});
	});
});
