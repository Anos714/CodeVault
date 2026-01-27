# 🚀 CodeVault – Your Modern Code Snippet Library

**CodeVault** is a powerful, developer-friendly application designed to store, manage, and share your code snippets efficiently. Built with the **MERN stack**, it offers a seamless experience with syntax highlighting, instant search, and a beautiful dark-themed UI.

🔗 **Live Demo:** https://codevault-olive.vercel.app/

---

## 📸 Screenshots & Demo

> ℹ️ Replace the placeholder image URLs below with real screenshots stored in a `screenshots/` folder.

|                                                                                          Home / Dashboard                                                                                           |                                                                                       Code Editor (Monaco)                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Dashboard](https://media.licdn.com/dms/image/v2/D5622AQFp82Vv7zugug/feedshare-shrink_2048_1536/B56Zv7EitUI4Ak-/0/1769443830896?e=1770854400&v=beta&t=0HkdbWeX_qfL5ehdm78Jm55AQYDLHBkmnecvVla5Uvc) | ![Editor](https://media.licdn.com/dms/image/v2/D5622AQFBKMfP3ml0sw/feedshare-shrink_2048_1536/B56Zv7EiAZIYAk-/0/1769443827989?e=1770854400&v=beta&t=oRRDySxvrVmdB3GapZ3oIizCZNMkcVwLyI81vpfriq4) |
|                                                                                   Browse and manage all snippets                                                                                    |                                                                          Add or edit snippets with syntax highlighting                                                                           |

|                                                                                          View Snippet                                                                                          |                                                                                      Responsive Mobile View                                                                                      |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![View Page](https://media.licdn.com/dms/image/v2/D5622AQGSMV2H5rZRFA/feedshare-shrink_1280/B56Zv7EiIDIUAc-/0/1769443828520?e=1770854400&v=beta&t=b1_vH17-_hwTaJNgKsQv9zZAWmRjjJucVf9QknYSNRI) | ![Mobile View](https://media.licdn.com/dms/image/v2/D5622AQFLC2SHUeEPpA/feedshare-shrink_1280/B56Zv7EhFxJ8Ac-/0/1769443824201?e=1770854400&v=beta&t=LX3lyRamB9XthJHfOAJtvpfUdr1YYoWZityis3h8ySQ) |
|                                                                            Beautiful code viewer with copy feature                                                                             |                                                                                 Fully responsive on all devices                                                                                  |

---

## ✨ Features

- 🔐 **Secure Authentication** – JWT-based auth with HttpOnly cookies
- 📝 **Full CRUD Support** – Create, read, update, and delete snippets
- 🎨 **Syntax Highlighting** – Monaco Editor for writing, syntax highlighter for viewing
- 🔍 **Advanced Search** – Debounced search by title or language
- 🏷️ **Tagging System** – Organize snippets with custom tags
- 🌓 **Dark Mode UI** – Clean developer-focused UI with Tailwind CSS
- 📋 **One-Click Copy** – Instantly copy code snippets
- 🔒 **Privacy Control** – Public or private snippets

---

## 🛠️ Tech Stack

### Frontend

- React.js (Vite)
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Lucide React
- Monaco Editor
- React Syntax Highlighter

### Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt
- Cookie Parser

### Deployment

- Vercel (Frontend & Backend)

---


## 🚀 Getting Started

Follow these steps to run CodeVault locally.

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (Local or MongoDB Atlas)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YourUsername/CodeVault.git
cd CodeVault
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

## Create a .env file inside the server folder:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Start the backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
Open a new terminal:

cd client
npm install
```

## Create a .env file inside the client folder:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## Start the frontend:

```bash
npm run dev


Frontend will run at:
👉 http://localhost:5173
```

# 🤝 Contributing

Contributions are always welcome and greatly appreciated!  
If you have ideas, improvements, or bug fixes, feel free to contribute.

---

## 🛠️ Steps to Contribute

1. **Fork the repository**

2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

## 📝 Commit & Submit Changes

After making your changes, follow these steps to submit your contribution:

### 1️⃣ Commit Your Changes

```bash
git commit -m "Add AmazingFeature"
```

### 2️⃣ Push to Your Branch

```bash
git push origin feature/AmazingFeature
```

### 3️⃣ Open a Pull Request 🚀

```bash
Clearly describe the changes you’ve made

Reference related issues if applicable
```


# 🗺️ Development Roadmap

This roadmap outlines the current progress and future plans for the project.

---

## ✅ Phase 1: MVP (Completed)

Core features required for a functional and stable product.

- User Authentication (Register / Login)
- Create, Read, Update, Delete Snippets
- Syntax Highlighting
- Basic Search & Filtering
- Responsive UI

---

## 🚧 Phase 2: Advanced Features (Upcoming)

Enhancements focused on user engagement and better organization.

- Social Sharing (public snippet links)
- Likes & Comments
- Collections / Folders
- Profile Customization (avatar & bio)
- Extended Language Support

---

## 🔮 Phase 3: Pro Features

Advanced integrations and collaboration tools.

- VS Code Extension
- GitHub Gist Integration
- Team Collaboration & Shared Workspaces

---


### 📞 Contact

```bash
Created by [Rahul Sain]

GitHub: https://github.com/Anos714

Email: sainrahul374@gmail.com
```
