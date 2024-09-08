'use strict';

const { packageJson, packageLock } = require('@rowanmanning/package-json');

/**
 * @import npmDependencies from '@rowanmanning/npm-dependencies'
 * @import { PackageJson, PackageLockV2, PackageLockV3 } from '@rowanmanning/package-json'
 */

/**
 * @typedef {object} DependencyPropertyConfig
 * @property {string} property
 * @property {string | null} metaProperty,
 * @property {{isDev: boolean, isOptional: boolean, isPeer: boolean}} baseData
 */

/** @type {DependencyPropertyConfig[]} */
const dependencyProperties = [
	{
		property: 'dependencies',
		metaProperty: null,
		baseData: { isDev: false, isOptional: false, isPeer: false }
	},
	{
		property: 'devDependencies',
		metaProperty: null,
		baseData: { isDev: true, isOptional: false, isPeer: false }
	},
	{
		property: 'optionalDependencies',
		metaProperty: null,
		baseData: { isDev: false, isOptional: true, isPeer: false }
	},
	{
		property: 'peerDependencies',
		metaProperty: 'peerDependenciesMeta',
		baseData: { isDev: false, isOptional: false, isPeer: true }
	}
];

/** @type {npmDependencies['getPackageDependencies']} */
exports.getPackageDependencies = function getPackageDependencies(pkg, userOptions) {
	const options = validateOptions(userOptions);
	if (typeof pkg.lockfileVersion === 'number') {
		const lockfile = packageLock.fromObject(pkg);
		if (lockfile.lockfileVersion === 2 || lockfile.lockfileVersion === 3) {
			return getPackageLockDependencies(lockfile, options);
		}
		throw new TypeError('Invalid argument: pkg is a lockfile other than v2 or v3');
	}
	return getPackageJsonDependencies(packageJson.fromObject(pkg));
};

/**
 * @param {PackageJson} pkg
 * @returns {npmDependencies.Dependency[]}
 */
function getPackageJsonDependencies(pkg) {
	return dependencyProperties.flatMap((property) => getDependenciesFromProperty(pkg, property));
}

/**
 * @param {PackageLockV2 | PackageLockV3} pkg
 * @param {Required<npmDependencies.Options>} options
 * @returns {npmDependencies.Dependency[]}
 */
function getPackageLockDependencies(pkg, options) {
	return getPackageLockV2Dependencies(pkg, options);
}

/**
 * @param {PackageLockV2 | PackageLockV3} pkg
 * @param {Required<npmDependencies.PackageLockOptions>} options
 * @returns {npmDependencies.Dependency[]}
 */
function getPackageLockV2Dependencies(pkg, { workspace }) {
	if (!pkg.packages?.[workspace]) {
		return [];
	}
	return getPackageJsonDependencies(pkg.packages?.[workspace]).map((dependency) => {
		// Try to work out the exact installed version of the dependency based on
		// the rest of the package-lock file.
		const possibleInstallLocations = [`node_modules/${dependency.name}`];
		if (workspace !== '') {
			possibleInstallLocations.unshift(`${workspace}/node_modules/${dependency.name}`);
		}
		let followedLink = false;
		for (const installLocation of possibleInstallLocations) {
			const installedPackage = pkg.packages?.[installLocation];
			if (installedPackage) {
				if (typeof installedPackage.version === 'string') {
					dependency.version = pkg.packages[installLocation].version;
					break;
				}

				// We only follow links once to avoid infinite loops and because
				// package-lock.json _should_ only ever have one level of linking
				if (
					!followedLink &&
					installedPackage.link === true &&
					typeof installedPackage.resolved === 'string'
				) {
					possibleInstallLocations.push(installedPackage.resolved);
					followedLink = true;
				}
			}
		}
		return dependency;
	});
}

/**
 * @param {PackageJson} pkg
 * @param {DependencyPropertyConfig} property
 * @returns {npmDependencies.Dependency[]}
 */
function getDependenciesFromProperty(pkg, { property, metaProperty, baseData }) {
	const dependencies = pkg[property];
	if (!dependencies || typeof dependencies !== 'object' || Array.isArray(dependencies)) {
		return [];
	}
	return Object.entries(dependencies).reduce(
		(result, [name, version]) => {
			if (typeof name === 'string' && typeof version === 'string') {
				const dependency = Object.assign(
					{
						name,
						version,
						isBundled: isBundledDependency(pkg, name)
					},
					baseData
				);
				if (!dependency.isOptional && metaProperty) {
					dependency.isOptional = pkg[metaProperty]?.[name]?.optional === true;
				}
				result.push(dependency);
			}
			return result;
		},
		/** @type {npmDependencies.Dependency[]} */ ([])
	);
}

/**
 * Work out whether a package has a bundled dependency. Note: this can be in one
 * of two properties: `bundleDependencies` or `bundledDependencies`.
 *
 * > If this is spelled `"bundledDependencies"`, then that is also honored.
 *
 * @see https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bundledependencies
 *
 * @param {PackageJson} pkg
 * @param {string} name
 */
function isBundledDependency(pkg, name) {
	if (pkg.bundleDependencies === true) {
		return true;
	}
	if (Array.isArray(pkg.bundleDependencies) && pkg.bundleDependencies.includes(name)) {
		return true;
	}
	if (pkg.bundledDependencies === true) {
		return true;
	}
	if (Array.isArray(pkg.bundledDependencies) && pkg.bundledDependencies.includes(name)) {
		return true;
	}
	return false;
}

/**
 * @param {npmDependencies.PackageLockOptions} userOptions
 * @returns {Required<npmDependencies.PackageLockOptions>}
 */
function validateOptions(userOptions = {}) {
	if (!userOptions || typeof userOptions !== 'object' || Array.isArray(userOptions)) {
		throw new TypeError('Invalid argument: options must be an object');
	}
	const options = Object.assign({ workspace: '' }, userOptions);
	if (options.workspace !== undefined && typeof options.workspace !== 'string') {
		throw new TypeError('Invalid argument: options.workspace must be a string or undefined');
	}
	return options;
}
