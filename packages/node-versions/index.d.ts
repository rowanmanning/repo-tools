declare module '@rowanmanning/node-versions' {
	export interface Options {
		majorsOnly?: boolean | undefined;
	}

	export const nodeVersions: readonly string[];

	export function getEnginesNodeVersions(
		engines: string,
		options?: Options | undefined
	): string[];

	export function getPackageNodeVersions(
		path: string,
		options?: Options | undefined
	): Promise<string[]>;
}
