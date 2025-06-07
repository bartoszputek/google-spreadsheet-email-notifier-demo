# Google Spreadsheet Email Notifier Demo

Sends email notifications when defined values are filled in a Google Spreadsheet.

## Table of contents

- [General info](#general-info)
- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Unit and integration tests](#unit-and-integration-tests)
- [License](#license)

## General info

Google Spreadsheet Email Notifier Demo is a Node.js application that monitors a Google Spreadsheet for updates about certain cell values and sends email notifications accordingly. The project is designed for easy deployment, testing, and development.

## Architecture

The application consists of the following components:

- Node.js lambda function written in JavaScript (located in `src/`)
- Integration with Google Sheets API for data retrieval
- Email notification system
- AWS S3 integration for data storage
- Infrastructure as code using Terraform (in `infra/`)

## Features

- Automated email notifications based on Google Spreadsheet updates (sync every hour, but adjustable depending on your needs)
- Integration with AWS S3 for data storage to prevent sending redundant emails

## Installation

To install the application, you should have Node.js (v22 or higher), pnpm and terraform installed.

Next, follow these commands:

```bash
pnpm install
```

Create `.env` file and fill in the environments variables as needed (see `.env-example`).

Adjust values related to the spreadsheet in the `index.js` file according to your needs:

```js
spreadsheetId: "your-spreadsheet-id", // Replace with your actual spreadsheet ID
startingCell: "A3", // Replace with your cell
endingCell: "M23", // Replace with your ending cell
```

Authenticate to your AWS account, I use `aws-vault`.

Deploy the infrastructure:
⚠️ It will create the real infrastructure on AWS ⚠️

```bash
cd infra && terraform init
pnpm build:infra
pnpm deploy:infra
```

Test the lambda handler using:

```bash
pnpm test:infra
```

## Unit and integration tests

To run unit tests run:

```bash
pnpm test:unit
```

To run integration tests run (Docker is required):

⚠️ The integration tests will do requests to the real infrastructure on AWS (SES/S3) ⚠️

```bash
pnpm test:integration
```

## License

You can check out the full license [here](./LICENSE).

This project is licensed under the terms of **the MIT license**.
