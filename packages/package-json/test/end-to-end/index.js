'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { join: joinPath } = require('node:path');
const { packageJson, packageLock } = require('../..');

describe('@rowanmanning/package-json (end-to-end)', () => {
	describe('package.json', () => {
		it('can be loaded from the file system', async () => {
			const json = await packageJson.fromDirectory(joinPath(__dirname, 'fixtures'));
			assert.equal(json.name, 'mock-name');
			assert.equal(json.version, 'mock-version');
			assert.equal(json.extra, 'mock-extra-property');
		});
	});

	describe('package-lock.json', () => {
		it('can be loaded from the file system', async () => {
			const json = await packageLock.fromDirectory(joinPath(__dirname, 'fixtures'));
			assert.equal(json.lockfileVersion, 3);
			assert.equal(json.name, 'mock-name');
			assert.equal(json.version, 'mock-version');
			assert.equal(json.extra, 'mock-extra-property');
		});
	});
});
