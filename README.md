# TrainTrack Backend

Welcome to the TrainTrack Backend repository! This Node.js Express application provides a set of RESTful endpoints for the TrainTrack app, allowing for efficient data management and retrieval.

## Features

- **Secure Authentication**: Utilizes JSON Web Tokens (JWT) for secure authentication and session management.
- **Swagger Documentation**: Comprehensive API documentation accessible via `/api-docs` endpoint.
- **Database Integration**: Configurable database connection for persistent data storage.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

## Setup Instruction

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```
git clone https://github.com/ExvalDev/TrainTrackBackend.git
cd TrainTrackBackend
```

### 2. Install Dependencies

```
npm install
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env` and modify it according to your environment settings:

```
cp .env.example .env
```

You will need to set up your database connection and JWT secrets as described below.

### 4. Generate DB Passwords & JWT Secrets

Generate secrets for the `MYSQL_ROOT_PASSWORD` and `DB_PASSWORD`:

```
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Add these passwords to your `.env` file.

---

Generate secrets for the `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add these secrets to your `.env` file.

### 5. Setup Database Connection

Configure your database connection by editing the `.env` file with your database settings.

## Running the Application

To run the application, you can use the following commands:

### Development Mode (using nodemon for hot reloads):

```
npm run dev
```

### **Production** Mode

First, compile the TypeScript code:

```
npm run build
```

Then, start the application:

```
npm start
```

### Production Mode (Docker)

```
docker compose -f docker-compose.yml up --build
```

## API Documentation

The Swagger API documentation is available at the `/api-docs` endpoint. Replace `APPLICATION_URL` with your actual application URL, for example, `http://localhost:8000/api-docs`.
