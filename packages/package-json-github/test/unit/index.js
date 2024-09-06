'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it } = require('node:test');
const quibble = require('quibble');

describe('@rowanmanning/package-json-github', () => {
	let packageJson;
	let packageLock;
	let subject;

	beforeEach(() => {
		packageJson = 'mock-package-json';
		packageLock = 'mock-package-lock-json';

		quibble('../../lib/package-json', packageJson);
		quibble('../../lib/package-lock-json', packageLock);

		subject = require('../..');
	});

	afterEach(() => quibble.reset());

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
