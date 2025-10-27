<p align="center">
  <img src="chat_frontend/public/chatlogo.png" alt="app logo" width="120" />
</p>

<h1 align="center">💬 Chatterbox</h1>

**Chatterbox** is a Full-Stack Real-Time Chat Application built with **Vite (React)** on the frontend and **Express.js** on the backend.  
It is designed primarily for **internal communication and collaboration**.  

Used in more than **4+ personal projects**, including [FleetOps](https://github.com/AKASH-GPT-1678/FleetOps).

---

## 🚀 Overview

Chatterbox enables users to communicate instantly through private or group chats, ensuring a smooth and responsive real-time messaging experience.  
It demonstrates scalable, production-grade architecture with a focus on simplicity, modularity, and performance.

---

## ⚙️ Features

- 💬 **Real-Time Chat** with **Socket.IO**
- 👤 **User Authentication** (JWT / Session-based)
- 🔒 **Secure Login System**
- 🧑‍🤝‍🧑 **Group and Private Chats**
- 📡 **Express.js Backend** with REST API
- 🗄️ **PostgreSQL** Database Integration
- 🎨 **Responsive UI** with **Tailwind CSS**
- 🚀 **Vite** for fast frontend builds
- 🌐 **CORS-Enabled** for cross-origin communication
- 📱 Optimized for both desktop and mobile users

---

## 🧩 Tech Stack

**Frontend:** Vite, React, Tailwind CSS, Socket.IO Client  
**Backend:** Node.js, Express.js, Socket.IO  
**Database:** PostgreSQL  
**Authentication:** JWT / Better Auth  
**Dev Tools:** Nodemon, ESLint  
**Environment:** `.env` configuration for secrets and database URLs  

---

## 🛠️ Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/AKASH-GPT-1678/Chatterbox.git
cd Chatterbox
```
2. Backend Setup

Navigate to your backend directory backend and install dependencies:

```bash
npm install

```

Create a .env file inside your backend root directory and add:

```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/chatterbox"
BETTER_AUTH_SECRET="your_secret"
ANOTHER_KEY="some_value"
PORT=8080


```
Run your backend:
```
npm run dev
```

3. Frontend Setup

Navigate to your frontend directory (e.g., chat_frontend) and install dependencies:

```bash
npm install
npm run dev 

#For Production
npm run build
npm run preview

```

## 📸 Screenshots

(Add your app screenshots here)
Example: Chat window, login page, dashboard, etc.



## ⚙️ Environment

| Tool       | Version |
| ---------- | ------- |
| Node.js    | ≥ 18    |
| PostgreSQL | 15      |
| Express.js | 4.x     |
| React      | 18      |
| Vite       | 5.x     |

📄 License

This project is licensed under the MIT License — see the LICENSE
 file for details.

❤️ Acknowledgements

Thanks to Socket.IO for real-time communication

Thanks to PostgreSQL for robust data handling

Thanks to Vite for lightning-fast frontend builds

Inspired by the idea of internal team chat tools like Slack and Discord

<p align="center">Made with ❤️ by Akash Gupta</p> ```