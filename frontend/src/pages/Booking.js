import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Booking = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Fixed: keep loading state
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  // Get service from URL params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [location.search]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://salon-website-5zml.onrender.com/api/services');
      setServices(response.data.services);
    } catch (err) {
      console.error('Error fetching services:', err);
      // Fallback services
      setServices([
        { id: 1, name: 'Swedish Massage', price: 80, duration: 60 },
        { id: 2, name: 'Deep Tissue Massage', price: 120, duration: 90 },
        { id: 3, name: 'Signature Facial', price: 95, duration: 75 },
        { id: 4, name: 'Hot Stone Therapy', price: 110, duration: 90 },
        { id: 5, name: 'Detox Body Scrub', price: 70, duration: 50 },
        { id: 6, name: 'Aromatherapy Session', price: 85, duration: 60 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
     const response = await axios.post('https://salon-website-5zml.onrender.com/api/inquiries', formData);
      
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
        
        // Scroll to success message
        setTimeout(() => {
          const successElement = document.getElementById('success-message');
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        {success && (
          <div 
            id="success-message"
            className="mb-8 max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Booking Request Submitted!
                </h3>
                <p className="text-green-700">
                  Thank you for your booking inquiry. We've received your request and will 
                  contact you within 24 hours to confirm your appointment.
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-green-700 hover:text-green-800 font-medium"
                  >
                    Submit another booking →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        )}

        {!loading && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Book Your Salon Appointment
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Fill out the form below and we'll get back to you within 24 hours to confirm your appointment
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <User className="inline-block w-4 h-4 mr-2" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Mail className="inline-block w-4 h-4 mr-2" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Phone className="inline-block w-4 h-4 mr-2" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Service *
                          </label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <Calendar className="inline-block w-4 h-4 mr-2" />
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              <Clock className="inline-block w-4 h-4 mr-2" />
                              Preferred Time *
                            </label>
                            <select
                              name="preferredTime"
                              value={formData.preferredTime}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                            >
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Number of People
                          </label>
                          <select
                            name="numberOfPeople"
                            value={formData.numberOfPeople}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                          >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'person' : 'people'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mt-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Notes or Special Requests
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                        placeholder="Any special requirements, allergies, or preferences you'd like us to know about..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-10">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                          submitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-gray-400 to-yellow-600 hover:from-gray-500 hover:to-yellow-700 text-white hover:shadow-2xl transform hover:-translate-y-1'
                        }`}
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Submit Booking Request'
                        )}
                      </button>
                      
                      <p className="text-center text-gray-500 text-sm mt-4">
                        * Required fields. We'll confirm your appointment via email within 24 hours.
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Info */}
              <div className="space-y-8">
                {/* Booking Info */}
                <div className="bg-gradient-to-br from-gray-100 to-yellow-50 rounded-3xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center mr-4">
                        <Clock className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Operating Hours</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Monday - Sunday: 9:00 AM - 8:00 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                        <Calendar className="w-5 h-5 text-yellow-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Advance Booking</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Book up to 3 months in advance
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Group Bookings</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Special rates for groups of 3+ people
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-3xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Model Town, Phagwara, Punjab 144401</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 text-yellow-600" />
                      <span>+91 98765 43210</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-yellow-600" />
                      <span>bookings@glowstack.com</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-4">Need Immediate Help?</h4>
                    <p className="text-gray-600 text-sm">
                      Call us directly during business hours for urgent bookings or questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
