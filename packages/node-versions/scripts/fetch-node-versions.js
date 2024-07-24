'use strict';

const { mkdir, writeFile } = require('node:fs/promises');
const { resolve: resolvePath } = require('node:path');
const { fetchNodeVersions } = require('../lib/fetch-node-versions');

const directoryPath = resolvePath(__dirname, '..', 'data');
const filePath = resolvePath(directoryPath, 'versions.json');

async function runScript() {
	const versions = await fetchNodeVersions();
	await mkdir(directoryPath, { recursive: true });
	await writeFile(filePath, `${JSON.stringify(versions, null, '\t')}\n`);
}

runScript().catch((error) => {
	// biome-ignore lint/nursery/noConsole: required for debugging this script
	console.error(error.stack);
	process.exitCode = 1;
});
