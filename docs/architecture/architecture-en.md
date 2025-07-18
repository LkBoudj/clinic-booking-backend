# System Architecture Documentation

## 1. High-Level System Architecture

The system follows a modular backend structure built with **Express.js (TypeScript)**. It includes:

- **API Layer**: Routes, Controllers
- **Business Logic Layer**: Services
- **Data Access Layer**: Mongoose ODM with MongoDB
- **Authentication Layer**: Passport.js with JWT Strategy
- **External Integrations**:
  - **Stripe API** for secure online payments
  - **WhatsApp Business API** for appointment notifications

## 2. Tech Stack

| Layer                 | Technology                       |
| --------------------- | -------------------------------- |
| Language              | TypeScript                       |
| Backend Framework     | Express.js                       |
| Database              | MongoDB with Mongoose            |
| Authentication        | Passport.js + JWT                |
| API Documentation     | Swagger (OpenAPI 3.0)            |
| Payment Integration   | Stripe API                       |
| Messaging Integration | WhatsApp API                     |
| Containerization      | Docker (optional in later phase) |

## 3. External Integrations

- **Stripe**:

  - Payment methods: Credit/Debit cards
  - Webhook integration for payment status

- **WhatsApp Business API**:
  - Confirm appointments
  - Reminders before appointment time

## 4. Diagrams

Will include:

- System Component Diagram
- Request-Response Flow for Appointment Booking
- Authentication Sequence Diagram

## 5. Notes

- The system is built with scalability and separation of concerns in mind.
- Each module will be tested and documented independently.
