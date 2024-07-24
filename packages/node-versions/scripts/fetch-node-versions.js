'use strict';

const { writeFile } = require('node:fs/promises');
const { resolve: resolvePath } = require('node:path');
const { fetchNodeVersions } = require('../lib/fetch-node-versions');

const filePath = resolvePath(__dirname, '..', 'data', 'versions.json');

async function runScript() {
	const versions = await fetchNodeVersions();
	await writeFile(filePath, `${JSON.stringify(versions, null, '\t')}\n`);
}

runScript().catch((error) => {
	// biome-ignore lint/nursery/noConsole: required for debugging this script
	console.error(error.stack);
	process.exitCode = 1;
});
