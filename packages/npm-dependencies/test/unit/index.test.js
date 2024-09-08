'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const quibble = require('quibble');

describe('@rowanmanning/npm-dependencies', () => {
	let packageJson;
	let packageLock;
	let subject;

	beforeEach(() => {
		packageJson = { fromObject: mock.fn() };
		packageJson.fromObject.mock.mockImplementation((pkg) => pkg);
		packageLock = { fromObject: mock.fn() };
		packageLock.fromObject.mock.mockImplementation((pkg) => pkg);
		quibble('@rowanmanning/package-json', { packageJson, packageLock });

		subject = require('../..');
	});

	afterEach(() => quibble.reset());

	describe('.getPackageDependencies(pkg, options)', () => {
		let pkg;
		let returnValue;

		describe('when the package is a package.json file', () => {
			beforeEach(() => {
				pkg = {
					name: 'mock-package',
					version: 'mock-package-version',
					dependencies: {
						'mock-dependency-1': 'mock-version-1',
						'mock-dependency-2': 'mock-version-2'
					}
				};
				returnValue = subject.getPackageDependencies(pkg);
			});

			it('validate the package', () => {
				assert.equal(packageJson.fromObject.mock.callCount(), 1);
				assert.deepEqual(packageJson.fromObject.mock.calls.at(0).arguments, [pkg]);
			});

			it('returns the expected dependencies', () => {
				assert.deepEqual(returnValue, [
					{
						name: 'mock-dependency-1',
						version: 'mock-version-1',
						isBundled: false,
						isDev: false,
						isOptional: false,
						isPeer: false
					},
					{
						name: 'mock-dependency-2',
						version: 'mock-version-2',
						isBundled: false,
						isDev: false,
						isOptional: false,
						isPeer: false
					}
				]);
			});

			describe('when the package has dev dependencies', () => {
				it('returns the expected dependencies', () => {
					pkg = {
						name: 'mock-package',
						version: 'mock-package-version',
						devDependencies: {
							'mock-dev-dependency-1': 'mock-version-1',
							'mock-dev-dependency-2': 'mock-version-2'
						}
					};
					assert.deepEqual(subject.getPackageDependencies(pkg), [
						{
							name: 'mock-dev-dependency-1',
							version: 'mock-version-1',
							isBundled: false,
							isDev: true,
							isOptional: false,
							isPeer: false
						},
						{
							name: 'mock-dev-dependency-2',
							version: 'mock-version-2',
							isBundled: false,
							isDev: true,
							isOptional: false,
							isPeer: false
						}
					]);
				});
			});
		});

		describe('when the package has optional dependencies', () => {
			it('returns the expected dependencies', () => {
				pkg = {
					name: 'mock-package',
					version: 'mock-package-version',
					optionalDependencies: {
						'mock-optional-dependency-1': 'mock-version-1',
						'mock-optional-dependency-2': 'mock-version-2'
					}
				};
				assert.deepEqual(subject.getPackageDependencies(pkg), [
					{
						name: 'mock-optional-dependency-1',
						version: 'mock-version-1',
						isBundled: false,
						isDev: false,
						isOptional: true,
						isPeer: false
					},
					{
						name: 'mock-optional-dependency-2',
						version: 'mock-version-2',
						isBundled: false,
						isDev: false,
						isOptional: true,
						isPeer: false
					}
				]);
			});
		});

		describe('when the package has peer dependencies', () => {
			it('returns the expected dependencies', () => {
				pkg = {
					name: 'mock-package',
					version: 'mock-package-version',
					peerDependencies: {
						'mock-peer-dependency-1': 'mock-version-1',
						'mock-peer-dependency-2': 'mock-version-2'
					}
				};
				assert.deepEqual(subject.getPackageDependencies(pkg), [
					{
						name: 'mock-peer-dependency-1',
						version: 'mock-version-1',
						isBundled: false,
						isDev: false,
						isOptional: false,
						isPeer: true
					},
					{
						name: 'mock-peer-dependency-2',
						version: 'mock-version-2',
						isBundled: false,
						isDev: false,
						isOptional: false,
						isPeer: true
					}
				]);
			});

			describe('and some peer dependencies are optional', () => {
				it('returns the expected dependencies', () => {
					pkg = {
						name: 'mock-package',
						version: 'mock-package-version',
						peerDependencies: {
							'mock-peer-dependency-1': 'mock-version-1',
							'mock-peer-dependency-2': 'mock-version-2'
						},
						peerDependenciesMeta: {
							'mock-peer-dependency-2': {
								optional: true
							}
						}
					};
					assert.deepEqual(subject.getPackageDependencies(pkg), [
						{
							name: 'mock-peer-dependency-1',
							version: 'mock-version-1',
							isBundled: false,
							isDev: false,
							isOptional: false,
							isPeer: true
						},
						{
							name: 'mock-peer-dependency-2',
							version: 'mock-version-2',
							isBundled: false,
							isDev: false,
							isOptional: true,
							isPeer: true
						}
					]);
				});
			});

			describe('when the package has some bundled dependencies', () => {
				it('returns the expected dependencies', () => {
					pkg = {
						name: 'mock-package',
						version: 'mock-package-version',
						dependencies: {
							'mock-dependency-1': 'mock-version-1',
							'mock-dependency-2': 'mock-version-2'
						},
						bundleDependencies: ['mock-dependency-2']
					};
					assert.deepEqual(subject.getPackageDependencies(pkg), [
						{
							name: 'mock-dependency-1',
							version: 'mock-version-1',
							isBundled: false,
							isDev: false,
							isOptional: false,
							isPeer: false
						},
						{
							name: 'mock-dependency-2',
							version: 'mock-version-2',
							isBundled: true,
							isDev: false,
							isOptional: false,
							isPeer: false
						}
					]);
				});

				describe('but they use the alternative property name', () => {
					it('returns the expected dependencies', () => {
						pkg = {
							name: 'mock-package',
							version: 'mock-package-version',
							dependencies: {
								'mock-dependency-1': 'mock-version-1',
								'mock-dependency-2': 'mock-version-2'
							},
							bundledDependencies: ['mock-dependency-2']
						};
						assert.deepEqual(subject.getPackageDependencies(pkg), [
							{
								name: 'mock-dependency-1',
								version: 'mock-version-1',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							},
							{
								name: 'mock-dependency-2',
								version: 'mock-version-2',
								isBundled: true,
								isDev: false,
								isOptional: false,
								isPeer: false
							}
						]);
					});
				});
			});

			describe('when the package bundles all dependencies', () => {
				it('returns the expected dependencies', () => {
					pkg = {
						name: 'mock-package',
						version: 'mock-package-version',
						dependencies: {
							'mock-dependency-1': 'mock-version-1',
							'mock-dependency-2': 'mock-version-2'
						},
						bundleDependencies: true
					};
					assert.deepEqual(subject.getPackageDependencies(pkg), [
						{
							name: 'mock-dependency-1',
							version: 'mock-version-1',
							isBundled: true,
							isDev: false,
							isOptional: false,
							isPeer: false
						},
						{
							name: 'mock-dependency-2',
							version: 'mock-version-2',
							isBundled: true,
							isDev: false,
							isOptional: false,
							isPeer: false
						}
					]);
				});

				describe('but they use the alternative property name', () => {
					it('returns the expected dependencies', () => {
						pkg = {
							name: 'mock-package',
							version: 'mock-package-version',
							dependencies: {
								'mock-dependency-1': 'mock-version-1',
								'mock-dependency-2': 'mock-version-2'
							},
							bundledDependencies: true
						};
						assert.deepEqual(subject.getPackageDependencies(pkg), [
							{
								name: 'mock-dependency-1',
								version: 'mock-version-1',
								isBundled: true,
								isDev: false,
								isOptional: false,
								isPeer: false
							},
							{
								name: 'mock-dependency-2',
								version: 'mock-version-2',
								isBundled: true,
								isDev: false,
								isOptional: false,
								isPeer: false
							}
						]);
					});
				});
			});

			describe('when the package has invalid dependencies', () => {
				it('excludes them', () => {
					pkg = {
						name: 'mock-package',
						version: 'mock-package-version',
						dependencies: {
							'mock-dependency-1': 'mock-version-1',
							'mock-dependency-2': 123
						}
					};
					assert.deepEqual(subject.getPackageDependencies(pkg), [
						{
							name: 'mock-dependency-1',
							version: 'mock-version-1',
							isBundled: false,
							isDev: false,
							isOptional: false,
							isPeer: false
						}
					]);
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
						'': {
							name: 'mock-package',
							version: 'mock-package-version',
							dependencies: {
								'mock-dependency-1': 'mock-version-1',
								'mock-dependency-2': 'mock-version-2'
							}
						},
						'node_modules/mock-dependency-1': {
							version: 'mock-resolved-version-1'
						},
						'node_modules/mock-dependency-2': {
							version: 'mock-resolved-version-2'
						}
					}
				};
				returnValue = subject.getPackageDependencies(pkg);
			});

			it('validate the package lock', () => {
				assert.equal(packageLock.fromObject.mock.callCount(), 1);
				assert.deepEqual(packageLock.fromObject.mock.calls.at(0).arguments, [pkg]);
			});

			it('returns the expected dependencies', () => {
				assert.deepEqual(returnValue, [
					{
						name: 'mock-dependency-1',
						version: 'mock-resolved-version-1',
						isBundled: false,
						isDev: false,
						isOptional: false,
						isPeer: false
					},
					{
						name: 'mock-dependency-2',
						version: 'mock-resolved-version-2',
						isBundled: false,
						isDev: false,
						isOptional: false,
						isPeer: false
					}
				]);
			});

			describe('when some dependencies are linked to local workspaces', () => {
				it('resolves versions as expected', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: {
							'mock-workspace': {
								name: 'mock-package',
								version: 'mock-package-version',
								dependencies: {
									'mock-dependency-1': 'mock-version-1',
									'mock-dependency-2': 'mock-version-2'
								}
							},
							'node_modules/mock-dependency-1': {
								version: 'mock-resolved-version-1'
							},
							'node_modules/mock-dependency-2': {
								link: true,
								resolved: 'workspaces/mock-dependency-2'
							},
							'workspaces/mock-dependency-2': {
								version: 'mock-resolved-version-2'
							}
						}
					};
					assert.deepEqual(
						subject.getPackageDependencies(pkg, { workspace: 'mock-workspace' }),
						[
							{
								name: 'mock-dependency-1',
								version: 'mock-resolved-version-1',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							},
							{
								name: 'mock-dependency-2',
								version: 'mock-resolved-version-2',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							}
						]
					);
				});

				describe('when workspaces are linked more than one deep', () => {
					it('it only follows one link and falls back to the version range', () => {
						pkg = {
							lockfileVersion: 2,
							name: 'mock-package-lock',
							version: 'mock-package-lock-version',
							packages: {
								'mock-workspace': {
									name: 'mock-package',
									version: 'mock-package-version',
									dependencies: {
										'mock-dependency-1': 'mock-version-1',
										'mock-dependency-2': 'mock-version-2'
									}
								},
								'node_modules/mock-dependency-1': {
									version: 'mock-resolved-version-1'
								},
								'node_modules/mock-dependency-2': {
									link: true,
									resolved: 'workspaces/mock-dependency-2a'
								},
								'workspaces/mock-dependency-2a': {
									link: true,
									resolved: 'workspaces/mock-dependency-2b'
								},
								'workspaces/mock-dependency-2b': {
									version: 'mock-resolved-version-2'
								}
							}
						};
						assert.deepEqual(
							subject.getPackageDependencies(pkg, { workspace: 'mock-workspace' }),
							[
								{
									name: 'mock-dependency-1',
									version: 'mock-resolved-version-1',
									isBundled: false,
									isDev: false,
									isOptional: false,
									isPeer: false
								},
								{
									name: 'mock-dependency-2',
									version: 'mock-version-2',
									isBundled: false,
									isDev: false,
									isOptional: false,
									isPeer: false
								}
							]
						);
					});
				});
			});

			describe('when `options.workspace` is defined', () => {
				it('returns the dependencies from that workspace', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: {
							'mock-workspace': {
								name: 'mock-package',
								version: 'mock-package-version',
								dependencies: {
									'mock-dependency-1': 'mock-version-1',
									'mock-dependency-2': 'mock-version-2'
								}
							},
							'node_modules/mock-dependency-1': {
								version: 'mock-resolved-version-1'
							},
							'node_modules/mock-dependency-2': {
								version: 'mock-resolved-version-2'
							}
						}
					};
					assert.deepEqual(
						subject.getPackageDependencies(pkg, { workspace: 'mock-workspace' }),
						[
							{
								name: 'mock-dependency-1',
								version: 'mock-resolved-version-1',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							},
							{
								name: 'mock-dependency-2',
								version: 'mock-resolved-version-2',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							}
						]
					);
				});

				describe('when the workspace has local node_modules', () => {
					it('returns the dependencies from that workspace', () => {
						pkg = {
							lockfileVersion: 2,
							name: 'mock-package-lock',
							version: 'mock-package-lock-version',
							packages: {
								'mock-workspace': {
									name: 'mock-package',
									version: 'mock-package-version',
									dependencies: {
										'mock-dependency-1': 'mock-version-1',
										'mock-dependency-2': 'mock-version-2'
									}
								},
								'node_modules/mock-dependency-1': {
									version: 'mock-resolved-version-1'
								},
								'mock-workspace/node_modules/mock-dependency-2': {
									version: 'mock-resolved-version-2'
								}
							}
						};
						assert.deepEqual(
							subject.getPackageDependencies(pkg, { workspace: 'mock-workspace' }),
							[
								{
									name: 'mock-dependency-1',
									version: 'mock-resolved-version-1',
									isBundled: false,
									isDev: false,
									isOptional: false,
									isPeer: false
								},
								{
									name: 'mock-dependency-2',
									version: 'mock-resolved-version-2',
									isBundled: false,
									isDev: false,
									isOptional: false,
									isPeer: false
								}
							]
						);
					});
				});
			});

			describe('when some dependencies cannot be resolved', () => {
				it('returns the dependencies with ranges instead of resolved versions', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: {
							'mock-workspace': {
								name: 'mock-package',
								version: 'mock-package-version',
								dependencies: {
									'mock-dependency-1': 'mock-version-1',
									'mock-dependency-2': 'mock-version-2'
								}
							}
						}
					};
					assert.deepEqual(
						subject.getPackageDependencies(pkg, { workspace: 'mock-workspace' }),
						[
							{
								name: 'mock-dependency-1',
								version: 'mock-version-1',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							},
							{
								name: 'mock-dependency-2',
								version: 'mock-version-2',
								isBundled: false,
								isDev: false,
								isOptional: false,
								isPeer: false
							}
						]
					);
				});
			});

			describe('when the package-lock has no default workspace', () => {
				it('returns no dependencies', () => {
					pkg = {
						lockfileVersion: 2,
						name: 'mock-package-lock',
						version: 'mock-package-lock-version',
						packages: {}
					};
					assert.deepEqual(subject.getPackageDependencies(pkg), []);
				});
			});
		});

		describe('when `options` is null', () => {
			it('throws a type error', () => {
				assert.throws(() => subject.getPackageDependencies(pkg, null), TypeError);
			});
		});

		describe('when `options` is not an object', () => {
			it('throws a type error', () => {
				assert.throws(() => subject.getPackageDependencies(pkg, 'string'), TypeError);
			});
		});

		describe('when `options` is an array', () => {
			it('throws a type error', () => {
				assert.throws(() => subject.getPackageDependencies(pkg, []), TypeError);
			});
		});

		describe('when `options.workspace` is not a string', () => {
			it('throws a type error', () => {
				assert.throws(
					() => subject.getPackageDependencies(pkg, { workspace: 123 }),
					TypeError
				);
			});
		});

		describe('when the package is a v1 package-lock.json file', () => {
			it('throws an error', () => {
				pkg = {
					lockfileVersion: 1,
					name: 'mock-package-lock',
					version: 'mock-package-lock-version'
				};
				assert.throws(() => subject.getPackageDependencies(pkg), TypeError);
			});
		});
	});
});
