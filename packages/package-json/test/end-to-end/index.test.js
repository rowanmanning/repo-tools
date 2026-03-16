import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { packageJson, packageLock } from '../../index.js';

describe('@rowanmanning/package-json (end-to-end)', () => {
	describe('package.json', () => {
		it('can be loaded from the file system', async () => {
			const json = await packageJson.fromDirectory(join(import.meta.dirname, 'fixtures'));
			assert.equal(json.name, 'mock-name');
			assert.equal(json.version, 'mock-version');
			assert.equal(json.extra, 'mock-extra-property');
		});
	});

	describe('package-lock.json', () => {
		it('can be loaded from the file system', async () => {
			const json = await packageLock.fromDirectory(join(import.meta.dirname, 'fixtures'));
			assert.equal(json.lockfileVersion, 3);
			assert.equal(json.name, 'mock-name');
			assert.equal(json.version, 'mock-version');
			assert.equal(json.extra, 'mock-extra-property');
		});
	});
});
