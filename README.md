# Job Application Tracker — Backend API

A REST API built with Node.js, Express, and PostgreSQL to manage job application records.

**Live API:** https://node-practice-production-0809.up.railway.app/api/applications

**Frontend:** https://job-tracker-react-beta.vercel.app/

## Features

- Retrieve all job applications
- Create new application records
- Update existing applications using partial updates
- Delete application records
- Validate incoming data and application IDs
- Use parameterized SQL queries
- Return appropriate HTTP status codes for successful requests and errors
- Automated API tests using Node.js and Supertest

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- `pg`
- `dotenv`
- Supertest
- Node.js built-in test runner

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Retrieve all applications |
| POST | `/api/applications` | Create an application |
| PATCH | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |

### Application fields

- `company` — company name
- `position` — job position
- `status` — application status: `Applied`, `Interview`, `Offer`, or `Rejected`

## Prerequisites

- Node.js and npm
- PostgreSQL

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Shazia757/node-practice.git
cd node-practice
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

Replace the database credentials with your local PostgreSQL settings. Never commit `.env` or publish real database credentials.

### 3. Create the database table

Connect to your local PostgreSQL database and run:

```sql
CREATE TABLE applications (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);
```

Run this only if the `applications` table does not already exist. If your existing table uses a different but compatible ID definition, keep the existing schema.

### 4. Start the server

```bash
npm start
```

The API should be available at:

`http://localhost:3000/api/applications`

### 5. Run automated tests

```bash
npm test
```

## Deployment

The backend is deployed on Railway and connects to a hosted PostgreSQL database.

Configure the following environment variables in the hosting platform:

- `PORT` — provided by the platform
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Use the database connection details from the hosted PostgreSQL service. Do not publish database credentials.

## Related Repository

[Job Application Tracker Frontend](https://github.com/Shazia757/job-tracker-react)

## Author

Shazia

[GitHub Profile](https://github.com/Shazia757)