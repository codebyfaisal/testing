# Portfolio System Manual

Welcome to your new Portfolio System. This manual will guide you through the installation, configuration, and usage of your new dynamic portfolio website and admin dashboard.

## 1. System Overview

The system consists of three main parts:

1.  **Server (Backend)**: The core API that handles database connections, authentication, and data management.
2.  **Admin (Dashboard)**: A secure control panel where you update content, manage projects, write blogs, and track job applications.
3.  **Client (Frontend)**: The public-facing portfolio website that visitors see.

---

## 2. Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed on your computer:

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Or a MongoDB Atlas connection string)
- A [Cloudinary](https://cloudinary.com/) account (For image/video hosting)

### Step 1: Install Dependencies

Open your terminal (Command Prompt/PowerShell) in the project root directory and run the following commands to install libraries for all services:

```bash
# Install Server dependencies
cd server
npm install

# Install Admin dependencies
cd ../admin
npm install

# Install Client dependencies
cd ../client
npm install
```

### Step 2: Configuration (.env files)

You need to create configuration files to tell the system how to connect to databases and services.

#### Server Configuration

Create a file named `.env` in the `server/` directory and add the following keys:

```ini
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<your_connection_string> # Your MongoDB URL

# Security (JWT Secrets - Generate random strings for these)
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary (Images/Videos)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=portfolio

# CORS (Allowed Domains) - For local development
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CLIENT_ALLOWED_ORIGINS=http://localhost:5174
ADMIN_ALLOWED_ORIGINS=http://localhost:5173
```

#### Admin Configuration

Create a file named `.env` in the `admin/` directory:

```ini
VITE_BASE_API_URL=http://localhost:4000/api/v1
VITE_CLIENT_URL=http://localhost:5174
```

#### Client Configuration

Create a file named `.env` in the `client/` directory:

```ini
VITE_API_URL=http://localhost:4000/api/v1
```

### Step 3: Running the Application

You need to run all three services simultaneously. You can do this by opening 3 separate terminal windows:

**Terminal 1 (Server):**

```bash
cd server
npm run dev
```

**Terminal 2 (Admin):**

```bash
cd admin
npm run dev
```

**Terminal 3 (Client):**

```bash
cd client
npm run dev
```

Once running:

- **Admin Dashboard**: [http://localhost:5173](http://localhost:5173) (or port shown in terminal)
- **Public Portfolio**: [http://localhost:5174](http://localhost:5174) (or port shown in terminal)

---

## 3. Using the Admin Dashboard

### First Login

Since there is no "Sign Up" page for public users, the first user must be created directly in the database or via a registration endpoint if enabled. _Contact developer/support if you need to reset the initial admin account._

### Features

- **Overview**: View stats on visitors, file usage, and recent activities.
- **Projects & Blogs**: Create, edit, and delete portfolio items and blog posts with a rich text editor.
- **Services & Plans**: Manage your service offerings and pricing packages.
- **Job Board**:
  - **Jobs**: Post new job openings with descriptions, requirements, and salary ranges.
  - **Applications**: View submitted applications, change statuses (Pending -> Reviewed -> Shortlisted), and download resumes.
  - **Forms**: Create standalone forms (e.g., "General Inquiry") that generate shareable links.
- **File Manager**: Upload and manage images/videos via Cloudinary. Uploaded files are available to select when creating content.
- **Configuration**:
  - Update SEO metadata (Title, Description).
  - Toggle "Maintenance Mode".
  - Update Resume/CV link globally.

### Copy Links

Throughout the dashboard (especially in Blogs, Jobs, and Forms), you will see **Copy Link** and **View Live** buttons.

- **Copy Link**: Copies the direct public URL to your clipboard.
- **View Live**: Opens the content in a new tab on the Client website.

---

## 4. Troubleshooting

**Q: The portfolio says "Server Error" or "Network Error".**
A: Ensure the **Server** terminal is running and shows "Connected to MongoDB". Check that `VITE_API_URL` in the client `.env` matches the port the server is running on (default 4000).

**Q: Images are not uploading.**
A: Check your Cloudinary credentials in the `server/.env` file. Ensure your cloud name, API key, and secret are correct.

**Q: Changes in Admin are not showing on the Client.**
A: Most changes are instant, but some browser caching may occur. Try refreshing the page. If deployment is static, a rebuild may be required.
