'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { getPackageDependencies } = require('../..');
const { join } = require('node:path');
const { readdirSync } = require('node:fs');

const testCasesFolder = join(__dirname, 'test-cases');
const testCases = readdirSync(testCasesFolder).map((filePath) =>
	require(join(testCasesFolder, filePath))
);

describe('@rowanmanning/npm-dependencies (end-to-end)', () => {
	for (const testCase of testCases) {
		describe(testCase.description, () => {
			if (testCase.expectedResult) {
				it('returns the expected dependencies', () => {
					assert.deepEqual(
						getPackageDependencies(testCase.input, testCase.options),
						testCase.expectedResult
					);
				});
			} else {
				it('throws an error', () => {
					assert.throws(() => getPackageDependencies(testCase.input, testCase.options), {
						message: testCase.expectedError
					});
				});
			}
		});
	}
});
