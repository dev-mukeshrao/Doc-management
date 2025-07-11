# 🗂️ Doc Management Monorepo

This is a **NestJS-based monorepo** that manages a modular document management system built using **Microservices Architecture**.

It contains the following services:

- 🧑 `user-service` – Handles user registration, login, and authentication
- 📄 `document-service` – Handles CRUD operations on uploaded documents
- 📥 `ingestion-service` – Manages the ingestion pipeline (e.g., file parsing)

---

## 📦 Technologies Used

- [NestJS](https://nestjs.com/) – Backend Framework
- [JWT](https://jwt.io/) – For authentication
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- GitHub Projects *(planned for cross-repo/project planning)*

---

## 📁 Monorepo Structure
Doc-management/
├── services/
│ ├── user-service/
│ ├── document-service/
  └── ingestion-service/

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js >= 18.x
- npm or yarn
- MongoDB or other backend DB
- Git

---

## ⚙️ How to Run Each Service

> Each service runs independently. Use Postman or frontend to call APIs.

### 1️⃣ User Service

cd services/user-service
npm install
npm run start:dev
APIs:

POST /auth/signup

POST /auth/login

Protected routes use Authorization: Bearer <token>

### 2️⃣ Document Service

cd services/document-service
npm install
npm run start:dev
APIs:
APIs:

POST /documents – Add a document
3️⃣ Ingestion Service
bash
Copy
Edit
cd services/ingestion-service
npm install
npm run start:dev

Parses document metadata

Invoked internally or via exposed API
GET /documents – List all

DELETE /documents/:id – Delete

