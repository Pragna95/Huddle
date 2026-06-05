# Huddle Multi-App and Shared Microservice System

This system comprises two separate user-facing client applications (`app1` and `app2`) and a shared `microservices` Django backend containing the core business logic.

API Key-based authentication is used to authenticate applications communicating with the shared `microservices` container.

---

## Directory Structure

```text
c:\Users\Ranga\Desktop\GADigitalSolutions
├── app1/
│   ├── backend1/        # Django App running on Port 8001
│   └── frontend1/       # React (Vite) App running on Port 3000
├── app2/
│   ├── backend2/        # Django App running on Port 8002
│   └── frontend2/       # React (Vite) App running on Port 3001
└── microservices/       # Shared Django service running on Port 8000
```

---

## Command Reference (Run in 5 Separate Terminals)

### Terminal 1: Shared Microservices Backend
```bash
cd microservices
.\venv\Scripts\python.exe manage.py runserver 8000
```

### Terminal 2: App 1 Backend
```bash
cd app1/backend1
python manage.py runserver 8001
```

### Terminal 3: App 2 Backend
```bash
cd app2/backend2
python manage.py runserver 8002
```

### Terminal 4: App 1 Frontend
```bash
cd app1/frontend1
npm start
```

### Terminal 5: App 2 Frontend
```bash
cd app2/frontend2
PORT=3001 npm start
```

---

## Initial Database Setup & API Key Generation

Before launching, ensure migrations have been applied and default API Keys are written to the databases.

### Backend 1:
```bash
cd app1/backend1
python manage.py migrate
python manage.py create_api_keys
```

### Backend 2:
```bash
cd app2/backend2
python manage.py migrate
python manage.py create_api_keys
```

### Microservices:
```bash
cd microservices
.\venv\Scripts\python.exe manage.py migrate
```

---

## Step-by-Step Test Walkthrough

### 1. Signup / Login on Frontend 1
1. Open your browser and navigate to `http://localhost:3000/signup`.
2. Register a new user account (e.g. `user1@example.com` / `password123`).
3. You will be redirected to the login page at `http://localhost:3000/login`.
4. Log in using `user1@example.com`.
5. Upon successful authentication, Backend 1 (port 8001) fetches/creates the API key (`app1_sk_...`) and returns it along with user details. The React client saves the key and user ID into `localStorage`.
6. You will be redirected to the main dashboard.

### 2. Signup / Login on Frontend 2
1. Open another browser tab at `http://localhost:3001/signup`.
2. Register a new user (e.g. `user2@example.com` / `password123`).
3. Log in at `http://localhost:3001/login`.
4. Backend 2 (port 8002) returns the API key (`app2_sk_...`). The client stores it and user details in `localStorage`.

### 3. Create Data from Frontend 2
1. On Frontend 2 dashboard, open the "Schedule Advanced Session" dialog.
2. Fill out the details (Title: "App 2 Sprint Demo", Attendees, etc.) and click **Schedule**.
3. Frontend 2 will make a `POST` request to the shared `microservices` container on `http://localhost:8000/schedule-meeting/`.
4. The request is intercepted by Axios to append `X-API-Key: app2_sk_...` in the headers and `user_id` inside the request body.
5. The `microservices` container validates the key against `settings.VALID_API_KEYS`, associates it with a system profile, trusts the request body for the user identifier, and processes the schedule.

### 4. Verify Shared State / Actions
1. Open the Django Admin interface at `http://localhost:8000/admin/login/`.
2. Log in using the superuser credentials:
   - **Username:** `admin`
   - **Password:** `adminpassword`
3. Verify that only superusers can access Django Admin (rendering the custom Huddle login template).
4. Verify that data transactions made by the client applications are recorded in the central database.
