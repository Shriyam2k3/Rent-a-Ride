# Rent a Ride 🚗

A modern, full-stack car rental web application built with Next.js, React, Tailwind CSS, MongoDB, and Firebase.

🔗 **Live Demo:** [https://rent-a-ride-nu.vercel.app/](https://rent-a-ride-nu.vercel.app/)

---

## ✨ Features

- **Car Catalog & Search:** Browse available rental cars with detailed specs, pricing, and availability.
- **Booking Management:** Reserve cars seamlessly with real-time date selection and status tracking.
- **User Authentication:** Secure sign-up and login powered by Firebase Authentication.
- **User Dashboard:** View and manage personal bookings and reservations.
- **Admin Panel:** Comprehensive admin dashboard to manage car inventory, upload car images, and review customer bookings.
- **Image Uploads:** Cloudinary integration for fast, optimized car image storage and delivery.
- **Responsive & Modern UI:** Designed with modern aesthetics using Tailwind CSS and Lucide icons.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Frontend:** [React 19](https://react.dev/), TypeScript, [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/)
- **Media Management:** [Cloudinary](https://cloudinary.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shriyam2k3/Rent-a-Ride.git
   cd Rent-a-Ride
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and configure the required keys:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Deployment

The application is deployed on Vercel:
👉 **[https://rent-a-ride-nu.vercel.app/](https://rent-a-ride-nu.vercel.app/)**
