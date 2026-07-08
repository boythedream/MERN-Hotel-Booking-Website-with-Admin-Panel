# 🏨 Meridian House – MERN Hotel Booking Platform

A modern full-stack hotel booking platform built with the **MERN Stack** (MongoDB, Express.js, React, and Node.js). The application provides secure authentication, room management, online booking, Stripe payments, and an admin dashboard with a clean, responsive user interface.

---

# ✨ Features

## Guest Features

- User registration & login
- JWT authentication
- Browse available rooms
- Search and filter rooms
- Room details with images
- Live room availability
- Secure room booking
- Stripe online payments
- Booking history
- User profile management
- Booking cancellation

## Admin Features

- Admin dashboard
- Manage rooms (Create, Update, Delete)
- Manage bookings
- Manage users
- Booking status updates
- Dashboard statistics

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Stripe Elements

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Stripe API

---

# 📁 Project Structure

```text
hotel-booking-mern/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│
├── .gitignore
├── README.md
└── package.json
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Stripe Account (Optional for online payments)

---

## Installation

Clone the repository

```bash
git clone https://github.com/your-username/hotel-booking-mern.git

cd hotel-booking-mern
```

Install backend dependencies

```bash
cd backend
npm install
```

Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Create another `.env` file inside the **frontend** folder.

```env
VITE_API_URL=http://localhost:5000/api

VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

> **Important:** Never commit your `.env` files or real API keys to GitHub.

---

# 🌱 Seed Database (Optional)

Populate the database with sample rooms and demo accounts.

```bash
cd backend

npm run seed
```

---

# ▶️ Running the Application

### Backend

```bash
cd backend

npm run dev
```

Runs on:

```
http://localhost:5000
```

### Frontend

```bash
cd frontend

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 💳 Payment Integration

The application supports secure online payments using **Stripe Payment Elements**.

To enable payments, configure your Stripe API keys in the backend and frontend `.env` files.

---

# 🚀 Deployment

### Frontend

Deploy to:

- Vercel
- Netlify

### Backend

Deploy to:

- Railway
- Render
- Fly.io
- VPS

Configure the required environment variables on your hosting platform before deployment.

---

# 📸 Main Pages

- Home
- Rooms
- Room Details
- Checkout
- Login
- Register
- Profile
- My Bookings
- Admin Dashboard
- Manage Rooms
- Manage Bookings
- Manage Users

---

# 🔮 Future Improvements

- Email notifications
- Room reviews and ratings
- Coupon & discount system
- Multiple payment gateways
- Multi-language support
- Dark mode
- PWA support

---

# 📄 License

This project is created for educational purposes, portfolio showcase, and freelance development.