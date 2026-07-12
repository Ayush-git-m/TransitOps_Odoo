# TransitOps - Smart Transport Operations Platform

TransitOps is a centralized, end-to-end transport operations platform designed to digitize vehicle management, driver allocation, dispatching, maintenance scheduling, and expense tracking. By automating core operations, the platform enforces critical business rules, eliminates spreadsheet dependency, and provides real-time operational visibility across departments.

---

https://transit-ops-odoo-mvnz.vercel.app/

## Target User Roles

* **Fleet Manager**: Oversees fleet assets, vehicle lifecycles, maintenance scheduling, and overall operational efficiency.
* **Driver**: Manages active trips, views assigned vehicles, and records delivery statuses.
* **Safety Officer**: Monitors driver compliance, license validity dates, and individual driver safety scores.
* **Financial Analyst**: Evaluates operational expenditures, fuel log efficiencies, maintenance costs, and vehicle profitability metrics.

---

## Core Features & Business Rules

### 1. Vehicle Registry

* Tracks master vehicle listings including Registration Number, Name/Model, Type, Maximum Load Capacity, Odometer, Acquisition Cost, and Status.
* Supported vehicle status metrics: Available, On Trip, In Shop, and Retired.
* Validates unique registration numbers across the registry database to prevent duplication.

### 2. Driver Management

* Maintains extensive profiles capturing Driver Name, License Number, Category, Expiry Date, Contact Information, and Safety Scores.
* Enforces automatic blockers that prevent the assignment of drivers with expired licenses or Suspended statuses to active trips.

### 3. Automated Trip Lifecycle

* Facilitates trip creation by mapping source, destination, available vehicle, available driver, cargo weight, and planned distance.
* Automatically blocks dispatches if the cargo weight exceeds the selected vehicle's maximum load capacity.
* Automatically orchestrates concurrent status transitions: Updates both vehicle and driver to "On Trip" upon dispatch, and restores them to "Available" immediately upon trip completion or cancellation.

### 4. Maintenance Workflow

* Integrates an isolated maintenance log tracking description details, operational costs, and downtime dates.
* Automatically switches a vehicle's status to "In Shop" when an active maintenance log is initiated, removing it instantly from the dispatch pool.
* Restores the vehicle status to "Available" automatically upon closing the active log (unless the vehicle has been marked as Retired).

### 5. Fuel & Expense Analytics

* Records transaction logs for fuel consumption (liters, cost) and general overhead expenses such as road tolls.
* Computes running totals for aggregate operational costs (Fuel + Maintenance) per asset.
* Feeds reporting formulas tracking fuel efficiency metrics and vehicle ROI levels.

---

## Tech Stack

* **Frontend**: React, Vite, JavaScript
* **Backend**: Node.js, Express.js
* **Database**: MySQL (TiDB Cloud Serverless)
* **Hosting**: Render (Backend), Vercel (Frontend)

---

## Project Directory Structure

backend/
├── src/
│   ├── config/          # Database configuration and connection pools
│   ├── controllers/     # HTTP request handlers mapping business endpoints
│   ├── services/        # Core transaction logic and business validation rules
│   ├── routes/          # Central API routing definitions
│   ├── middlewares/     # Authentication, RBAC validations, and error handlers
│   ├── validators/      # Payload structure validation schemas
│   └── utils/           # Shared API responders and structural helpers
├── .env                 # Environment variables configuration
├── package.json         # Project dependency definitions
└── README.md            # System documentation

---

## Database Schema Configuration

The database architecture leverages relational constraints to enforce operational integrity. Tables must be executed in the following order to establish foreign key linkages accurately:

1. Independent Core Entities: users, vehicles, drivers
2. Dependent Transactional Logs: trips, maintenance_logs, fuel_logs, expenses

---
