# Transaction Widget Backend

A Node.js and TypeScript-based backend service for managing and fetching transaction data. It integrates with the Mobula API and a local database using TypeORM.

## Features

- RESTful API with Express.js.
- TypeScript for type safety.
- PostgreSQL database with TypeORM.
- Swagger documentation for API.
- Integration with Mobula API to fetch additional transaction data.
- Environment-based configuration.

## Prerequisites

- Node.js >= 16.x
- npm >= 7.x
- PostgreSQL >= 13.x

## Dependencies

An example .env file is included in the repository.

## Compilation
To run this application:
- git clone https://github.com/Dmomoh6/transactions-widget-backened.git
- cd transactions-widget-backened
- npm install
- Rename the .env.example file to .env and input the postgress db information, and mobula API key. SERVER_URL can be left blank
- npm start

  ## Live Demo
  https://transactions-widget-backened.onrender.com/

  ## Live API Docs
  https://transactions-widget-backened.onrender.com/api-docs/
