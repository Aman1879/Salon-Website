import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      const response = await axios.post(`https://salon-website-5zml.onrender.com/api/contact-messages`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help! Reach out to us using the form below 
            or through our contact information.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-gradient-to-br from-gray-100 to-yellow-50 rounded-3xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600 mt-1">+91 98765 43210</p>
                    <p className="text-gray-500 text-sm">Mon-Sun, 9AM-8PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600 mt-1">hello@glowstack.com</p>
                    <p className="text-gray-500 text-sm">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Location</h4>
                    <p className="text-gray-600 mt-1">
                      Model Town, Phagwara<br/>Punjab 144401, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="ml-auto font-semibold">9:00 AM - 8:00 PM</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Saturday</span>
                  <span className="ml-auto font-semibold">9:00 AM - 8:00 PM</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Sunday</span>
                  <span className="ml-auto font-semibold">9:00 AM - 8:00 PM</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">Emergency Contact</h4>
                <p className="text-gray-600 text-sm">
                  For after-hours emergencies, please call our emergency line at +91 98765 43211
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {success && (
                <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-10 w-10 text-green-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-1">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-green-700">
                        Thank you for contacting us. We'll get back to you as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-10 w-10 text-red-600 mr-4" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Email *
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
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                      submitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-gray-400 to-yellow-600 hover:from-gray-500 hover:to-yellow-700 text-white hover:shadow-2xl transform hover:-translate-y-1'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Map Section */}
            <div className="mt-12 bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Find Us</h3>
                <p className="text-gray-600 mb-6">
                  Visit our salon in Model Town, Phagwara, Punjab. Free parking available.
                </p>
              </div>
              <div className="h-64 bg-gradient-to-r from-gray-200 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-semibold">Model Town, Phagwara</p>
                  <p className="text-gray-600">Punjab 144401, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
