import assert from 'node:assert/strict';
import { beforeEach, describe, it, mock } from 'node:test';

const readFile = mock.fn();
mock.module('node:fs/promises', { namedExports: { readFile } });

const subject = await import('../../../lib/package-lock-json.js');

describe('@rowanmanning/package-json/lib/package-lock-json', () => {
	describe('.fromObject(packageLock)', () => {
		let mockJson;
		let returnedValue;

		beforeEach(() => {
			mockJson = { name: 'mock-name', version: 'mock-version', lockfileVersion: 3 };
			returnedValue = subject.fromObject(mockJson);
		});

		it('returns `packageLock` as-is', () => {
			assert.equal(returnedValue, mockJson);
		});

		describe('when `packageLock` is null', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromObject(null), TypeError);
			});
		});

		describe('when `packageLock` is not an object', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromObject('string'), TypeError);
			});
		});

		describe('when `packageLock` is an array', () => {
			it('throws a type error', async () => {
				assert.throws(() => subject.fromObject([]), TypeError);
			});
		});

		describe('when `packageLock.name` is not a string', () => {
			it('throws a type error', async () => {
				mockJson.name = 123;
				assert.throws(() => subject.fromObject(mockJson), TypeError);
			});
		});

		describe('when `packageLock.version` is not a string', () => {
			it('throws a type error', async () => {
				mockJson.version = 123;
				assert.throws(() => subject.fromObject(mockJson), TypeError);
			});
		});

		describe('when `packageLock.lockfileVersion` is not a number', () => {
			it('throws a type error', async () => {
				mockJson.lockfileVersion = '123';
				assert.throws(() => subject.fromObject(mockJson), TypeError);
			});
		});

		describe('when `packageLock.lockfileVersion` is not 1, 2, or 3', () => {
			it('throws a type error', async () => {
				mockJson.lockfileVersion = 137;
				assert.throws(() => subject.fromObject(mockJson), TypeError);
			});
		});
	});

	describe('.fromString(jsonString)', () => {
		let mockJson;
		let returnedValue;

		beforeEach(() => {
			mockJson = { name: 'mock-name', version: 'mock-version', lockfileVersion: 3 };
			returnedValue = subject.fromString(JSON.stringify(mockJson));
		});

		it('returns the parsed JSON', () => {
			assert.deepEqual(returnedValue, mockJson);
		});

		describe('when `jsonString` is not a string', () => {
			it('throws a type error', () => {
				assert.throws(() => subject.fromString(123), TypeError);
			});
		});

		describe('when `jsonString` is not valid JSON', () => {
			it('rejects with a descriptive error', () => {
				try {
					subject.fromString('not-json');
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'PACKAGE_LOCK_JSON_INVALID');
					assert.ok(error.cause instanceof SyntaxError);
				}
			});
		});
	});

	describe('.fromFile(path)', () => {
		let mockJson;
		let resolvedValue;

		beforeEach(async () => {
			mockJson = { name: 'mock-name', version: 'mock-version', lockfileVersion: 3 };
			readFile.mock.resetCalls();
			readFile.mock.mockImplementation(() => Promise.resolve(JSON.stringify(mockJson)));
			resolvedValue = await subject.fromFile('mock-path');
		});

		it('reads the file at the given path', () => {
			assert.equal(readFile.mock.callCount(), 1);
			assert.deepEqual(readFile.mock.calls.at(0).arguments, ['mock-path', 'utf-8']);
		});

		it('resolves with the file contents parsed as JSON', () => {
			assert.deepEqual(resolvedValue, mockJson);
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
					assert.equal(error.code, 'PACKAGE_LOCK_JSON_NOT_FOUND');
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
					assert.equal(error.code, 'PACKAGE_LOCK_JSON_NOT_FOUND');
					assert.equal(error.cause, mockError);
				}
			});
		});
	});

	describe('.fromDirectory(path)', () => {
		let mockJson;
		let resolvedValue;

		beforeEach(async () => {
			mockJson = { name: 'mock-name', version: 'mock-version', lockfileVersion: 3 };
			readFile.mock.resetCalls();
			readFile.mock.mockImplementation(() => Promise.resolve(JSON.stringify(mockJson)));
			resolvedValue = await subject.fromDirectory('mock-path');
		});

		it('reads the file at the given path', () => {
			assert.equal(readFile.mock.callCount(), 1);
			assert.deepEqual(readFile.mock.calls.at(0).arguments, [
				'mock-path/package-lock.json',
				'utf-8'
			]);
		});

		it('resolves with the file contents parsed as JSON', () => {
			assert.deepEqual(resolvedValue, mockJson);
		});

		describe('when `path` is not a string', () => {
			it('rejects with a type error', async () => {
				assert.rejects(() => subject.fromDirectory(123), TypeError);
			});
		});

		describe('when `readFile` errors', () => {
			it('rejects with the error as-is', async () => {
				const mockError = new Error('mock error');
				readFile.mock.mockImplementation(() => Promise.reject(mockError));
				assert.rejects(() => subject.fromDirectory('mock-path'), mockError);
			});
		});

		describe('when `readFile` errors with an "ENOENT" code', () => {
			it('rejects with a descriptive error', async () => {
				const mockError = new Error('mock error');
				mockError.code = 'ENOENT';
				readFile.mock.mockImplementation(() => Promise.reject(mockError));
				try {
					await subject.fromDirectory('mock-path');
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'PACKAGE_LOCK_JSON_NOT_FOUND');
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
					await subject.fromDirectory('mock-path');
					assert.fail('Test should never reach this point');
				} catch (error) {
					assert.ok(error instanceof Error);
					assert.equal(error.code, 'PACKAGE_LOCK_JSON_NOT_FOUND');
					assert.equal(error.cause, mockError);
				}
			});
		});
	});
});
