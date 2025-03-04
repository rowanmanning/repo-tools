
# @rowanmanning/package-json-github

Load and parse `package.json` and `package-lock.json` files from GitHub repositories.

* [Requirements](#requirements)
* [Usage](#usage)
  * [`packageJson.fromGitHub()`](#packagejsonfromgithub)
  * [`packageLock.fromGitHub()`](#packagelockfromgithub)
  * [Options](#options)
* [Contributing](#contributing)
* [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 20+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/package-json-github
```

Load into your code with `import` or `require`:

```js
import { packageJson, packageLock } from '@rowanmanning/package-json-github';
// or
const { packageJson, packageLock } = require('@rowanmanning/package-json-github');
```

The following exports are available.

### `packageJson.fromGitHub()`

Load the `package.json` file present in a GitHub repo.

```ts
(options: GitHubOptions) => Promise<PackageJson>
```

The `options` argument must be an object. [The available options are documented here](#options).

```js
const pkg = await packageJson.fromGitHub({
    auth: process.env.GITHUB_AUTH_TOKEN,
    owner: 'rowanmanning',
    repo: 'yeehaw'
});
// { name: '@rowanmanning/yeehaw', version: '2.0.0', ... }
```

### `packageLock.fromGitHub()`

Load the `package-lock.json` file present in a GitHub repo.

```ts
(options: GitHubOptions) => Promise<PackageLock>
```

The `options` argument must be an object. [The available options are documented here](#options).

```js
const pkg = await packageLock.fromGitHub({
    auth: process.env.GITHUB_AUTH_TOKEN,
    owner: 'rowanmanning',
    repo: 'yeehaw'
});
// { lockfileVersion: 2, name: '@rowanmanning/yeehaw', version: '2.0.0', ... }
```

### Options

The `options` argument must be an object. It's required and has the following properties. These are passed directly to the GitHub REST API, please [consult the API documentation for more information](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content).

  * `auth` (`string`, required). A [GitHub token](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api) with read access to the repo you specify

  * `owner` (`string`, required). The name of the GitHub user or organisation that the repo belongs to

  * `repo` (`string`, required). The name of the GitHub repo

  * `path` (`string`, optional). The path to the file you'd like to read. Defaults to `package.json` or `package-lock.json` depending on the method you're using

  * `ref` (`string`, optional). The name of the commit, branch, or tag to fetch the file from. Defaults to the repo's default branch


## Contributing

[See the central README for a contribution guide and code of conduct](https://github.com/rowanmanning/repo-tools#contributing).


## License

Licensed under the [MIT](https://github.com/rowanmanning/repo-tools/blob/main/LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
