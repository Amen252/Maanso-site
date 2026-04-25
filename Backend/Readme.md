# Maanso Backend

A robust Node.js/Express REST API backend for the Maanso Somali Poetry Platform, enabling management and sharing of Somali poetry (Gabay).

## 🚀 Features

- **User Authentication** — Secure JWT-based authentication with role-based access control
- **Poetry Management** — Full CRUD operations for Gabay (Somali poetry)
- **User Management** — Admin capabilities for user administration
- **Role-Based Access** — Three user roles: Admin, Abwaan (Poet), and Viewer
- **Modular Architecture** — Scalable and maintainable code structure
- **MongoDB Integration** — Robust database with Mongoose ODM

## 🛠️ Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime environment   |
| Express.js | Web framework         |
| MongoDB    | Database              |
| Mongoose   | ODM                   |
| JWT (jose) | Authentication        |
| dotenv     | Environment variables |

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## ⚡ Installation

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maanso
JWT_SECRET=your_jwt_secret_key
```

## 📁 Project Structure

```
Backend/
└── src/
    ├── config/           # Configuration files
    │   ├── ability.js    # CASL abilities for authorization
    │   └── db.js         # Database connection
    ├── middleware/       # Express middleware
    │   └── auth.js       # JWT authentication middleware
    ├── modules/          # Feature modules
    │   ├── auth/         # Authentication module
    │   ├── Gabay/       # Poetry (Gabay) module
    │   └── users/       # User management module
    ├── utils/            # Utility functions
    │   ├── generateToken.js
    │   └── getJWTSecret.js
    └── server.js         # Application entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

| Role   | Description                         |
| ------ | ----------------------------------- |
| Admin  | Full access to all resources        |
| Abwaan | Can create, read, update own poetry |
| Viewer | Read-only access                    |

## 📚 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/auth/me`       | Get current user  |

### Users

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/api/users`     | List all users (Admin) |
| GET    | `/api/users/:id` | Get user by ID         |
| PUT    | `/api/users/:id` | Update user            |
| DELETE | `/api/users/:id` | Delete user (Admin)    |

### Gabay (Poetry)

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/gabay`     | List all poetry   |
| GET    | `/api/gabay/:id` | Get poetry by ID  |
| POST   | `/api/gabay`     | Create new poetry |
| PUT    | `/api/gabay/:id` | Update poetry     |
| DELETE | `/api/gabay/:id` | Delete poetry     |

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

## 📝 Core Concepts

- **Express.js REST API** — Standard RESTful endpoints
- **MongoDB with Mongoose** — Flexible schema-based data modeling
- **JWT Authentication** — Secure token-based auth using `jose` library
- **Role-Based Access Control** — CASL for authorization
- **Modular Structure** — Each feature in its own module

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for the Somali poetry community
