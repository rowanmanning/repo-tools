import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { getPackageDependencies } from '../../index.js';

const testCasesFolder = join(import.meta.dirname, 'test-cases');
const testCases = await Promise.all(
	readdirSync(testCasesFolder).map(async (filePath) => {
		const { default: json } = await import(join(testCasesFolder, filePath), {
			with: { type: 'json' }
		});
		return json;
	})
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
