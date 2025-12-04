# 🚗 Car Doctor Server

A Node.js + Express backend API for managing car repair services and
customer orders. Built with JWT authentication, MongoDB integration, and
secure cookie-based login.

## 🔥 Features

-   User Authentication using JWT & HTTP-only cookies
-   Protected Routes with middleware-based token verification
-   Service Management --- fetch all services or details by ID
-   Order Management --- create, fetch, update, and delete customer
    orders
-   Users can only view their own orders
-   MongoDB Atlas Integration
-   CORS Enabled with credentials

## 🛠️ Tech Stack

-   Node.js, Express.js
-   MongoDB Atlas
-   JWT Authentication
-   Cookie-Parser
-   CORS
-   Dotenv

## 📁 Folder Structure

    project/
    │
    ├── index.js
    ├── .env
    ├── package.json
    └── README.md

## ⚙️ Environment Variables

Create a `.env` file:

    PORT=3000
    MONGODB_USERNAME=your_username
    MONGODB_PASS=your_password
    MONGODB_CLUSTER=your_cluster_name
    ACCESS_TOKEN_SECRET=your_jwt_secret

## 🚀 Installation & Setup

### Clone the repository

    git clone https://github.com/your-username/car-doctor-server.git
    cd car-doctor-server

### Install dependencies

    npm install

### Run the server

    npm start

## 📡 API Endpoints

### Auth

-   POST /login --- Login user
-   POST /logout --- Clear JWT cookie

### Services

-   GET /services --- Get all services
-   GET /services/:id --- Get service by ID

### Orders

-   POST /orders --- Create new order
-   GET /my-orders?email= --- Get user orders (protected)
-   PATCH /my-orders/:id --- Update order status
-   DELETE /my-orders/:id --- Delete an order

## 🔒 Security Notes

-   HTTP-only cookies prevent XSS
-   verifyToken middleware protects private routes
-   CORS configured with credentials
-   HTTPS recommended for production

## 🚀 Deployment

This backend is deployed on **Vercel**
