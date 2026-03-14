'use strict';

const assert = require('node:assert/strict');
const { before, describe, it, mock } = require('node:test');

describe('@rowanmanning/package-json', () => {
	let packageJson;
	let packageLock;
	let subject;

	before(() => {
		packageJson = 'mock-package-json';
		packageLock = 'mock-package-lock-json';

		mock.module('../../lib/package-json.js', { defaultExport: packageJson });
		mock.module('../../lib/package-lock-json.js', { defaultExport: packageLock });

		subject = require('../..');
	});

	describe('.packageJson', () => {
		it('is aliases lib/package-json', () => {
			assert.equal(subject.packageJson, packageJson);
		});
	});

	describe('.packageLock', () => {
		it('is aliases lib/package-lock-json', () => {
			assert.equal(subject.packageLock, packageLock);
		});
	});
});
