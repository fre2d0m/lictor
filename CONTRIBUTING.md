# Contributing to Lictor

Thank you for your interest in contributing to Lictor! We appreciate your help and support. This document
outlines the guidelines and best practices for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a positive, inclusive, and welcoming
environment for everyone.

## How to Contribute

There are many ways to contribute to this project:

- Report bugs or request features by [opening an issue](https://github.com/insentek/lictor/issues/new).
- Improve existing code, documentation, or tests.
- Add new features or enhancements.

### Reporting Bugs or Requesting Features

Before submitting a bug report or feature request, please check
the [issue tracker](https://github.com/insentek/lictor/issues) to see if your issue has already been reported or is
being worked on. If it doesn't already exist, create a new issue with a clear title and description, following the
provided issue templates.

### Contributing Code

To contribute code, follow these steps:

1. Fork the repository and create your branch from the `main` branch.
2. If you've added code, make sure to add appropriate tests.
3. Ensure that the test suite passes by running `npm test`.
4. Follow the coding style enforced by the project, including ESLint and Prettier configurations.
5. Commit your changes with a clear, concise, and descriptive commit message, following the conventional commit format.
6. Push your branch to your fork on GitHub.
7. Create a pull request against the `main` branch of the original repository.

### Pull Request Process

Once you've submitted a pull request, the project maintainers will review your changes. They may ask for changes or
improvements before merging your changes. Be patient and responsive to feedback, and be prepared to make updates to your
pull request if necessary.

## Development Setup

To set up your local development environment, follow these steps:

1. Clone the repository to your local machine.
2. Run `yarn install` to install the project's dependencies.
3. Run `yarn start` to start the development server. Open your browser and navigate to `http://localhost:3000` to view
   the app.
4. Make your changes, and test them locally.
5. Run `npm test` to ensure that all tests pass before submitting your changes.

## Coding Style

This project uses ESLint and Prettier to enforce consistent coding style. Please ensure that your changes adhere to the
provided configurations. You can check your code by running `npm run lint`, and you can automatically fix most issues by
running `npm run lint:fix`.

## License

By contributing to this project, you agree that your contributions will be licensed under the
project's [LICENSE](LICENSE) file.
