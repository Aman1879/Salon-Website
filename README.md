# GlowStack Salon - Beauty & Wellness Platform

A full-stack salon booking and management system built with React and Node.js.

## Features

- 🏠 Modern landing page with service showcase
- 📅 Real-time booking system with slot availability
- 🖼️ Dynamic gallery with featured items
- 💼 Admin dashboard for booking management
- 📧 Contact form with admin notifications
- 🔒 Secure admin authentication
- 📱 Fully responsive design

## Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- Lucide React Icons
- Tailwind CSS (via CDN)

**Backend:**
- Node.js
- Express
- Nodemailer (email notifications)
- JSON file-based storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vanillaFinal
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:

Create `backend/.env`:
```env
ADMIN_KEY=your_admin_key_here
ADMIN_EMAIL=your_email@example.com

# Optional: SMTP settings for email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@glowstack.com
```

Create `frontend/.env` (optional):
```env
REACT_APP_API_BASE=http://localhost:5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:3000/admin

## Admin Access

Navigate to `/admin` and enter your admin key (configured in `backend/.env`).

## Project Structure

```
vanillaFinal/
├── backend/
│   ├── src/
│   │   ├── data/           # JSON data storage
│   │   ├── routes.js       # API routes
│   │   └── server.js       # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utilities
│   └── package.json
└── README.md
```

## API Endpoints

### Public
- `GET /api/services` - Get all services
- `GET /api/gallery` - Get gallery items
- `GET /api/gallery/featured` - Get featured gallery
- `POST /api/inquiries` - Submit booking inquiry
- `POST /api/contact-messages` - Submit contact message
- `GET /api/slots/available` - Check available time slots

### Admin (requires authentication)
- `GET /api/inquiries` - Get all booking inquiries
- `PUT /api/inquiries/:id/status` - Update inquiry status
- `GET /api/contact-messages` - Get all contact messages
- `PUT /api/contact-messages/:id/status` - Update message status

## License

MIT

## Contact

For questions or support, contact: hello@glowstack.com
