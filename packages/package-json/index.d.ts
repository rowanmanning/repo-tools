declare module '@rowanmanning/package-json' {
	export interface PackageJson {
		[key: string]: unknown;
		lockfileVersion: never;
		name: string;
		version: string;
	}

	interface PackageLock {
		[key: string]: unknown;
		lockfileVersion: number;
		name: string;
		version: string;
	}

	export interface PackageLockV1 extends PackageLock {
		lockfileVersion: 1;
	}

	export interface PackageLockV2 extends PackageLock {
		lockfileVersion: 2;
	}

	export interface PackageLockV3 extends PackageLock {
		lockfileVersion: 3;
	}

	export type AnyPackageLock = PackageLockV1 | PackageLockV2 | PackageLockV3;

	interface PackageJsonMethods {
		fromObject(packageJson: PackageJson): PackageJson;
		fromString(jsonString: string): PackageJson;
		fromFile(path: string): Promise<PackageJson>;
		fromDirectory(path: string): Promise<PackageJson>;
	}

	interface PackageLockMethods {
		fromObject(packageJson: AnyPackageLock): AnyPackageLock;
		fromString(jsonString: string): AnyPackageLock;
		fromFile(path: string): Promise<AnyPackageLock>;
		fromDirectory(path: string): Promise<AnyPackageLock>;
	}

	export const packageJson: PackageJsonMethods;
	export const packageLock: PackageLockMethods;
}
