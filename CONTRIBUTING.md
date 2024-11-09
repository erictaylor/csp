<!--
Replace the following placeholders with the actual values:
- `<% GITHUB_REPO_PATH %>`: GitHub repository path (e.g., `erictaylor/waffle`)
- `<% GITHUB_REPO_NAME %>`: GitHub repository name (e.g., `waffle`)
- `<% LIBRARY_BRAND_NAME %>`: Library brand name (e.g., `Waffle`)
-->

# Contributing

<% LIBRARY_BRAND_NAME %> is an open-source project and we welcome contributions
from the community. Thank you!

Below you can find some guidance on how to be most effective when contributing
to the project.

## Before getting started

Your interest in contributing is much appreciated! In an effort to make the
process as smooth as possible. Outlined below are some guidelines to help you
along the way. Please take a moment to **review this document in its entirety
before contributing**. If you have any questions, please don't hesitate to reach
out.

Please note that the maintainers consistently strive to communicate status and
current thinking around all open issues, there may be times when context
surrounding certain items is not up to date. Therefore, **for non-trivial
changes, please always engage on the issue or create a discussion or feature
request issue first before writing your code**. This will give us an opportunity
to flag any considerations or potential issues early on before you spend time
developing. Of course, for trivial changes, please feel free to go directly to
filing a PR, with the understanding that the PR itself will serve as the place
to discuss details of the change.

We look forward to your contribution!

## Getting started

### Set up your environment

This codebase is built on the Deno runtime.

- Install the latest stable version of [Deno](https://deno.com/).
- Install a code editor - we recommend using
  [VS Code](https://code.visualstudio.com/).
  - When opening the project in VS Code for the first time, it will prompt you
    to install the
    [recommended VS Code extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#:~:text=install%20the%20recommended%20extensions)
    for the project.
- Install the [git](https://git-scm.com/) version control tool.

### Fork and clone the repository

Any contributions you make will be via
[Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
on [GitHub](https://github.com/) developed in a local git repository and pushed
to your own fork of the repository.

- Ensure you have
  [created an account](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account)
  on GitHub.
- [Create your own fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
  of [this repository](https://github.com/<% GITHUB_REPO_PATH %>).
- Clone your fork to your local machine
  ```sh
  > git clone https://github.com/<your-github-username>/<% GITHUB_REPO_NAME %>
  > cd <% GITHUB_REPO_NAME %>
  ```
  You can see that your fork is setup as the `origin` remote repository. Any
  changes you wish to make should be in a local branch that is then pushed to
  this origin remote.
  ```sh
  > git remote -v
  origin	https://github.com/<your-github-username>/<% GITHUB_REPO_NAME %> (fetch)
  origin	https://github.com/<your-github-username>/<% GITHUB_REPO_NAME %> (push)
  ```
- Add `<% GITHUB_REPO_PATH %>` as the `upstream` remote repository.
  ```sh
  > git remote add upstream https://github.com/<% GITHUB_REPO_PATH %>
  > git remote -v
  origin	https://github.com/<your-github-username>/<% GITHUB_REPO_NAME %> (fetch)
  origin	https://github.com/<your-github-username>/<% GITHUB_REPO_NAME %> (push)
  upstream	https://github.com/<% GITHUB_REPO_PATH %> (fetch)
  upstream	https://github.com/<% GITHUB_REPO_PATH %> (push)
  ```
- You should regularly pull from the `main` branch of the `upstream` repository
  to keep up to date with the latest changes to the project.
  ```sh
  > git switch main
  > git pull upstream main
  From https://github.com/<% GITHUB_REPO_PATH %>
  * branch            main       -> FETCH_HEAD
  Already up to date.
  ```

### Linting

The code is checked for linting errors using
[Deno](https://docs.deno.com/runtime/reference/cli/linter/).

- Run the linting checks
  ```sh
  > deno lint
  ```
- The repository has a recommended VS Code extension to run linting checks while
  editing source code, providing immediate feedback.

### Formatting

The code is check for formatting errors by
[Deno](https://docs.deno.com/runtime/reference/cli/formatter/).

- Run the formatting checks
  ```sh
  > deno fmt --check
  ```
- The repository has a recommended VS Code plugin to run format checks, and to
  automatically format using Deno, while editing source code, providing
  immediate feedback.
- Use the following command to run the formatter on the codebase
  ```sh
  > deno fmt
  ```

### Testing

The code is tested by [Deno](https://docs.deno.com/runtime/reference/cli/test/).

- Run the tests
  ```sh
  > deno test
  ```
- You can also run tests for a specific file
  ```sh
  > deno test <path-to-test-file>
  ```
- You can watch for changes and run tests automatically
  ```sh
  > deno test --watch
  ```

## Steps For Making Changes

Every change you make should be stored in a
[git commit](https://github.com/git-guides/git-commit). Changes should be
committed to a new local branch, which then gets pushed to your fork of the
repository on GitHub.

- Ensure your `main` branch is up to date
  ```sh
  > git switch main
  > git pull upstream main
  ```
- Create a new branch, based off the `main` branch
  ```sh
  > git checkout -b <new-branch-name> main
  ```
- Stage files to include in a commit
  - Use
    [VS Code](https://code.visualstudio.com/docs/editor/versioncontrol#_git-support)
  - Or add and commit files via the command line
  ```sh
  > git add <paths-to-changes-files>
  > git commit
  ```
- Push changes to your fork
  ```sh
  > git push -u origin <new-branch-name>
  ```
- Once you are happy with your changes, create a Pull Request on GitHub
- GitHub will insert a template for the body of your Pull Request—it's important
  to carefully fill out all the fields, giving as much detail as possible to
  reviewers.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The
header has a special format that includes a **type**, a **scope** and a
**subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the
message to be easier to read on GitHub as well as in various git tools.

The footer should contain a
[closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/)
if any.

```
docs: add example usage code to generateRandomPrivateKey
```

```
fix: change to type error if argument coercion fails

Previously, the function would throw an generic Error if the argument was not a string.
This change will throw a TypeError instead.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`,
followed by the header of the reverted commit. In the body it should say:
`This reverts commit <hash>.`, where the hash is the SHA of the commit being
reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not
"changed" nor "changes". The body should include the motivation for the change
and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also
the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space
or two newlines. The rest of the commit message is then used for this.

More information can be found
[here](https://www.conventionalcommits.org/en/v1.0.0/).

## PR Review

PR review is a critical and required step in the process for landing changes.
This is an opportunity to catch potential issues, improve the quality of the
work, celebrate good design, and learn from each other.

As a reviewer, it's important to be thoughtful about the proposed changes and
communicate any feedback.

## PR Tests

Every PR should include tests for the functionality that's being added. For
documentation on how the testing frameworks work, see:

- [Deno testing fundamentals](https://docs.deno.com/runtime/fundamentals/testing/)
- [`@std/assert`](https://jsr.io/@std/assert)

## Styleguide

When contributing, please refer to the [`STYLEGUIDE.md`](./STYLEGUIDE.md) file
to help maintain consistent patterns throughout the codebase.

## Runtime Compatibility

Please ensure that all changes are compatible across the supported runtime
environments:

- Node.js
- Deno
- Bun
- Browsers (ie. Chrome, Firefox, Safari, Edge)
- Web Workers (ie. Cloudflare Workers)

In order to keep the codebase compatible with these environments, **do not use**
any features that are not supported in all of them.

> **IMPORTANT**
>
> Do not import or use any dependencies in the distribution code that are not
> cross-runtime compatible.
>
> For example, do not use Node.js-specific APIs in the codebase, as this will
> break compatibility with the browser and web workers.
>
> ```ts
> // ❌ Do not use Node.js-specific APIs
> import { buffer } from 'node:buffer';
> ```
