const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();
const nodemailer = require('nodemailer');

// Simple transporter factory (falls back to a logger when SMTP settings are not present)
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Dev fallback: no-op transporter that logs the mail
  return {
    sendMail: async (opts) => {
      console.log('Mail not configured. Would send:', opts);
      return Promise.resolve();
    }
  };
};

const transporter = createTransporter();

async function sendAdminEmail(inquiry) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('ADMIN_EMAIL not set; skipping email send.');
      return;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@glowstack.local',
      to: adminEmail,
      subject: `New Booking Inquiry: ${inquiry.service} - ${inquiry.name}`,
      text: `New booking received.

Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone}
Service: ${inquiry.service}
Preferred Date: ${inquiry.preferredDate}
Preferred Time: ${inquiry.preferredTime}
Message: ${inquiry.message}

ID: ${inquiry.id}`
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Admin email sent to', adminEmail);
  } catch (err) {
    console.error('Failed to send admin email:', err);
  }
} 

// Load data files
const serviceData = require('./data/services.json');
const galleryData = require('./data/gallery.json');

// Load inquiries data
let inquiriesData = { inquiries: [], stats: { total: 0, pending: 0, contacted: 0 } };
const INQUIRIES_FILE = path.join(__dirname, 'data/inquiries.json');

const loadInquiries = async () => {
  try {
    const data = await fs.readFile(INQUIRIES_FILE, 'utf8');
    inquiriesData = JSON.parse(data);
  } catch (error) {
    console.log('Creating new inquiries file...');
    await saveInquiries();
  }
};

const saveInquiries = async () => {
  try {
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiriesData, null, 2));
  } catch (error) {
    console.error('Error saving inquiries:', error);
  }
};

// Load contact messages data
let contactMessagesData = { messages: [], stats: { total: 0, unread: 0, replied: 0 } };
const CONTACT_MESSAGES_FILE = path.join(__dirname, 'data/contact-messages.json');

const loadContactMessages = async () => {
  try {
    const data = await fs.readFile(CONTACT_MESSAGES_FILE, 'utf8');
    contactMessagesData = JSON.parse(data);
  } catch (error) {
    console.log('Creating new contact messages file...');
    await saveContactMessages();
  }
};

const saveContactMessages = async () => {
  try {
    await fs.writeFile(CONTACT_MESSAGES_FILE, JSON.stringify(contactMessagesData, null, 2));
  } catch (error) {
    console.error('Error saving contact messages:', error);
  }
};

// Initialize
loadInquiries();
loadContactMessages();

// ===== SERVICES ROUTES =====
router.get('/services', (req, res) => {
  const { category } = req.query;
  
  if (category && category !== 'all') {
    const filteredServices = serviceData.services.filter(
      service => service.category === category
    );
    res.json({
      services: filteredServices,
      categories: serviceData.categories
    });
  } else {
    res.json(serviceData);
  }
});

router.get('/services/:id', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = serviceData.services.find(s => s.id === serviceId);
  
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// ===== GALLERY ROUTES =====
router.get('/gallery', (req, res) => {
  const { category } = req.query;
  
  if (category && category !== 'all') {
    const filteredGallery = galleryData.gallery.filter(
      item => item.category === category
    );
    res.json({
      gallery: filteredGallery,
      categories: galleryData.categories
    });
  } else {
    res.json(galleryData);
  }
});

router.get('/gallery/featured', (req, res) => {
  const featured = galleryData.gallery.filter(item => item.featured);
  res.json(featured.slice(0, 4));
});

// ===== BOOKING INQUIRIES ROUTES =====
router.post('/inquiries', async (req, res) => {
  try {
    const { service, preferredDate, preferredTime } = req.body;

    // Check if this time slot is already booked (accepted) for this service and date
    const existingAccepted = inquiriesData.inquiries.find(i => 
      i.status === 'accepted' &&
      i.service === service &&
      i.preferredDate === preferredDate &&
      i.preferredTime === preferredTime
    );

    if (existingAccepted) {
      return res.status(409).json({
        success: false,
        message: `This time slot is already booked. Please select a different time.`,
        error: 'SLOT_UNAVAILABLE'
      });
    }

    const inquiry = {
      id: Date.now(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inquiriesData.inquiries.unshift(inquiry);
    inquiriesData.stats.total += 1;
    inquiriesData.stats.pending += 1;

    await saveInquiries();

    // Send notification email to admin (if configured)
    await sendAdminEmail(inquiry);

    // Log the inquiry
    console.log('📧 New booking inquiry saved:', {
      from: inquiry.email,
      service: inquiry.service,
      date: inquiry.preferredDate,
      time: inquiry.preferredTime
    });

    res.status(201).json({
      success: true,
      message: 'Booking inquiry submitted successfully!',
      inquiryId: inquiry.id,
      data: {
        name: inquiry.name,
        service: inquiry.service,
        date: inquiry.preferredDate,
        time: inquiry.preferredTime
      }
    });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit inquiry. Please try again.' 
    });
  }
});

// Admin: list all inquiries (protected by ADMIN_KEY query param or x-admin-key header if ADMIN_KEY is set)
router.get('/inquiries', (req, res) => {
  const providedKey = req.query.key || req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY;

  console.log('🔐 Admin auth attempt:', {
    expected: expectedKey ? '***set***' : 'not-set',
    provided: providedKey ? '***provided***' : 'not-provided',
    match: providedKey === expectedKey
  });

  if (expectedKey && providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json(inquiriesData.inquiries);
});

// Admin: get a single inquiry by id
router.get('/inquiries/:id', (req, res) => {
  const providedKey = req.query.key || req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY;

  if (expectedKey && providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = parseInt(req.params.id, 10);
  const inquiry = inquiriesData.inquiries.find(i => i.id === id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
  res.json(inquiry);
});

router.get('/inquiries/stats', (req, res) => {
  res.json(inquiriesData.stats);
});

// Get available time slots for a specific date
router.get('/slots/available', (req, res) => {
  const { date, service } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date parameter required' });
  }

  // Get all accepted bookings for this date and service
  const acceptedForDate = inquiriesData.inquiries.filter(i => 
    i.status === 'accepted' && 
    i.preferredDate === date &&
    (!service || i.service === service)
  );

  // Define available time slots (9 AM to 6 PM in 1-hour intervals)
  const allSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Get booked times
  const bookedTimes = acceptedForDate.map(b => b.preferredTime);

  // Return only available slots
  const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

  res.json({ 
    date, 
    service: service || 'all',
    availableSlots,
    bookedSlots: bookedTimes
  });
});

// Admin: Update booking status (accept/reject)
router.put('/inquiries/:id/status', (req, res) => {
  const providedKey = req.query.key || req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY;

  if (expectedKey && providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  // Validate status
  if (!['accepted', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be: accepted, rejected, or pending' });
  }

  const inquiry = inquiriesData.inquiries.find(i => i.id === id);
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  const oldStatus = inquiry.status;
  inquiry.status = status;
  inquiry.updatedAt = new Date().toISOString();

  // Update stats
  if (oldStatus === 'pending') inquiriesData.stats.pending -= 1;
  if (status === 'pending') inquiriesData.stats.pending += 1;

  saveInquiries();

  console.log(`✅ Booking ${id} status updated: ${oldStatus} → ${status}`);

  res.json({
    success: true,
    message: `Booking ${status} successfully`,
    inquiry
  });
});

router.get('/inquiries/stats', (req, res) => {
  res.json(inquiriesData.stats);
});

// ===== CONTACT FORM ROUTES =====
router.post('/contact', async (req, res) => {
  try {
    const contactData = {
      id: Date.now(),
      ...req.body,
      type: 'contact',
      createdAt: new Date().toISOString()
    };

    // Log contact message
    console.log('📞 New contact message:', {
      from: contactData.name,
      email: contactData.email,
      subject: contactData.subject
    });

    // In production, save to database and send email
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      data: {
        name: contactData.name,
        email: contactData.email
      }
    });
  } catch (error) {
    console.error('Error processing contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
});

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    services: serviceData.services.length,
    gallery: galleryData.gallery.length,
    inquiries: inquiriesData.stats.total,
    timestamp: new Date().toISOString()
  });
});

// ===== TESTIMONIALS ROUTES =====
router.get('/testimonials', (req, res) => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Regular Client",
      content: "Absolutely loved the service — very professional and tailored to my needs!",
      rating: 5,
      date: "2026-11-12",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "First-time Visitor",
      content: "The Ayurvedic facial was amazing — skin felt rejuvenated and glowing.",
      rating: 5,
      date: "2026-10-03",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Wellness Enthusiast",
      content: "Friendly staff and authentic treatments. Highly recommend to my friends!",
      rating: 5,
      date: "2026-09-21",
      avatar: "https://randomuser.me/api/portraits/women/72.jpg"
    }
  ];
  
  res.json(testimonials);
});

// ===== CONTACT MESSAGES ROUTES =====
router.post('/contact-messages', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.'
      });
    }

    const contactMessage = {
      id: Date.now(),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    contactMessagesData.messages.unshift(contactMessage);
    contactMessagesData.stats.total += 1;
    contactMessagesData.stats.unread += 1;

    await saveContactMessages();

    // Log the contact message
    console.log('📬 New contact message received:', {
      from: contactMessage.email,
      subject: contactMessage.subject
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      messageId: contactMessage.id
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// Admin: list all contact messages (protected)
router.get('/contact-messages', (req, res) => {
  const providedKey = req.query.key || req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY;

  if (expectedKey && providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
  }

  res.json(contactMessagesData.messages);
});

// Admin: update contact message status (protected)
router.put('/contact-messages/:id/status', async (req, res) => {
  const providedKey = req.query.key || req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY;

  if (expectedKey && providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
  }

  try {
    const messageId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['unread', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use "unread" or "replied".' });
    }

    const message = contactMessagesData.messages.find(m => m.id === messageId);
    if (!message) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    const oldStatus = message.status;
    message.status = status;
    message.updatedAt = new Date().toISOString();

    // Update stats
    if (oldStatus === 'unread' && status === 'replied') {
      contactMessagesData.stats.unread = Math.max(0, contactMessagesData.stats.unread - 1);
      contactMessagesData.stats.replied += 1;
    } else if (oldStatus === 'replied' && status === 'unread') {
      contactMessagesData.stats.unread += 1;
      contactMessagesData.stats.replied = Math.max(0, contactMessagesData.stats.replied - 1);
    }

    await saveContactMessages();

    res.json({
      success: true,
      message: `Contact message marked as ${status}`,
      contactMessage: message
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

module.exports = router;