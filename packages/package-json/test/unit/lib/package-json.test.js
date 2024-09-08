'use strict';

const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const quibble = require('quibble');

describe('@rowanmanning/package-json/lib/package-json', () => {
	let readFile;
	let subject;

	beforeEach(() => {
		readFile = mock.fn();
		quibble('node:fs/promises', { readFile });

		subject = require('../../../lib/package-json');
	});

	afterEach(() => {
		quibble.reset();
		mock.restoreAll();
	});

	describe('.fromObject(packageJson)', () => {
		let mockJson;
		let returnedValue;

		beforeEach(() => {
			mockJson = { name: 'mock-name', version: 'mock-version' };
			returnedValue = subject.fromObject(mockJson);
		});

		it('returns `packageJson` as-is', () => {
			assert.equal(returnedValue, mockJson);
		});

		describe('when `packageJson` is null', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromObject(null), TypeError);
			});
		});

		describe('when `packageJson` is not an object', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromObject('string'), TypeError);
			});
		});

		describe('when `packageJson` is an array', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromObject([]), TypeError);
			});
		});

		describe('when `packageJson.name` is not a string', () => {
			it('throws a type error', async () => {
				mockJson.name = 123;
				assert.throws(() => subject.fromObject(mockJson), TypeError);
			});
		});

		describe('when `packageJson.version` is not a string', () => {
			it('throws a type error', async () => {
				mockJson.version = 123;
				assert.throws(() => subject.fromObject(mockJson), TypeError);
			});
		});
	});

	describe('.fromString(jsonString)', () => {
		let mockJson;
		let returnedValue;

		beforeEach(() => {
			mockJson = { name: 'mock-name', version: 'mock-version' };
			mock.method(subject, 'fromObject', () => 'mock-json');
			returnedValue = subject.fromString(JSON.stringify(mockJson));
		});

		it('calls `fromObject` with a parsed copy of the JSON string', () => {
			assert.equal(subject.fromObject.mock.callCount(), 1);
			assert.deepEqual(subject.fromObject.mock.calls.at(0).arguments, [mockJson]);
		});

		it('returns with the return value of `fromObject`', () => {
			assert.equal(returnedValue, 'mock-json');
		});

		describe('when `jsonString` is not a string', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromString(123), TypeError);
			});
		});

		describe('when `jsonString` is not valid JSON', () => {
			it('rejects with a descriptive error', async () => {
				try {
					await subject.fromString('not-json');
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'PACKAGE_JSON_INVALID');
					assert.ok(error.cause instanceof SyntaxError);
				}
			});
		});

		describe('when `fromObject` errors', () => {
			it('throws the error as-is', async () => {
				const mockError = new Error('mock error');
				subject.fromObject.mock.mockImplementation(() => {
					throw mockError;
				});
				assert.throws(() => subject.fromString(JSON.stringify(mockJson)), mockError);
			});
		});
	});

	describe('.fromFile(path)', () => {
		let resolvedValue;

		beforeEach(async () => {
			readFile.mock.mockImplementation(() => Promise.resolve('mock-file-contents'));
			mock.method(subject, 'fromString', () => 'mock-json');
			resolvedValue = await subject.fromFile('mock-path');
		});

		it('reads the file at the given path', () => {
			assert.equal(readFile.mock.callCount(), 1);
			assert.deepEqual(readFile.mock.calls.at(0).arguments, ['mock-path', 'utf-8']);
		});

		it('calls `fromString` with the result of the file read', () => {
			assert.equal(subject.fromString.mock.callCount(), 1);
			assert.deepEqual(subject.fromString.mock.calls.at(0).arguments, ['mock-file-contents']);
		});

		it('resolves with the resolved value of `fromString`', () => {
			assert.equal(resolvedValue, 'mock-json');
		});

		describe('when `path` is not a string', () => {
			it('rejects with a type error', async () => {
				assert.rejects(() => subject.fromFile(123), TypeError);
			});
		});

		describe('when `readFile` errors', () => {
			it('rejects with the error as-is', async () => {
				const mockError = new Error('mock error');
				readFile.mock.mockImplementation(() => Promise.reject(mockError));
				assert.rejects(() => subject.fromFile('mock-path'), mockError);
			});
		});

		describe('when `readFile` errors with an "ENOENT" code', () => {
			it('rejects with a descriptive error', async () => {
				const mockError = new Error('mock error');
				mockError.code = 'ENOENT';
				readFile.mock.mockImplementation(() => Promise.reject(mockError));
				try {
					await subject.fromFile('mock-path');
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'PACKAGE_JSON_NOT_FOUND');
					assert.equal(error.cause, mockError);
				}
			});
		});

		describe('when `readFile` errors with an "EISDIR" code', () => {
			it('rejects with a descriptive error', async () => {
				const mockError = new Error('mock error');
				mockError.code = 'EISDIR';
				readFile.mock.mockImplementation(() => Promise.reject(mockError));
				try {
					await subject.fromFile('mock-path');
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'PACKAGE_JSON_NOT_FOUND');
					assert.equal(error.cause, mockError);
				}
			});
		});

		describe('when `fromString` errors', () => {
			it('rejects with the error as-is', async () => {
				const mockError = new Error('mock error');
				subject.fromString.mock.mockImplementation(() => Promise.reject(mockError));
				assert.rejects(() => subject.fromFile('mock-path'), mockError);
			});
		});
	});

	describe('.fromDirectory(path)', () => {
		let resolvedValue;

		beforeEach(async () => {
			mock.method(subject, 'fromFile', () => Promise.resolve('mock-json'));
			resolvedValue = await subject.fromDirectory('mock-path');
		});

		it('calls `fromFile` for the package.json file within the directory', () => {
			assert.equal(subject.fromFile.mock.callCount(), 1);
			assert.deepEqual(subject.fromFile.mock.calls.at(0).arguments, [
				'mock-path/package.json'
			]);
		});

		it('resolves with the resolved value of `fromFile`', () => {
			assert.equal(resolvedValue, 'mock-json');
		});

		describe('when `path` is not a string', () => {
			it('rejects with a type error', async () => {
				assert.rejects(() => subject.fromDirectory(123), TypeError);
			});
		});

		describe('when `fromFile` errors', () => {
			it('rejects with the error as-is', async () => {
				const mockError = new Error('mock error');
				subject.fromFile.mock.mockImplementation(() => Promise.reject(mockError));
				assert.rejects(() => subject.fromDirectory('mock-path'), mockError);
			});
		});
	});
});
