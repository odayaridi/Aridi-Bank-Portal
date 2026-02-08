# Aridi Bank Portal

A modern, secure, and scalable full-stack banking management system designed to serve both bank administrators and customers. This application facilitates digital management of users, bank accounts, debit cards, and transactions with secure authentication and real-time updates.

---

## 🎯 Overview

Aridi Bank Portal is a comprehensive banking solution that simulates real-world online banking applications. The system provides:

- **For Administrators**: Complete user management, account creation, debit card management, and transaction oversight
- **For Customers**: Account overview, transaction history, debit card management, and secure communication channels

**Main Significance**: As banking becomes increasingly digital, this project demonstrates modern design patterns, security best practices, and scalable architecture for financial applications.

---

## ✨ Key Features

### User Management
- Secure authentication using JWT tokens
- Role-based access control (Admin/User)
- Profile management and updates
- Password reset via email (SMTP integration)
- Google OAuth integration

### Account Operations
- Multiple account types (Savings, Checking)
- Real-time balance tracking
- Account creation and management
- Unique account number generation

### Transactions
- Secure money transfers between accounts
- Transaction history and filtering
- Automated fee calculation
- Real-time balance updates

### Debit Cards
- Card issuance and management
- Expiration date tracking
- Card status monitoring (Active/Expired)

### Communication
- Contact form for user support
- Message management system for administrators

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** (with Vite) | Fast, modern SPA framework for building interactive UIs |
| **Material UI** | Pre-designed component library for consistent design |
| **Redux** | State management for predictable application state |
| **Axios** | HTTP client for API communication |
| **date-fns** | Modern date utility library |

### Backend
| Technology | Purpose |
|------------|---------|
| **NestJS** | Scalable Node.js framework with TypeScript |
| **TypeORM** | Object-Relational Mapping for database operations |
| **GraphQL** | Efficient API query language for flexible data fetching |
| **PostgreSQL** | Robust relational database system |
| **JWT** | Secure token-based authentication |
| **bcrypt** | Password hashing and verification |
| **Passport.js** | Authentication middleware (JWT & Google OAuth) |
| **Nodemailer** | SMTP email service for notifications |
| **cookie-parser** | Cookie handling for secure token storage |
| **GROQ API** | AI integration for enhanced features |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Postman** | API testing and documentation |
| **TypeScript** | Type-safe development |
| **class-validator** | DTO validation |
| **class-transformer** | Data transformation |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v21 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **pgAdmin** (optional, for database management)
- **Git** (for version control)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/odayaridi/aridi-bank-portal.git
cd aridi-bank-portal
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following configuration:

```env
# =====================================================
# JWT Configuration
# =====================================================
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=3h

# =====================================================
# Database Configuration
# =====================================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=web_bank_database

# =====================================================
# Application Configuration
# =====================================================
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# =====================================================
# Google OAuth Configuration
# =====================================================
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# =====================================================
# SMTP Email Configuration
# =====================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# =====================================================
# AI Integration (Optional)
# =====================================================
GROQ_API_KEY=your_groq_api_key_here
```

> **Security Note**: 
> - Change the `JWT_SECRET` to a secure random string in production
> - Never commit your `.env` file to version control
> - Use app-specific passwords for Gmail SMTP
> - Keep all API keys and secrets confidential

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```
---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

The backend will start on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 📚 API Documentation

### Authentication Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | Any | Authenticate user with username/password |
| `/auth/logout` | POST | Any | Clear JWT cookie and logout |
| `/auth/me` | GET | Any | Get current user from JWT token |
| `/auth/forgot-password` | POST | Any | Send password reset email |
| `/auth/reset-password` | POST | Any | Reset password with token |
| `/auth/google` | GET | Any | Initiate Google OAuth login |
| `/auth/google/callback` | GET | Any | Google OAuth callback handler |

### User Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/users/create` | POST | Admin | Create new user with default role |
| `/users/update` | PUT | Admin | Update user details |
| `/users/delete/:username` | DELETE | Admin | Delete user by username |
| `/users/profile` | GET | User | Get logged-in user profile |
| `/users/getFilteredUsers` | GET | Admin | Get paginated/filtered user list |

### Account Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/createUserAccount` | POST | Admin | Create new account for user |
| `/generateAccountNumber` | GET | Admin | Generate unique account number |
| `/depositMoney` | PUT | Admin | Deposit money to account |
| `/withdrawMoney` | PUT | Admin | Withdraw money from account |
| `/getCheckingAccountsNbs` | GET | User | Get user's checking accounts |
| `/getAllAccountsNbs` | GET | User | Get all user accounts |
| `/getAccountInfo/:accountNb` | GET | User/Admin | Get account details |

### Transaction Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/transactions/create` | POST | User | Create transaction with fee calculation |
| `/transactions/getUserTransactions` | GET | User | Get all user transactions |
| `/transactions/getRecentUserTrans` | GET | User | Get 5 most recent transactions |

### Debit Card Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/debit-card/createDebitCard` | POST | Admin | Create new debit card |
| `/debit-card/updateDebitCard` | PUT | Admin | Update card expiration date |
| `/debit-card/deleteDebitCard` | DELETE | Admin | Delete user's debit card |
| `/debit-card/getUserDebitCards` | GET | User | Get all user debit cards |

### Contact Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/contact-us/sendMess` | POST | User | Send message to support |
| `/contact-us/messages` | GET | Admin | Get all messages with filters |

### Other Extra Endpoints

---

## 🧪 Testing
### API Testing with Postman

1. Import the Postman collection from `documentation/postman-collection.json`
2. Set environment variables for base URL
3. Test all endpoints systematically

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with HttpOnly cookies
- **Google OAuth**: Social login integration for enhanced user experience
- **Password Hashing**: bcrypt encryption for all passwords
- **Role-Based Access Control**: Admin and User roles with protected routes
- **Input Validation**: class-validator for DTO validation
- **SQL Injection Protection**: TypeORM parameterized queries
- **CORS Configuration**: Restricted cross-origin requests
- **Environment Variables**: Sensitive data stored securely
- **Email Verification**: SMTP integration for password reset functionality

---

## Some Images
<img width="1917" height="967" alt="image" src="https://github.com/user-attachments/assets/9611f816-3b2d-44ba-9cf6-463ca67ab345" />
Admin Images
<img width="1918" height="970" alt="image" src="https://github.com/user-attachments/assets/3d3b2e46-7a04-4c74-914c-4a5f3eb786bc" />
<img width="1918" height="967" alt="image" src="https://github.com/user-attachments/assets/0a529426-07f5-41e8-b574-16ada4bc32ee" />
<img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/9104ecc6-814d-48bf-9459-e51aba761ddf" />
<img width="1917" height="920" alt="image" src="https://github.com/user-attachments/assets/18ad5f04-3056-4d78-97b4-3c4c315fce51" />
User Images
<img width="1917" height="910" alt="image" src="https://github.com/user-attachments/assets/b6e5ded8-6755-4d82-ad71-28d77a72f41f" />
<img width="1918" height="913" alt="image" src="https://github.com/user-attachments/assets/d8ac0d54-79fa-477b-9371-7d0259feb589" />
<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/05f87108-7080-47b4-92eb-259e455c637a" />


