# SmartBiz360 - The AI-Powered Operating System for Small Business

![SmartBiz360 Logo](public/logo.svg)

**SmartBiz360** is a comprehensive, AI-driven platform designed to be the central nervous system for small businesses. It automates daily workflows, provides intelligent insights, and enhances security, allowing owners to focus on growth instead of repetitive administrative tasks.

This repository contains the complete source code for the SmartBiz360 ecosystem, including the Node.js backend, the Flutter mobile app, and the React web dashboard.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Backend Setup](#backend-setup)
  - [Flutter App Setup](#flutter-app-setup)
- [AI Agent & Core Algorithms](#ai-agent--core-algorithms)
  - [How the AI Agent Works](#how-the-ai-agent-works)
  - [Credit Memory AI](#credit-memory-ai)
  - [Behavioral Password Authentication](#behavioral-password-authentication)
  - [CyberGuardian Safety Limitations](#cyberguardian-safety-limitations)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Demo](#demo)

---

## Project Overview

Small business owners are often overwhelmed by a mountain of operational tasks: managing orders, tracking payments, staying compliant, handling logistics, and ensuring digital security. SmartBiz360 replaces this chaotic, multi-tool reality with a single, intelligent platform. It acts as an AI agent that understands the business's context and proactively assists in its management.

## Core Features

-   **Multi-User Business Workflow**: Role-based access for Owners, Employees, Delivery Personnel, and Accountants, ensuring everyone sees only what they need.
-   **Smart Order Manager**: Create orders via text or voice, view real-time order status updates pushed via WebSockets, and manage the entire order lifecycle.
-   **Smart Credit Memory AI**: An original algorithm that analyzes customer payment behavior, calculates a dynamic credit/risk score, and predicts future repayment dates to minimize financial risk.
-   **Rental Property Manager**: Manage properties and tenants, track pending rent, send automated reminders, and view a dashboard of rental income.
-   **Delivery OTP System**: Securely confirm deliveries by generating a unique OTP sent to the customer, which is then verified by the delivery person.
-   **Compliance & Vehicle Hub**: Centralized, automated reminders for crucial deadlines like GST filings, loan EMIs, vehicle insurance, PUC, and license renewals.
-   **Tally ERP Integration**: Endpoints for seamless, automated synchronization of invoice data and generation of e-way bills.
-   **AI CyberGuardian**: A defensive security scanner that analyzes the business's network for vulnerabilities based on user-provided descriptions and authorized scans.
-   **Behavioral Password Authentication**: A futuristic, passwordless security mechanism where the AI verifies the owner's identity through a series of personal, multiple-choice questions.

## Tech Stack

| Category        | Technology                                                |
| --------------- | --------------------------------------------------------- |
| **Backend**     | Node.js, Express, TypeScript, WebSocket (ws), node-cron   |
| **Database**    | PostgreSQL                                                |
| **Mobile App**  | Flutter, Provider/Riverpod, http, flutter_secure_storage  |
| **Web App**     | React, TypeScript, Tailwind CSS, Recharts                 |
| **AI Engine**   | Google Gemini API (`@google/genai`)                       |
| **Auth**        | JWT (Access + Refresh Tokens), bcrypt, AES-256-GCM        |
| **Deployment**  | Docker, Docker Compose                                    |

## System Architecture

The system is designed with a service-oriented architecture. The Node.js backend serves as the core API and AI agent brain, which connects to the database and external services. The Flutter and React applications are clients that consume this API.

```ascii
+------------------------+        +------------------------+
|   Flutter Mobile App   |        |     React Web App      |
| (Provider, SecureStorage)|      |   (Context, Recharts)  |
+------------------------+        +------------------------+
           |                                  |
           | (HTTPS/WSS)                      | (HTTPS/WSS)
           |                                  |
+-----------------------------------------------------------+
|                  Node.js Backend (Express)                |
|                                                           |
| +----------------+ +-----------------+ +----------------+ |
| |  Auth Service  | |  Order Service  | |   AI Agent     | |
| |   (JWT)        | |   (WebSocket)   | |   (Gemini)     | |
| +----------------+ +-----------------+ +----------------+ |
|                                                           |
| +----------------+ +-----------------+ +----------------+ |
| | Cron Schedulers| |   CyberGuardian | |  Other Modules | |
| | (Reminders)    | |   (Nmap/Shodan) | |                | |
| +----------------+ +-----------------+ +----------------+ |
+-----------------------------------------------------------+
           |                          |               |
           | (SQL)                    | (API)         | (API)
           |                          |               |
+---------------------+   +---------------------+   +----------------+
|  PostgreSQL Database|   |  Google Gemini API  |   | 3rd Party APIs |
| (Business Data)     |   | (AI Logic)          |   | (WhatsApp,Tally)|
+---------------------+   +---------------------+   +----------------+
```

## Folder Structure

The project is organized into a monorepo structure for clarity.

```
smartbiz360/
├── backend/
│   ├── src/
│   │   ├── api/          # Routes (v1, v2...)
│   │   ├── config/       # Environment, Database config
│   │   ├── controllers/  # Request/Response handlers
│   │   ├── middleware/   # Auth, error handling
│   │   ├── models/       # Database schemas/models
│   │   ├── services/     # Business logic, tool definitions
│   │   ├── jobs/         # Cron job definitions
│   │   └── utils/        # Helpers, encryption
│   ├── Dockerfile
│   └── package.json
├── frontend-flutter/
│   ├── lib/
│   │   ├── models/       # Data models
│   │   ├── providers/    # State management
│   │   ├── screens/      # UI screens
│   │   ├── services/     # API service calls
│   │   ├── widgets/      # Reusable UI widgets
│   │   └── main.dart
│   ├── pubspec.yaml
│   └── ...
├── frontend-web/
│   ├── src/              # (Existing React app structure)
│   └── ...
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

-   Node.js (v18+) & npm
-   Flutter SDK (v3.+) & Dart
-   Docker & Docker Compose
-   PostgreSQL client

### Environment Configuration

Create a `.env` file in the `backend/` directory. This file stores all necessary secrets and configuration variables.

```env
# backend/.env

# Server
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smartbiz360"

# Authentication
JWT_SECRET="your_strong_jwt_secret_key"
JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_key"
ENCRYPTION_KEY="a_32_byte_secret_key_for_aes_encryption"

# AI Engine
GEMINI_API_KEY="your_google_gemini_api_key"

# External APIs
WHATSAPP_API_TOKEN="placeholder_token"
SHODAN_API_KEY="your_shodan_api_key"
```

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run database migrations (schema setup)
# (Assuming a migration tool like 'node-pg-migrate' is set up)
npm run migrate up

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:3000`.

### Flutter App Setup

```bash
# Navigate to the Flutter app directory
cd frontend-flutter

# Get dependencies
flutter pub get

# Run the app on a connected device or emulator
flutter run
```

## AI Agent & Core Algorithms

### How the AI Agent Works

The SmartBiz360 backend is designed as an "AI Agent." Instead of traditional REST endpoints that map directly to database operations, the system uses a tool-based approach.

1.  **User Intent**: A request from the frontend (e.g., "Add an order for John Doe, $50, on credit") is sent to a primary endpoint.
2.  **AI Thought Process**: The agent, powered by Gemini, analyzes the request. It thinks step-by-step: "The user wants to create an order. The customer is 'John Doe'. The amount is 50. The payment is 'credit'."
3.  **Tool Selection**: Based on its analysis, the agent decides which internal function, or "tool," to call. In this case, it would be the `createOrder` tool.
4.  **Execution**: The backend executes the `createOrder` service, which handles the business logic of creating the order, updating customer credit, etc.
5.  **Response**: The agent returns a structured response to the frontend.

This makes the system more flexible and capable of handling complex, natural language commands in the future.

### Credit Memory AI

This is a predictive algorithm to manage credit risk.
-   **Data Collection**: The system stores a history of every credit transaction for a customer, noting the due date and the actual payment date.
-   **AI Analysis**: When an analysis is requested, this history is sent to the Gemini API with a specific prompt. The prompt asks the AI to act as a financial analyst, evaluate the payment patterns (e.g., consistency, delays), and generate a risk score from 0-100.
-   **Prediction**: The AI is also tasked with predicting the next likely repayment date based on historical behavior. If a customer consistently pays 5 days late, the AI will predict a date 5 days after the next due date.
-   **Decision Making**: Business owners can use this score and prediction to decide whether to extend further credit.

### Behavioral Password Authentication

This module eliminates traditional passwords for the owner, replacing them with a cognitive verification process.
-   **Setup**:
    1.  The owner provides a personal, subjective topic (e.g., "My favorite childhood vacation").
    2.  The Gemini API generates 4-5 unique multiple-choice questions based on this topic, with plausible but incorrect distractors.
    3.  The owner answers these questions once. The selected answers (e.g., indices `[2, 0, 3, 1]`) are hashed with bcrypt and then encrypted using AES-256-GCM before being stored in the database. The questions themselves are also stored.
-   **Verification**:
    1.  When authentication is required, the system retrieves the stored questions for the owner.
    2.  The owner is presented with the same questions and options in a randomized order.
    3.  The owner's new answers are sent to the backend.
    4.  The backend hashes the submitted answers and compares the hash to the stored, encrypted hash.
    5.  If they match, access is granted.

### CyberGuardian Safety Limitations

**This tool is designed for defensive purposes ONLY.**
-   **Consent is Mandatory**: CyberGuardian must only be used on networks and devices that the business owner has explicit, legal ownership of and authority to scan.
-   **No Hacking**: The tool does not perform offensive attacks. It uses industry-standard, authorized tools for information gathering:
    -   **Nmap**: Used for local network scans initiated by the user to identify open ports and services on their own devices.
    -   **Shodan API**: Used to query public Shodan data about the business's own public-facing IP addresses to check for known vulnerabilities or misconfigurations visible on the internet.
-   **AI-driven Analysis**: The primary function is to feed the scan results and user-provided descriptions into the Gemini API, which then interprets the data and provides easy-to-understand security recommendations. It does not exploit vulnerabilities.

## API Documentation

Our API is fully documented for developers. You can find the complete collection here:
-   **[Link to Postman Collection / Swagger Docs] (coming soon)**

## Screenshots

*(Placeholders for screenshots of the application)*

| Login Screen                                | Owner Dashboard                           | Credit Manager                          |
| ------------------------------------------- | ----------------------------------------- | --------------------------------------- |
| ![Login Screen](placeholder_link_to_img)    | ![Dashboard](placeholder_link_to_img)     | ![Credit Manager](placeholder_link_to_img)|

## Demo

Watch a full video walkthrough of SmartBiz360's features:
-   **[Link to YouTube / Loom Demo] (coming soon)**
