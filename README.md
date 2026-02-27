# Mess Management System - Backend

A RESTful API backend for managing mess/canteen operations built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- Role-based access control (Admin, Staff, Student)
- Subscription plan management (Daily, Weekly, Monthly)
- Daily attendance tracking for meals
- Inventory management across multiple categories
- Dashboard statistics and analytics
- Fee management and tracking

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## Project Structure

```
backend/
├── Controller/          # Route handlers
│   ├── authController.js
│   ├── userController.js
│   ├── planController.js
│   ├── userPlanController.js
│   ├── dailyentryController.js
│   ├── inventoryController.js
│   ├── menuController.js
│   └── statisticalController.js
├── Models/              # Mongoose schemas
│   ├── User.js
│   ├── Plan.js
│   ├── UserPlan.js
│   ├── DailyEntry.js
│   ├── Inventory.js
│   └── Menu.js
├── Routes/              # API routes
│   ├── authRoute.js
│   ├── userRoute.js
│   ├── planRoute.js
│   ├── userPlanRoutes.js
│   ├── dailyentryRoute.js
│   ├── inventoryRoutes.js
│   ├── menuRoutes.js
│   ├── statisticsRoute.js
│   └── feeRoute.js
├── config/              # Configuration files
│   ├── allowedOrigins.js
│   └── corsOptions.js
├── database/            # Database connection
│   └── db_connect.js
└── index.js             # Entry point
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Mess-Management-system-Backend.git
   cd Mess-Management-system-Backend/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**

   Create a `.env` file in the `backend` folder:
   ```env
   DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/mess
   PORT=3001
   AUTH_TOKEN=your_jwt_secret_key
   ```

4. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   node index.js
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| GET | `/auth/refresh` | Refresh JWT token |
| GET | `/auth/logout` | User logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/getusers` | Get all users |
| GET | `/users/getuser/:email` | Get user by email |
| POST | `/users/signup` | Register new user |
| PATCH | `/users/update/:id` | Update user |
| PATCH | `/users/resetpasswd` | Reset password |
| DELETE | `/users/delete/:email` | Delete user |

### Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/plan/getAllPlan` | Get all plans |
| GET | `/plan/getPlan/:plan_type` | Get plan by type |
| POST | `/plan/addPlan` | Create new plan |
| PATCH | `/plan/updatePlan` | Update plan |
| DELETE | `/plan/deletePlan` | Delete plan |

### User Plans (Subscriptions)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/userplan/getUserPlan` | Get all user plans |
| GET | `/userplan/getusercurrentplan/:userId` | Get user's current plan |
| GET | `/userplan/getusertodayplan/:userId` | Get user's today plan |
| GET | `/userplan/getTodayStudent/:type` | Get students for meal type |
| GET | `/userplan/getConsent/:obj` | Get user consent |
| POST | `/userplan/addUserPlan` | Create user plan |
| PATCH | `/userplan/updateUserPlan` | Update fee status |
| PATCH | `/userplan/updateConsent` | Update meal consent |

### Daily Entry (Attendance)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dailyentry/getuserentry/:userId` | Get user attendance |
| PATCH | `/dailyentry/updateentry` | Mark meal attendance |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory/getstore/:storeType` | Get items by store type |
| GET | `/inventory/getinventory/:inventoryId` | Get item by ID |
| POST | `/inventory/addinventory` | Add inventory item |
| PATCH | `/inventory/updateinventory/:inventoryId` | Update item |
| DELETE | `/inventory/deleteinventory/:inventoryId` | Delete item |

**Store Types:** `Vessels`, `Vegetables`, `Essentials`, `Liquid`, `Miscellaneous`

### Statistics (Dashboard)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats/getPlanCount` | Plan distribution data |
| GET | `/stats/getDayMember` | Daily attendance count |
| GET | `/stats/getWeekProfit` | Weekly revenue data |
| GET | `/stats/getMonthlyExpenses` | Monthly expenses by category |

## Data Models

### User
```javascript
{
  userId: Number,        // Auto-generated
  name: String,
  email: String,         // Unique
  mobileno: Number,      // 10 digits
  role: Number,          // 0: Student, 1: Staff, 2: Admin
  password: String,      // Hashed
  cpassword: String
}
```

### Plan
```javascript
{
  planId: Number,        // 501: Daily, 502: Weekly, 503: Monthly
  plan_type: String,     // "Daily" | "Weekly" | "Monthly"
  plan_desc: String,
  plan_price: Number
}
```

### UserPlan
```javascript
{
  userId: Number,
  planId: Number,
  start_date: Date,
  end_date: Date,
  fees: Number,
  fee_status: Boolean,
  isavailable: [{        // Meal consent per day
    date: Date,
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean
  }]
}
```

### Inventory
```javascript
{
  inventoryId: Number,
  name: String,
  storeType: String,     // Vessels | Vegetables | Essentials | Liquid | Miscellaneous
  date: Date,
  qty: Number,
  usedqty: Number,
  remainqty: Number,
  single_price: Number,
  sub_total: Number      // Auto-calculated
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE` | MongoDB connection string |
| `PORT` | Server port (default: 3001) |
| `AUTH_TOKEN` | JWT secret key |

## Scripts

```bash
npm run dev    # Start with nodemon (hot reload)
npm run build  # Install dependencies
npm test       # Run tests
```

## Error Handling

The API uses `express-async-handler` for async error handling. All errors return JSON responses:

```json
{
  "message": "Error description"
}
```

## CORS Configuration

Allowed origins can be configured in `config/allowedOrigins.js`.

## License

ISC
