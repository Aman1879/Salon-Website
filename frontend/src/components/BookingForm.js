import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';

const BookingForm = ({ services = [], onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '10:00',
    message: '',
    numberOfPeople: 1
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const apiBase = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
  const allTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Fetch available slots when date or service changes
  useEffect(() => {
    if (!formData.preferredDate || !formData.service) {
      setAvailableSlots(allTimeSlots);
      return;
    }

    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await axios.get(
          `${apiBase}/api/slots/available?date=${formData.preferredDate}&service=${formData.service}`
        );
        setAvailableSlots(res.data.availableSlots || allTimeSlots);
      } catch (err) {
        console.warn('Could not fetch available slots, showing all:', err.message);
        setAvailableSlots(allTimeSlots);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [formData.preferredDate, formData.service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if selected time is still available
    if (!availableSlots.includes(formData.preferredTime)) {
      setError('This time slot is no longer available. Please select a different time.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiBase}/api/inquiries`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          preferredDate: '',
          preferredTime: '10:00',
          message: '',
          numberOfPeople: 1
        });
        
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.inquiryId);
        }
        
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      setError(errorMsg);
      
      // If slot was taken, refresh available slots
      if (err.response?.data?.error === 'SLOT_UNAVAILABLE') {
        // Re-fetch available slots
        if (formData.preferredDate && formData.service) {
          try {
            const res = await axios.get(
              `${apiBase}/api/slots/available?date=${formData.preferredDate}&service=${formData.service}`
            );
            setAvailableSlots(res.data.availableSlots || allTimeSlots);
          } catch (e) {
            console.error('Failed to refresh slots:', e);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };
    } finally {
      setLoading(false);
    }
  };
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          preferredDate: '',
          preferredTime: '10:00',
          message: '',
          numberOfPeople: 1
        });
        
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.inquiryId);
        }
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  // Get date 3 months from now for max date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Form */}
          <div className="md:w-2/3 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Book Your Salon Appointment
              </h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Inquiry Submitted Successfully!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      We've received your booking request and will contact you shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline-block w-4 h-4 mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline-block w-4 h-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline-block w-4 h-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Service *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    >
                      <option value="">Choose a service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.name}>
                          {service.name} (₹{service.price}, {service.duration}min)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        min={today}
                        max={maxDateStr}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline-block w-4 h-4 mr-1" />
                        Preferred Time *
                        {loadingSlots && <span className="text-xs text-gray-500 ml-2">(Loading...)</span>}
                        {!loadingSlots && formData.preferredDate && formData.service && (
                          <span className="text-xs text-green-600 ml-2">
                            ({availableSlots.length} slots available)
                          </span>
                        )}
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        disabled={loadingSlots || !formData.preferredDate || !formData.service}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select time slot</option>
                        {availableSlots.length === 0 ? (
                          <option disabled>No slots available</option>
                        ) : availableSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {formData.preferredDate && formData.service && availableSlots.length === 0 && !loadingSlots && (
                        <p className="mt-1 text-xs text-red-600">⚠️ All time slots are fully booked for this date. Please select another date.</p>
                      )}
                      {!formData.preferredDate && (
                        <p className="mt-1 text-xs text-gray-500">💡 Select a date and service first to see available time slots</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People
                    </label>
                    <select
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes or Special Requests
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  placeholder="Any special requirements, allergies, or preferences..."
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gray-400 to-yellow-600 hover:from-gray-500 hover:to-yellow-700 text-white hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Booking Inquiry'
                  )}
                </button>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  * Required fields. We'll confirm your appointment via email.
                </p>
              </div>
            </form>
          </div>

          {/* Right side - Info */}
          <div className="md:w-1/3 bg-gradient-to-b from-gray-100 to-yellow-50 p-8">
            <div className="sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Why Book With Us?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">24-Hour Response</h4>
                    <p className="text-gray-600 text-sm mt-1">We confirm all inquiries within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Flexible Cancellation</h4>
                    <p className="text-gray-600 text-sm mt-1">Free cancellation up to 24 hours before</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Group Bookings</h4>
                    <p className="text-gray-600 text-sm mt-1">Special rates for groups of 3+ people</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 Phagwara, Punjab</p>
                  <p>📞 1234567890</p>
                  <p>✉️ bookings@glowstack.com</p>
                  <p>🕐 Mon-Sun: 9AM - 8PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;