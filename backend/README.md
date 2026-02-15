# Adarsh Vidhyapeeth - Backend API

Production-ready backend for Adarsh Vidhyapeeth Management System.

## Features

- ✅ JWT Authentication
- ✅ Role-based Access Control (Admin & Director)
- ✅ Student Management
- ✅ Seat Management (80 Regular + 80 Premium)
- ✅ Payment System with Receipt Uploads
- ✅ Audit Logging
- ✅ Director Management
- ✅ Dynamic Pricing System
- ✅ Comprehensive Analytics

## Prerequisites

- Node.js v18 or higher
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adarsh_vidhyapeeth
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Seed the database (creates admin, seats, pricing):
```bash
npm run seed
```

This will create:
- Admin user (username: `admin`, password: `admin123`)
- 80 Regular seats (R1 - R80)
- 80 Premium seats (P1 - P80)
- Default pricing structure

5. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout

### Directors (Admin Only)
- GET `/api/directors` - Get all directors
- POST `/api/directors` - Create director
- GET `/api/directors/:id` - Get director
- PUT `/api/directors/:id/toggle-status` - Activate/Deactivate

### Students
- GET `/api/students` - Get all students
- POST `/api/students` - Add student
- GET `/api/students/:id` - Get student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Soft delete
- PUT `/api/students/:id/restore` - Restore (Admin only)
- GET `/api/students/stats` - Get statistics

### Seats
- GET `/api/seats` - Get all seats
- GET `/api/seats/available/:type` - Get available seats by type
- GET `/api/seats/stats` - Get seat statistics
- POST `/api/seats/cleanup` - Cleanup expired seats

### Payments
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Add payment (with receipt)
- GET `/api/payments/:id` - Get payment
- PUT `/api/payments/:id/reverse` - Reverse payment (Admin only)
- GET `/api/payments/stats/collection` - Collection statistics
- GET `/api/payments/student/:studentId` - Student payments

### Pricing
- GET `/api/pricing` - Get all pricing
- GET `/api/pricing/:type/:plan` - Get specific price
- PUT `/api/pricing/:type/:plan` - Update pricing (Admin only)

### Audit Logs (Admin Only)
- GET `/api/audit-logs` - Get all logs
- GET `/api/audit-logs/:id` - Get log by ID
- GET `/api/audit-logs/target/:model/:id` - Get logs by target
- GET `/api/audit-logs/stats` - Get statistics

## Default Login

**Admin:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change this password immediately after first login!**

## Pricing Structure

| Type    | Plan   | Price |
|---------|--------|-------|
| Regular | 6hr    | ₹250  |
| Regular | 12hr   | ₹450  |
| Premium | 6hr    | ₹350  |
| Premium | 12hr   | ₹550  |

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Inactive user blocking
- Audit logging for sensitive actions
- Helmet.js security headers
- CORS enabled
- File upload validation

## File Uploads

Uploaded files are stored in:
- `/uploads/students` - Student photos
- `/uploads/receipts` - Payment receipts

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Development

- Uses ES Modules
- Nodemon for auto-reload
- MongoDB with Mongoose ORM
- Express.js framework

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Use MongoDB cloud (MongoDB Atlas)
4. Enable HTTPS
5. Set up proper CORS origins
6. Use environment variables for sensitive data
7. Set up regular database backups
8. Configure proper logging

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For cloud DB, whitelist your IP

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill process using port 5000

**File Upload Errors:**
- Ensure `uploads` directories exist
- Check file permissions
- Verify file size limits

## Support

For issues or questions, contact the development team.

---

**⚠️ IMPORTANT NOTES:**

1. **Change default admin password** after first login
2. **Never commit `.env` file** to version control
3. **Use strong JWT secret** in production
4. **Enable HTTPS** in production
5. **Set up regular backups** of MongoDB
6. **Monitor audit logs** regularly
