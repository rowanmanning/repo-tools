declare module '@rowanmanning/package-json' {
	export interface PackageJson {
		// biome-ignore lint/suspicious/noExplicitAny: this is data we can't control - any is valid here
		[key: string]: any;
		lockfileVersion: never;
		name: string;
		version: string;
	}

	interface PackageLock {
		// biome-ignore lint/suspicious/noExplicitAny: this is data we can't control - any is valid here
		[key: string]: any;
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
		fromObject(packageObject: PackageJson): PackageJson;
		fromString(jsonString: string): PackageJson;
		fromFile(path: string): Promise<PackageJson>;
		fromDirectory(path: string): Promise<PackageJson>;
	}

	interface PackageLockMethods {
		fromObject(packageObject: AnyPackageLock): AnyPackageLock;
		fromString(jsonString: string): AnyPackageLock;
		fromFile(path: string): Promise<AnyPackageLock>;
		fromDirectory(path: string): Promise<AnyPackageLock>;
	}

	export const packageJson: PackageJsonMethods;
	export const packageLock: PackageLockMethods;
}
