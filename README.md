# Task Manager — Backend

REST API for the Task Manager application with JWT authentication.

## Features
- User registration and login
- JWT authentication with httpOnly cookies
- Create, read, update, and delete tasks
- Tasks linked to authenticated users — users only see their own tasks
- Priority levels (low, medium, high) and due dates

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcrypt
- **Deployment:** Railway

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /signup | Register a new user |
| POST | /login | Login and receive JWT cookie |
| POST | /logout | Clear JWT cookie |

### Tasks (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks for logged in user |
| POST | /api/tasks | Create a new task |
| PATCH | /api/tasks/:id | Update or complete a task |
| DELETE | /api/tasks/:id | Delete a task |

## Run Locally
1. Clone the repo
2. Run `npm install`
3. Create a `.env` file:
4. Run `node app.js`
## Related
- [Frontend Repository](https://github.com/AbdulRafay77/task-manager-frontend)
- [Live App](https://task-manager-frontend-delta-blond.vercel.app)
