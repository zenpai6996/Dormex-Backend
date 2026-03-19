# Dormex (Backend)

REST API powering the Dormex hostel management mobile app.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Fly.io](https://img.shields.io/badge/Fly.io-8B5CF6?style=flat-square&logo=fly&logoColor=white)

## What it does

- Auth and role-based access for students/admins
- Room allocation and occupancy management
- Complaint tracking and status updates
- Mess menu creation and weekly view endpoints

## Tech stack

- Node.js, Express.js, MongoDB (Mongoose)
- Docker for containerization
- Fly.io for deployment

## Quickstart

```bash
git clone https://github.com/zenpai6996/Dormex-Backend.git
cd Dormex-Backend
npm install
npm run dev
```

## Environment variables

Create a `.env` file in the root:

```env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Docker

```bash
docker build -t dormex-backend .
docker run -p 3000:3000 dormex-backend
```

## Structure

```
Dormex-Backend/
src/
  routes/       # API routes
  controllers/  # request handlers
  models/       # data models
  middleware/   # auth and validation
server.js       # entry point
```

## Related

- Frontend: https://github.com/zenpai6996/Dormex-Frontend

## License

See LICENSE.
