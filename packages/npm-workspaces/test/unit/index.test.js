'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const quibble = require('quibble');

describe('@rowanmanning/npm-workspaces', () => {
	let packageLock;
	let subject;

	beforeEach(() => {
		packageLock = { fromObject: mock.fn() };
		packageLock.fromObject.mock.mockImplementation((pkg) => pkg);
		quibble('@rowanmanning/package-json', { packageLock });

		subject = require('../..');
	});

	afterEach(() => quibble.reset());

	describe('.getPackageWorkspaces(pkg)', () => {
		let pkg;
		let returnValue;

		describe('when the package is a v3 package-lock.json file', () => {
			beforeEach(() => {
				pkg = {
					lockfileVersion: 3,
					name: 'mock-package-lock',
					version: 'mock-package-lock-version',
					packages: {
						'': {},
						'workspace-1': {},
						'mock/workspace-2': {},
						'node_modules/mock-dependency-1': {},
						'workspace-1/node_modules/mock-dependency-2': {},
						'mock/workspace-2/node_modules/mock-dependency-3': {}
					}
				};
				returnValue = subject.getPackageWorkspaces(pkg);
			});

			it('validate the package lock', () => {
				assert.equal(packageLock.fromObject.mock.callCount(), 1);
				assert.deepEqual(packageLock.fromObject.mock.calls.at(0).arguments, [pkg]);
			});

			it('returns the expected workspaces', () => {
				assert.deepEqual(returnValue, ['', 'workspace-1', 'mock/workspace-2']);
			});

			describe('when the package-lock has no workspaces', () => {
				it('returns an empty array', () => {
					pkg = {
						lockfileVersion: 3,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: {}
					};
					assert.deepEqual(subject.getPackageWorkspaces(pkg), []);
				});
			});

			describe('when the package-lock has no packages property', () => {
				it('returns an empty array', () => {
					pkg = {
						lockfileVersion: 3,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version'
					};
					assert.deepEqual(subject.getPackageWorkspaces(pkg), []);
				});
			});

			describe('when the package-lock has an invalid packagees property', () => {
				it('returns an empty array', () => {
					pkg = {
						lockfileVersion: 3,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: []
					};
					assert.deepEqual(subject.getPackageWorkspaces(pkg), []);
				});
			});
		});

		describe('when the package is a v2 package-lock.json file', () => {
			beforeEach(() => {
				pkg = {
					lockfileVersion: 2,
					name: 'mock-package-lock',
					version: 'mock-package-lock-version',
					packages: {
						'': {},
						'workspace-1': {},
						'mock/workspace-2': {},
						'node_modules/mock-dependency-1': {},
						'workspace-1/node_modules/mock-dependency-2': {},
						'mock/workspace-2/node_modules/mock-dependency-3': {}
					}
				};
				returnValue = subject.getPackageWorkspaces(pkg);
			});

			it('validate the package lock', () => {
				assert.equal(packageLock.fromObject.mock.callCount(), 1);
				assert.deepEqual(packageLock.fromObject.mock.calls.at(0).arguments, [pkg]);
			});

			it('returns the expected workspaces', () => {
				assert.deepEqual(returnValue, ['', 'workspace-1', 'mock/workspace-2']);
			});

			describe('when the package-lock has no workspaces', () => {
				it('returns an empty array', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: {}
					};
					assert.deepEqual(subject.getPackageWorkspaces(pkg), []);
				});
			});

			describe('when the package-lock has no packages property', () => {
				it('returns an empty array', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version'
					};
					assert.deepEqual(subject.getPackageWorkspaces(pkg), []);
				});
			});

			describe('when the package-lock has an invalid packagees property', () => {
				it('returns an empty array', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: []
					};
					assert.deepEqual(subject.getPackageWorkspaces(pkg), []);
				});
			});
		});

		describe('when the package is a v1 package-lock.json file', () => {
			it('throws an error', () => {
				pkg = {
					lockfileVersion: 1,
					name: 'mock-package-lock',
					version: 'mock-package-lock-version'
				};
				assert.throws(() => subject.getPackageWorkspaces(pkg), TypeError);
			});
		});
	});
});
