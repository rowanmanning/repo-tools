import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fetchNodeVersions } from '../lib/fetch-node-versions.js';

const filePath = resolve(import.meta.dirname, '..', 'data', 'versions.json');

async function runScript() {
	const versions = await fetchNodeVersions();
	await writeFile(filePath, `${JSON.stringify(versions, null, '\t')}\n`);
}

runScript().catch((error) => {
	// biome-ignore lint/suspicious/noConsole: required for debugging this script
	console.error(error.stack);
	process.exitCode = 1;
});
