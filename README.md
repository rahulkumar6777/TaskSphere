# TaskSphere — Full Stack Task Management App

A production-ready task management application with two-step OTP registration, JWT cookie-based authentication, AES encryption, and a clean dark UI.

---

## Live Demo & Repository

| | Link |
|---|---|
| 🔗 **Live URL** | `https://tasksphere.deployhub.online` |
| 🐙 **GitHub** | `https://github.com/rahulkumar6777/TaskSphere` |

---

## Project Structure

```
TaskSphere
├── backend
│   ├── src
│   │   ├── configs
│   │   │   └── db.connect.js                    # MongoDB connection
│   │   ├── controllers
│   │   │   ├── auth
│   │   │   │   ├── initRegister.controller.js   # Step 1 — send OTP to email
│   │   │   │   ├── verifyRegister.controller.js # Step 2 — verify OTP, create user
│   │   │   │   ├── Login.controller.js          # login, set cookies
│   │   │   │   ├── Logout.Controller.js         # clear cookies
│   │   │   │   ├── RefreshToken.Controller.js   # issue new accessToken cookie
│   │   │   │   └── me.controller.js             # return current user
│   │   │   ├── task
│   │   │   │   ├── createTask.controller.js     # POST /tasks
│   │   │   │   ├── getTasks.controller.js       # GET /tasks (paginated + filtered)
│   │   │   │   ├── getTask.controller.js        # GET /tasks/:id
│   │   │   │   ├── getStats.controller.js       # GET /tasks/stats
│   │   │   │   ├── updateTask.controller.js     # PUT /tasks/:id
│   │   │   │   ├── updateTaskStatus.controller.js # PATCH /tasks/:id/status
│   │   │   │   └── deleteTask.controller.js     # DELETE /tasks/:id
│   │   │   └── index.js                         # barrel export for all controllers
│   │   ├── middlewares
│   │   │   ├── Auth.js                          # JWT protect middleware
│   │   │   └── validation.js                    # express-validator rules
│   │   ├── models
│   │   │   ├── slices
│   │   │   │   ├── User.js                      # user schema (bcrypt pre-save)
│   │   │   │   ├── Task.js                      # task schema (compound indexes)
│   │   │   │   ├── tempUser.model.js            # temporary user during OTP verification
│   │   │   │   └── otpValidator.model.js        # OTP storage with TTL expiry
│   │   │   └── index.js                         # barrel export for all models
│   │   ├── routes
│   │   │   ├── auth.routes.js                   # /api/auth/* routes
│   │   │   └── task.routes.js                   # /api/tasks/* routes
│   │   └── utils
│   │       ├── emailTransporter.js              # nodemailer SMTP setup
│   │       ├── encryption.js                    # AES encrypt/decrypt via crypto-js
│   │       ├── frontendCors.js                  # CORS config
│   │       ├── GenerateAccessTokenAndRefreshToken.js  # JWT helpers + cookie setter
│   │       ├── option.js                        # cookie options (HttpOnly, Secure, SameSite)
│   │       └── rateLimit.js                     # express-rate-limit config
│   ├── index.js                                 # app setup (middlewares, routes)
│   ├── server.js                                # entry point, starts server
│   └── package.json
└── frontend
    ├── src
    │   ├── api
    │   │   └── apiclient.js                     # axios instances + 401 interceptors
    │   ├── components
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Sidebar.jsx / .module.css
    │   │   ├── StatsBar.jsx / .module.css
    │   │   ├── TaskCard.jsx / .module.css
    │   │   ├── TaskList.jsx / .module.css
    │   │   └── TaskModal.jsx / .module.css
    │   ├── context
    │   │   └── AuthContext.jsx                  # global auth state + silent refresh
    │   ├── hooks
    │   │   └── useTasks.js                      # task CRUD + stats hook
    │   ├── pages
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx                 # two-step OTP registration
    │   │   ├── DashboardPage.jsx
    │   │   └── AuthPages.module.css / DashboardPage.module.css
    │   ├── utils
    │   │   └── api.js                           # re-exports from apiclient
    │   ├── App.jsx                              # routes + protected/public guards
    │   ├── main.jsx                             # React root + BrowserRouter
    │   └── index.css                            # global CSS variables + animations
    ├── index.html
    └── vite.config.js
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT — access token + refresh token (HttpOnly cookies) |
| OTP | Nodemailer SMTP + TTL-based `otpValidator` model |
| Encryption | AES-256 via crypto-js |
| Security | Helmet, CORS, express-rate-limit, express-validator |
| Frontend | React 18, React Router v6, Vite |
| HTTP Client | Axios — two instances (`auth` + `tasks`) with interceptors |
| Styling | CSS Modules |

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Gmail account with App Password (for OTP emails)

---

### 1. Clone the repo

```bash
git clone https://github.com/rahulkumar6777/TaskSphere
cd tasksphere
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
node server.js
# API running at http://localhost:5000
```

**Required `.env` values:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasksphere

# JWT
ACCESS_TOKEN_SECRET=secretkey
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=refreshtokensecretkey
REFRESH_TOKEN_EXPIRY=7d

# AES Encryption
ENCRYPTION_KEY=exactly_32_characters_key_here!!

# Email OTP
EMAIL_PASS=pass
EMAIL_USER=hostuser
EMAIL_HOST=host

NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → generate for "Mail"

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# App running at http://localhost:5173
```

**Frontend `.env`:**

```env
VITE_API_URL=http://localhost:5000
```

---

## Authentication Flow

### Two-Step Registration

```
STEP 1 — POST /api/auth/register/init
──────────────────────────────────────────────
Request:  { name, email }

initRegister.controller.js:
  1. Checks email not already in User model
  2. Saves to tempUser model (expires in 10 min)
  3. Generates 6-digit OTP → saves to otpValidator model (TTL index)
  4. Sends OTP email via emailTransporter.js

Response: { success: true, message: "OTP sent to email" }

──────────────────────────────────────────────

STEP 2 — POST /api/auth/register/verify
──────────────────────────────────────────────
Request:  { name, email, otp, password }

verifyRegister.controller.js:
  1. Finds OTP from otpValidator model, checks TTL expiry
  2. Validates OTP matches
  3. Creates permanent User (password hashed by bcrypt pre-save hook)
  4. Deletes tempUser + OTP records
  5. Calls GenerateAccessTokenAndRefreshToken.js
  6. Sets accessToken + refreshToken as HttpOnly cookies via option.js

Response: { success: true, data: { user: { _id, name, email } } }
```

---

### Login

```
POST /api/auth/login
──────────────────────────────────────────────
Request: { email, password }

Login.controller.js:
  1. Finds user by email
  2. bcrypt.compare(password, user.password)
  3. GenerateAccessTokenAndRefreshToken() → sets HttpOnly cookies

Response: { success: true, data: { user: { _id, name, email } } }

No token is ever returned in the body or stored in JS memory.
Browser handles cookies automatically.
```

---

### Silent Token Refresh (Page Reload)

```
Page reloads → React state cleared → accessToken gone

AuthContext.jsx (useEffect on mount):
  → calls refreshAccessToken()
  → POST /api/auth/refresh/refreshtoken

RefreshToken.Controller.js:
  → reads refreshToken from cookie (browser sends it automatically)
  → verifies JWT
  → issues new accessToken cookie

  → fetchUser() → GET /api/auth/me → user state restored
  → isAuthReady = true → app renders

User stays logged in without re-entering credentials.
```

---

### Automatic Retry on 401

```
Any API call returns 401
  → apiclient.js response interceptor catches it
  → calls refreshAccessToken() once
  → success → retries original request automatically
  → fail    → logout() → navigate to /login

Multiple simultaneous 401s → queued, all resolved after one refresh
```

---

### Logout

```
POST /api/auth/logout

Logout.Controller.js:
  → clears accessToken cookie
  → clears refreshToken cookie

Frontend:
  → setUser(null)
  → navigate("/login")
```

---

## API Documentation

### Auth — `/api/auth`

#### `POST /api/auth/register/init`
**Request:**
```json
{ "name": "Rahul Kumar", "email": "rahul@example.com" }
```
**Response `200`:**
```json
{ "success": true, "message": "OTP sent to rahul@example.com" }
```
**Error `409`:** `{ "success": false, "message": "Email already registered" }`

---

#### `POST /api/auth/register/verify`
**Request:**
```json
{ "name": "Rahul Kumar", "email": "rahul@example.com", "otp": "482910", "password": "secret123" }
```
**Response `201`:**
```json
{ "success": true, "message": "Account created successfully", "data": { "user": { "_id": "...", "name": "Rahul Kumar", "email": "rahul@example.com" } } }
```
Sets `accessToken` + `refreshToken` as HttpOnly cookies.

**Error `400`:** `{ "success": false, "message": "Invalid or expired OTP" }`

---

#### `POST /api/auth/login`
**Request:**
```json
{ "email": "rahul@example.com", "password": "secret123" }
```
**Response `200`:**
```json
{ "success": true, "message": "Login successful", "data": { "user": { "_id": "...", "name": "Rahul Kumar", "email": "rahul@example.com" } } }
```
Sets `accessToken` + `refreshToken` as HttpOnly cookies.

**Error `401`:** `{ "success": false, "message": "Invalid email or password" }`

---

#### `POST /api/auth/refresh/refreshtoken`
No body — `refreshToken` cookie sent automatically.

**Response `200`:**
```json
{ "success": true, "message": "Token refreshed" }
```

---

#### `POST /api/auth/logout`
**Response `200`:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

#### `GET /api/auth/me`
Requires `accessToken` cookie.

**Response `200`:**
```json
{ "success": true, "data": { "user": { "_id": "...", "name": "Rahul Kumar", "email": "rahul@example.com" } } }
```

---

### Tasks — `/api/tasks`

All routes require `accessToken` cookie.

#### `GET /api/tasks`

| Query Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `limit` | int | 10 | Max 50 |
| `status` | string | all | `todo` `in-progress` `completed` `cancelled` |
| `priority` | string | all | `low` `medium` `high` |
| `search` | string | — | Search by title |
| `sortBy` | string | createdAt | `createdAt` `updatedAt` `dueDate` `priority` `title` |
| `sortOrder` | string | desc | `asc` or `desc` |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "title": "Implement login page",
        "description": "Build auth UI with validation",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2024-12-31T00:00:00.000Z",
        "tags": ["frontend", "auth"],
        "createdAt": "2024-03-14T10:30:00.000Z"
      }
    ],
    "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

> `description` is stored AES-encrypted in MongoDB, decrypted automatically before response.

---

#### `GET /api/tasks/stats`
**Response `200`:**
```json
{ "success": true, "data": { "stats": { "total": 12, "todo": 4, "in-progress": 3, "completed": 5, "cancelled": 0 } } }
```

---

#### `GET /api/tasks/:id`
**Response `200`:** `{ "success": true, "data": { "task": { ... } } }`
**Error `404`:** `{ "success": false, "message": "Task not found" }`

---

#### `POST /api/tasks`
**Request:**
```json
{ "title": "Implement login page", "description": "Build auth UI", "status": "todo", "priority": "high", "dueDate": "2024-12-31", "tags": ["frontend"] }
```
**Response `201`:** `{ "success": true, "message": "Task created", "data": { "task": { ... } } }`

---

#### `PUT /api/tasks/:id`
Same body as POST. **Response `200`:** `{ "success": true, "message": "Task updated", "data": { "task": { ... } } }`

---

#### `PATCH /api/tasks/:id/status`
**Request:** `{ "status": "completed" }`
**Response `200`:** `{ "success": true, "message": "Status updated", "data": { "task": { ... } } }`

---

#### `DELETE /api/tasks/:id`
**Response `200`:** `{ "success": true, "message": "Task deleted" }`
**Error `404`:** `{ "success": false, "message": "Task not found" }`

---

## Encryption — How It Works

```
CREATE / UPDATE — encryption.js encrypt()
────────────────────────────────────────────────
Frontend:  { "description": "Build auth UI" }    ← plain text
Backend:   encrypt("Build auth UI")
MongoDB:   { "description": "U2FsdGVkX1+mK9..." } ← AES ciphertext at rest

────────────────────────────────────────────────
READ — encryption.js decrypt()
────────────────────────────────────────────────
MongoDB:   { "description": "U2FsdGVkX1+mK9..." }
Backend:   decrypt("U2FsdGVkX1+mK9...")
Response:  { "description": "Build auth UI" }    ← plain text to frontend
```

`ENCRYPTION_KEY` lives only in `.env`. Database leak = descriptions still unreadable.

---

## Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt cost factor 12 (User.js pre-save hook) |
| Access token | JWT short-lived, HttpOnly cookie |
| Refresh token | JWT long-lived, HttpOnly cookie |
| Cookie config | `option.js` — HttpOnly + Secure (prod) + SameSite=Strict |
| AES encryption | `encryption.js` — descriptions encrypted at rest |
| OTP expiry | TTL index on `otpValidator.model.js` — auto-deleted |
| Security headers | Helmet.js |
| Rate limiting | `rateLimit.js` — global + stricter on auth routes |
| Input validation | `validation.js` — express-validator + .escape() |
| Authorization | All task queries scoped to `req.user._id` |
| CORS | `frontendCors.js` — only allows FRONTEND_URL |
| No hardcoded secrets | All in `.env`, `.env.example` provided |

---

## Error Response Format

```json
{ "success": false, "message": "Error description", "errors": [{ "field": "email", "message": "Valid email required" }] }
```

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Bad request (invalid/expired OTP) |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not found |
| `409` | Conflict (email exists) |
| `422` | Validation failed |
| `429` | Rate limit exceeded |
| `500` | Server error |

---

## Deployment

### Backend — Render
1. New Web Service → root: `backend/` → Start: `node server.js`
2. Add all env vars

### Frontend — Vercel
1. Root: `frontend/` → Add: `VITE_API_URL=https://your-backend.onrender.com`

### Database — MongoDB Atlas
Use Atlas URI as `MONGODB_URI`
