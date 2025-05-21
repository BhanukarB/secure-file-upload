# Secure File Upload API

## Overview

A **NestJS backend service** for securely uploading files by **authenticated users**. It features **JWT authentication**, **PostgreSQL** for persistence, **Redis with BullMQ** for background jobs, and **Multer** for file handling.

## Features

- JWT-based user authentication
- Secure file upload
- Background job processing (BullMQ + Redis)
- Modular, scalable architecture
- Dockerized Redis for local development

## Project Structure

```
src/
├── auth/      # Authentication logic (login, JWT, etc.)
├── users/     # User-related logic
├── files/     # File upload logic
├── jobs/      # BullMQ processors and queues
├── db/        # Database connection (Knex/Prisma)
├── main.ts    # Entry point
└── app.module.ts # Main application module
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/secure-file-upload.git
cd secure-file-upload
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Redis via Docker

```bash
docker run -d -p 6379:6379 --name redis redis
```

### 4. Set up environment variables

Create a `.env` file in the root directory:

```ini
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 5. Run database migrations (if using Prisma)

```bash
npx prisma migrate dev --name init
```

### 6. Start the NestJS server

```bash
npm run start:dev
```

### 7. Start the background processor (for BullMQ jobs)

```bash
npm run start:processor
```

---

## Authentication

### Login API

- **Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "jwt_token"
}
```

Use the returned `access_token` as a Bearer token in the `Authorization` header for other route.

---

## File Upload

### Upload File API

- **Endpoint:** `POST /files/upload`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body (form-data):**

- `file`: (File) The file to upload (field name must be `file`)
- `title`: (String, optional) Title of the file
- `description`: (String, optional) Description of the file

---

### Example using Postman

1. Set method to `POST`.
2. URL: `http://localhost:3000/files/upload`
3. Under **Authorization**, select **Bearer Token** and paste your token.
4. Under **Body**, select **form-data** and add:
   - `file`: (File) Upload any file
   - `title`: (Text, optional)
   - `description`: (Text, optional)
