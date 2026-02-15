# Adarsh Vidhyapeeth - Frontend (React + Vite)

Modern React frontend for Adarsh Vidhyapeeth Management System built with Vite.

## Tech Stack

- ⚡ **Vite** - Lightning-fast build tool
- ⚛️ **React 18** - UI library
- 🎨 **Tailwind CSS** - Utility-first CSS
- 🔀 **React Router v6** - Client-side routing
- 🔄 **TanStack Query** - Data fetching & caching
- 🌐 **Axios** - HTTP client
- 🔔 **React Hot Toast** - Notifications
- 🎯 **Lucide React** - Icons

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend server running on port 5000

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` if needed:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── dashboard/   # Dashboard layout components
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── lib/             # Utilities & configurations
│   │   └── api.js       # Axios instance
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Payments.jsx
│   │   └── ...
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features

### Authentication
- ✅ JWT-based login
- ✅ Role-based access (Admin & Director)
- ✅ Protected routes
- ✅ Auto token refresh
- ✅ Persistent sessions

### Dashboard
- ✅ Real-time statistics
- ✅ Student overview
- ✅ Seat availability
- ✅ Collection summary
- ✅ Quick actions

### Student Management
- Add/Edit students
- View student details
- Soft delete (Director)
- Restore students (Admin only)
- Student search & filters

### Payment System
- Add payments with receipt upload
- View payment history
- Collection analytics
- Director-wise breakdown
- Payment reversal (Admin only)

### Seat Management
- Real-time seat availability
- Regular & Premium seats
- Visual seat map
- Assignment history

### Admin Features
- Director management
- Pricing configuration
- Audit logs viewer
- System analytics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## API Integration

All API calls go through the configured Axios instance (`src/lib/api.js`) which:
- Adds auth token to requests
- Handles 401 errors
- Provides centralized error handling
- Supports file uploads

## Styling

Using Tailwind CSS with custom configurations:

### Custom Colors
- Primary blue palette
- Custom utility classes
- Responsive design
- Dark mode ready

### Custom Components
- Buttons (`.btn`, `.btn-primary`, etc.)
- Inputs (`.input`, `.label`)
- Badges (`.badge-success`, etc.)
- Cards with hover effects

## State Management

- **React Context** for global auth state
- **TanStack Query** for server state
- **Local state** for UI interactions

## Routing

Protected routes require authentication:
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Admin only
<ProtectedRoute adminOnly>
  <AuditLogs />
</ProtectedRoute>
```

## Development

### Hot Module Replacement (HMR)
Vite provides instant HMR for React components.

### Proxy Configuration
API requests are proxied to backend in development:
```js
// vite.config.js
proxy: {
  '/api': 'http://localhost:5000',
  '/uploads': 'http://localhost:5000'
}
```

### Code Organization
- One component per file
- Named exports for utilities
- Default export for components
- Colocate related files

## Building for Production

1. Build the project:
```bash
npm run build
```

2. Output will be in `dist/` directory

3. Preview production build:
```bash
npm run preview
```

## Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Build the project
2. Set environment variables
3. Deploy `dist/` directory
4. Configure redirects for SPA routing:

**_redirects** (Netlify):
```
/*  /index.html  200
```

**vercel.json** (Vercel):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### With Backend

Serve frontend from Express:
```js
app.use(express.static('frontend/dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- ⚡ Vite's lightning-fast HMR
- 🔄 React Query caching
- 📦 Code splitting
- 🎨 CSS purging in production
- 🖼️ Optimized assets

## Troubleshooting

**API Connection Error:**
- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Check browser console for CORS errors

**Build Errors:**
- Clear node_modules and reinstall
- Check Node.js version (v18+)
- Verify all dependencies are installed

**Routing Issues:**
- Ensure proper redirect rules
- Check React Router configuration
- Verify basename if deploying to subdirectory

## Future Enhancements

- [ ] Advanced search & filters
- [ ] Bulk operations
- [ ] Export to Excel/PDF
- [ ] Print receipts
- [ ] Email notifications
- [ ] SMS integration
- [ ] Mobile app (React Native)

## Support

For issues or questions, contact the development team.

---

Built with ❤️ using React + Vite + Tailwind CSS
