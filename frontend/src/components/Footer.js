import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img src="/images/gallery/logo.png" alt="GlowStack logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-bold">GlowStack</div>
                <div className="text-sm text-gray-400">Salon & Beauty</div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Your destination for style and beauty in Mumbai. Experience professional salon services with expert stylists.
            </p>
            
            <div className="flex space-x-4">
              <button type="button" className="text-gray-400 hover:text-yellow-600 transition-colors">
                 <Facebook className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-400 hover:text-yellow-600 transition-colors">
                 <Instagram className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-400 hover:text-yellow-600 transition-colors">
                 <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-yellow-600 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-yellow-600 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-yellow-600 transition-colors">
                  Booking
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-yellow-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-yellow-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer">
                Swedish Massage
              </li>
              <li className="text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer">
                Deep Tissue Massage
              </li>
              <li className="text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer">
                Facial Treatments
              </li>
              <li className="text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer">
                Hot Stone Therapy
              </li>
              <li className="text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer">
                Body Scrubs
              </li>
              <li className="text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer">
                Aromatherapy
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
                <span className="text-gray-400">
                  Phagwara, Punjab
                </span>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-400">1234567890</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-400">hello@glowstack.com</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
              <div className="text-gray-400 text-sm space-y-1">
                <div>Monday - Sunday: 9:00 AM - 8:00 PM</div>
                <div className="text-yellow-600">Open 7 days a week</div>
              </div>
            </div>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} GlowStack. All rights reserved.
            </div>
            

            
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-yellow-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-yellow-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/faq" className="hover:text-yellow-600 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;