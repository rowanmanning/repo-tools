import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getPackageNodeVersions } from '../../index.js';

describe('@rowanmanning/node-versions (end-to-end)', () => {
	describe('package-invalid-engines-array.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import(
				'./fixtures/package-invalid-engines-array.json',
				{
					with: { type: 'json' }
				}
			);
			const engines = getPackageNodeVersions(packageJson, { majorsOnly: true });
			assert.deepEqual(engines, []);
		});
	});

	describe('package-invalid-null.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import('./fixtures/package-invalid-null.json', {
				with: { type: 'json' }
			});
			const engines = getPackageNodeVersions(packageJson, { majorsOnly: true });
			assert.deepEqual(engines, []);
		});
	});

	describe('package-lock-v1.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import('./fixtures/package-lock-v1.json', {
				with: { type: 'json' }
			});
			const engines = getPackageNodeVersions(packageJson, {
				majorsOnly: true
			});
			assert.deepEqual(engines, []);
		});
	});

	describe('package-lock-v2.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import('./fixtures/package-lock-v2.json', {
				with: { type: 'json' }
			});
			const engines = getPackageNodeVersions(packageJson, {
				majorsOnly: true
			});
			assert.deepEqual(engines, ['8', '6']);
		});
	});

	describe('package-lock-v3.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import('./fixtures/package-lock-v3.json', {
				with: { type: 'json' }
			});
			const engines = getPackageNodeVersions(packageJson, {
				majorsOnly: true
			});
			assert.deepEqual(engines, ['8', '6']);
		});
	});

	describe('package-no-engines-node.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import(
				'./fixtures/package-no-engines-node.json',
				{
					with: { type: 'json' }
				}
			);
			const engines = getPackageNodeVersions(packageJson, { majorsOnly: true });
			assert.deepEqual(engines, []);
		});
	});

	describe('package-no-engines.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import('./fixtures/package-no-engines.json', {
				with: { type: 'json' }
			});
			const engines = getPackageNodeVersions(packageJson, {
				majorsOnly: true
			});
			assert.deepEqual(engines, []);
		});
	});

	describe('package.json', () => {
		it('has the expected engines', async () => {
			const { default: packageJson } = await import('./fixtures/package.json', {
				with: { type: 'json' }
			});
			const engines = getPackageNodeVersions(packageJson, {
				majorsOnly: true
			});
			assert.deepEqual(engines, ['8', '6']);
		});
	});
});
