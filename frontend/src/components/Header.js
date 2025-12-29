import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/booking', label: 'Booking' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-white ring-2 ring-yellow-300 overflow-hidden flex items-center justify-center">
              <img
                src="/images/gallery/logo.png"
                alt="Glow Stack — Beauty & Makeup logo"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">GlowStack</div>
              <div className="text-xs text-gray-500">Wellness & Beauty</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-700 space-x-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="font-medium">1234567890</span>
              </div>
              <div className="hidden sm:flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Phagwara, Punjab</span>
              </div>
            </div>
            <Link
              to="/booking"
              className="px-6 py-3 bg-gradient-to-r from-gray-400 to-yellow-600 text-white rounded-lg font-semibold hover:from-gray-500 hover:to-yellow-700 transition-all transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-4 rounded-lg font-medium ${
                    location.pathname === item.path
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                <div className="flex flex-col items-center justify-center text-gray-700 mb-4">
                      <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">1234567890</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Phagwara, Punjab</span>
                  </div>
                </div>
                <Link
                  to="/booking"
                  className="block w-full text-center py-3 bg-gradient-to-r from-gray-400 to-yellow-600 text-white rounded-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;