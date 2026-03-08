
  
<div align="center">
  <!-- Title -->
  <text x="163" y="115" font-family="'Segoe UI', Arial, sans-serif" font-size="52" font-weight="800" fill="url(#accent)" filter="url(#glow)" letter-spacing="-1">DORMEX</text>


  
  <!-- Subtitle -->
  <text x="163" y="148" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="#94a3b8" letter-spacing="3">HOSTEL MANAGEMENT SYSTEM</text>

  <!-- Divider -->
  <line x1="160" y1="165" x2="420" y2="165" stroke="#2d3352" stroke-width="1"/>

  </br>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Fly.io](https://img.shields.io/badge/Fly.io-8B5CF6?style=for-the-badge&logo=fly&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)

REST API powering the [Dormex](https://github.com/zenpai6996/Dormex-Frontend) hostel management mobile app.

</div>

---

## 📖 Overview

This is the backend service for **Dormex**, handling all server-side logic for hostel operations including room management, complaint tracking, and mess menu administration. It is containerized with Docker and deployed on Fly.io.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| Docker | Containerization |
| Fly.io | Cloud deployment |
| GitHub Actions | CI/CD pipeline |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Local Development

```bash
# Clone the repository
git clone https://github.com/zenpai6996/Dormex-Backend.git
cd Dormex-Backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running with Docker

```bash
# Build the image
docker build -t dormex-backend .

# Run the container
docker run -p 3000:3000 dormex-backend
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

---

## 📁 Project Structure

```
Dormex-Backend/
├── src/
│   ├── routes/       # API route definitions
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   └── middleware/   # Auth & validation middleware
├── .github/
│   └── workflows/    # CI/CD pipelines
├── Dockerfile        # Container configuration
├── fly.toml          # Fly.io deployment config
└── server.js         # Entry point
```

---

## 📡 API Overview

| Module | Endpoints |
|---|---|
| Auth | Register, Login, Role-based access |
| Rooms | List, Book, Allocate, Update |
| Complaints | Raise, View, Update status |
| Mess Menu | Create, Update, View weekly menu |

---

## 🚢 Deployment

The backend is deployed on **Fly.io**. To deploy manually:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Authenticate
fly auth login

# Deploy
fly deploy
```

CI/CD is handled automatically via **GitHub Actions** on every push to `main`.

---

## 🔗 Related

- [Dormex Frontend](https://github.com/zenpai6996/Dormex-Frontend) — React Native mobile app

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

