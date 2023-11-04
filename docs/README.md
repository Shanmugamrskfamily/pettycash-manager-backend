# Pettycash Manager Backend Documentation

## Description

The Pettycash Manager backend system supports user management, expense transactions, capital management, and email functionality. It provides APIs for user-related operations, expense management, and capital handling.

### Purpose

The purpose is to facilitate the backend operations for the Pettycash Manager web application. This includes user management with a password reset flow, user profile update flow, transaction management with CRUD operations, and generating transactions into PDF documents.

## Deployment

The Pettycash Manager backend is deployed on Render URL: https://pettycash-manager-fullstack.onrender.com

## API Documentation

The API documentation is published using Postman: https://documenter.getpostman.com/view/28858691/2s9YXe8Pvx

## API Endpoints

### User Management

- `POST /api/signup`: Register a new user.
- `POST /api/verifyEmail`: Verify user email.
- `POST /api/login`: User authentication.
- `POST /api/sendPasswordResetLink`: Send an email with an OTP for password reset.
- `POST /api/resetPassword`: Set a new password after OTP verification.
- `GET /api/avatars`: Retrieve all available avatars.
- `GET /api/user/:userId`: Get user information by ID.
- `POST /api/sendOTP/:userId`: Send an OTP for profile update.
- `PUT /api/editUser`: Edit user profile after OTP verification.

### Capital Management

- `POST /api/capital/add`: Add or update the user's capital amount.
- `GET /api/capital/:userId`: Get the current capital amount by user ID.
- `PUT /api/capital/edit`: Update the capital amount for a user.

### Expense Management

- `POST /api/expenses/add`: Add a new expense transaction.
- `GET /api/expenses/all/:userId`: Get all expense transactions by user ID.
- `GET /api/expenses/details/:userId/:expenseId`: Get details of a specific expense transaction.
- `GET /api/expenses/totalPriceAndDate/:userId`: Get expenses with total price and date by user ID.
- `GET /api/expenses/total/:userId`: Get the total count of expense transactions by user ID.
- `GET /api/expenses/cumulativeTotal/:userId`: Calculate the cumulative total of all expenses for a specific user.
- `PUT /api/expenses/edit`: Update an existing expense transaction.
- `DELETE /api/expenses/delete/:userId/:transactionId`: Delete a specific expense transaction.

## Database Schema

### User Model

- **name**: String
- **mobileNumber**: String
- **avatar**: String
- **email**: String
- **password**: String
- **emailVerificationToken**: String
- **emailVerified**: Boolean
- **resetPasswordToken**: String
- **resetPasswordExpires**: Date
- **jwtToken**: String

### Avatar Model

- **name**: String
- **link**: String

### Expenses Model

- **userId**: ObjectId
- **title**: String
- **category**: String
- **date**: Date
- **price**: Number
- **quantity**: Number
- **description**: String
- **totalPrice**: Number

### Capital Model

- **userId**: ObjectId
- **amount**: Number

## Instructions

- **Running the Server**:
  - Run the `server.js` file using Node to start the server.
- **Environment Variables**:
  - Ensure to set the required environment variables for email configuration and MongoDB URI.
