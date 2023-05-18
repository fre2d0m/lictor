# Lictor

Lictor is a chatbot web application for teams to use and collaborate. It not only helps the team to prompt their expert
system (based on Prompts), but also allows them to perform different events through the handler, built on the OpenAI API

## Features & Roadmap

### MVP(Minimum available product) Stage

- []: A short description of the first feature.
- []: A short description of the second feature.
- []: A short description of the third feature.

## What's New

Nothing in here yet.

## QuickStart

### Deploy

**Docker**

```shell
# build
docker build -t lictor:latest .

# run
docker run -d -p 7001:7001 \
-e REDISPORT=[YOUR REDIS PORT] \
-e REDISHOST=[YOUR REDIS HOST] \
-e REDISPASSWORD=[YOUR REDIS PASSWORD] \
-e MYSQLDATABASE=[YOUR REDIS DATABASE] \
-e MYSQLUSER=[YOUR MYSQL USER] \
-e MYSQLPASSWORD=[YOUR MYSQL PASSWORD] \
-e MYSQLHOST=[YOUR MYSQL HOST] \
-e MYSQLPORT=[YOUR MYSQL POST] \
-e JWT_SECRET=[YOUR JWT SWCRET] \
lictor
```

Provide detailed instructions on how to install the project on various platforms and environments.

### Running Locally

## Usage

Detailed instructions on how to use your project. Include code examples, screenshots or animated GIFs to demonstrate
functionality.

## Configuration

Explain any configuration options or environment variables required for the project.

## Contributing

Explain how interested developers can contribute to your project. Include:

- Guidelines for submitting pull requests
- Coding style and conventions
- Instructions for setting up the development environment

## License

Include the license for your project (e.g. MIT, GPL, etc.)

## Code of Conduct

Include a link to your project's Code of Conduct.

## Support

Provide information on how to get support or assistance with your project. Include:

- Contact information (email, social media, etc.)
- Bug reporting instructions
- Feature request instructions

## Donation

[Buy Me a Coffee](https://buymeacoffee.com/insentekrd)

## Acknowledgements

### Sponsor

### Contributor

[Contributors](https://github.com/insentek/lictor/graphs/contributors)