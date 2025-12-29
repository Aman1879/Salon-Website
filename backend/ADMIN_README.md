# Admin Setup & Testing

This document explains how to configure admin notifications and access the protected admin dashboard.

## 1) Configure environment
- Copy `.env.example` to `.env` in the `backend/` folder and fill in real values:
  - `ADMIN_EMAIL` — where booking notifications should be sent
  - SMTP settings (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, etc.) if you want real emails
  - `ADMIN_KEY` — a secret key for accessing admin endpoints and logging into the admin dashboard

## 2) Start the backend
```bash
cd backend
npm install
npm run dev
```

## 3) Access the Admin Dashboard (Frontend)
The admin page is now protected with a login system:

1. Navigate to `/admin` in your browser (e.g., `http://localhost:3000/admin`)
2. Enter the `ADMIN_KEY` value (from backend `.env`) when prompted
3. Upon successful authentication, you'll see all booking inquiries
4. The admin link is **not visible** in the navigation menu for security
5. Session persists until you logout or close the browser

**Note:** The admin page is only accessible by entering the correct admin key. Regular users cannot access it without this key.

## 4) Test by submitting a booking (from the frontend or using curl)
Example curl POST (replace values as needed):
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"9999999999","service":"Haircut","preferredDate":"2026-01-10","preferredTime":"10:00","message":"Testing booking","numberOfPeople":1}'
```

If backend is running you should see a console log and the inquiry will be saved to `backend/src/data/inquiries.json`.
If SMTP is configured, the owner email (ADMIN_EMAIL) will receive a notification email.

## 5) View inquiries via API (Alternative method)
You can also access the protected API endpoint directly in a browser or Postman:

```
GET http://localhost:5000/api/inquiries?key=your-admin-key
```

Or view an individual inquiry:
```
GET http://localhost:5000/api/inquiries/1766934377574?key=your-admin-key
```

## 6) Optional: Run sample test script
A helper script is included at `backend/scripts/test-inquiry.js`. After starting the backend, run:

```bash
node scripts/test-inquiry.js
```

This will attempt an HTTP POST to `http://localhost:5000/api/inquiries` with sample data.

---
**Security Notes:**
- The admin page requires authentication and is not linked in the navigation
- Admin keys are stored in session storage (cleared on logout/browser close)
- Invalid authentication attempts are rejected
- Keep your `ADMIN_KEY` secure and never commit it to version control