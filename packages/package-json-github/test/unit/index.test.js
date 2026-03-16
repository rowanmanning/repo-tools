import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

mock.module('../../lib/package-json.js', {
	namedExports: { fromGitHubRepo: 'mock-package-json-from-github' }
});

mock.module('../../lib/package-lock-json.js', {
	namedExports: { fromGitHubRepo: 'mock-package-lock-json-from-github' }
});

const subject = await import('../../index.js');

describe('@rowanmanning/package-json-github', () => {
	describe('.packageJson', () => {
		it('is aliases lib/package-json', () => {
			assert.deepEqual(subject.packageJson.fromGitHubRepo, 'mock-package-json-from-github');
		});
	});

	describe('.packageLock', () => {
		it('is aliases lib/package-lock-json', () => {
			assert.deepEqual(
				subject.packageLock.fromGitHubRepo,
				'mock-package-lock-json-from-github'
			);
		});
	});
});
