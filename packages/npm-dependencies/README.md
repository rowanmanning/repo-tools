
# @rowanmanning/npm-dependencies

Get a resolved list of dependencies found in a `package.json` or `package-lock.json` file.

* [Requirements](#requirements)
* [Usage](#usage)
  * [`getPackageDependencies()`](#getpackagedependencies)
* [Contributing](#contributing)
* [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 18+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/npm-dependencies
```

Load one of the methods into your code with `import` or `require`:

```js
import { getPackageDependencies } from '@rowanmanning/npm-dependencies';
// or
const { getPackageDependencies } = require('@rowanmanning/npm-dependencies');
```

The following exports are available.

### `getPackageDependencies()`

A function to list the npm dependencies that a `package.json` or `package-lock.json` file installs. This function has the following signature:

```ts
(packageJson: PackageJson, options?: object) => Dependency[]
```

Returned dependencies have the following signature:

```ts
{
    name: string;
    version: string;
    isBundled: boolean;
    isDev: boolean;
    isOptional: boolean;
    isPeer: boolean;
}
```

`PackageJson` must be a JavaScript object that is a valid `package.json` or `package-lock.json` file. We recommend using [@rowanmanning/package-json](../package-json#readme) or [@npmcli/package-json](https://github.com/npm/package-json#readme).

The `options` argument is optional and can be used to change the way the method works. The following options are available:

  * `workspace`: A `string` option defaulting to `""`. This is used to specify which workspace in a `package-lock.json` file to get dependencies for, defaulting to the root workspace. This option has no effect for `package.json` files.

```js
const dependencies = getPackageDependencies(require('./package.json'));
// or
const dependencies = getPackageDependencies(require('./package-lock.json'));
```


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/repo-tools#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/repo-tools/blob/main/LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
