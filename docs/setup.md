# Backend Setup Guide

## Prerequisites

- Node.js (v18+)
- NPM (v9+) or Yarn
- MongoDB or PostgreSQL instance (depending on your database choice)
- Git

---

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/YourUsername/clinic-booking-backend.git
   cd clinic-booking-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # أو
   yarn install
   ```

3. **Configure environment variables**

   - Copy the example file:
     ```bash
     cp docs/env.example .env
     ```
   - Edit `.env` to match your environment.

4. **Run database migrations/seed (if required)**

   - (Add migration/seeding steps here if needed for your stack.)

5. **Start the application**

   ```bash
   npm run start
   # أو
   yarn start
   ```

6. **Access the API documentation**
   - By default, after running the app, open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view Swagger/OpenAPI docs.

---

## Other Notes

- Make sure your database is running and accessible before starting the backend.
- For production, update `NODE_ENV`, secrets, and all sensitive configs.
- See `docs/requirements-ar.md` and `docs/requirements-en.md` for detailed requirements and specs.
