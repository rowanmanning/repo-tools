import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

mock.module('../../lib/package-json.js', {
	namedExports: { mockProperty: 'mock-package-json-method' }
});

mock.module('../../lib/package-lock-json.js', {
	namedExports: { mockProperty: 'mock-package-lock-json-method' }
});

const subject = await import('../../index.js');

describe('@rowanmanning/package-json-github', () => {
	describe('.packageJson', () => {
		it('is aliases lib/package-json', () => {
			assert.deepEqual(subject.packageJson.mockProperty, 'mock-package-json-method');
		});
	});

	describe('.packageLock', () => {
		it('is aliases lib/package-lock-json', () => {
			assert.deepEqual(subject.packageLock.mockProperty, 'mock-package-lock-json-method');
		});
	});
});
