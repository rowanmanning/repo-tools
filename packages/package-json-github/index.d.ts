import type { AnyPackageLock, PackageJson } from '@rowanmanning/package-json';

declare module '@rowanmanning/package-json-github' {
	export type {
		AnyPackageLock,
		PackageJson,
		PackageLockV1,
		PackageLockV2,
		PackageLockV3
	} from '@rowanmanning/package-json';

	export interface GitHubOptions {
		auth: string;
		owner: string;
		repo: string;
		path?: string | undefined;
		ref?: string | undefined;
	}

	interface PackageJsonMethods {
		fromGitHubRepo(options: GitHubOptions): Promise<PackageJson>;
	}

	interface PackageLockMethods {
		fromGitHubRepo(options: GitHubOptions): Promise<AnyPackageLock>;
	}

	export const packageJson: PackageJsonMethods;
	export const packageLock: PackageLockMethods;
}
