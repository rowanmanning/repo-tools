
# @rowanmanning/node-versions

Get the Node.js versions that a repo says it supports.

* [Requirements](#requirements)
* [Usage](#usage)
  * [`nodeVersions`](#nodeversions)
  * [`getPackageNodeVersions()`](#getpackagenodeversions)
  * [`getEnginesNodeVersions()`](#getenginesnodeversions)
* [Contributing](#contributing)
* [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 22+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/node-versions
```

Load one of the methods into your code with `import` or `require`:

```js
import { nodeVersions } from '@rowanmanning/node-versions';
// or
const { nodeVersions } = require('@rowanmanning/node-versions');
```

The following exports are available.

### `nodeVersions`

An array of strings (`string[]`) that contains every released versions of Node.js, retrieved from <https://nodejs.org/dist/index.json>. The versions are loaded on install rather than at runtime and there's a cached copy in the package that we keep up to date.

### `getPackageNodeVersions()`

A function to list the Node.js versions that a `package.json` file claims to support. This function has the following signature:

```ts
(packageJson: PackageJson, options?: object) => string[]
```

`PackageJson` must be a JavaScript object that is a valid `package.json` or `package-lock.json` file. We recommend using [@rowanmanning/package-json](../package-json#readme) or [@npmcli/package-json](https://github.com/npm/package-json#readme).

The `options` argument is optional and can be used to change the way the method works. The following options are available:

  * `majorsOnly`: A `boolean` option defaulting to `false`. If this is set to `true` then the returned versions will have any minor/patch versions removed. E.g. `20.0.0` becomes `20`

```js
const versions = getPackageNodeVersions(require('./package.json'));
// ["v22.5.1", "v20.16.0", "v18.20.4", ...]

const versions = await getPackageNodeVersions(require('./package.json'), { majorsOnly: true });
// ["22", "20", "18", ...]
```

### `getEnginesNodeVersions()`

A function to list the supported Node.js versions based on a version range string. This might be useful if, for example, you already have the engines your package supports as a string. This function has the following signature:

```ts
(engines: string, options?: object) => string[]
```

The `engines` argument is required and must be a semver range.

The `options` argument is optional and can be used to change the way the method works. The following options are available:

  * `majorsOnly`: A `boolean` option defaulting to `false`. If this is set to `true` then the returned versions will have any minor/patch versions removed. E.g. `20.0.0` becomes `20`

```js
const versions = getEnginesNodeVersions('18.x || 20.x || 22.x');
// ["v22.5.1", "v20.16.0", "v18.20.4", ...]

const versions = getEnginesNodeVersions('18.x || 20.x || 22.x', { majorsOnly: true });
// ["22", "20", "18", ...]
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/repo-tools#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/repo-tools/blob/main/LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
