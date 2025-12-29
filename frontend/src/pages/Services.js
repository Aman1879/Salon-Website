import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import { Star, Clock, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServiceImage } from '../utils/serviceImages';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Wrap fetchServices in useCallback to fix the dependency warning
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? 'https://salon-website-5zml.onrender.com/api/services'
        : `https://salon-website-5zml.onrender.com/api/services?category=${selectedCategory}`;
      
      const response = await axios.get(url);
      const normalized = response.data.services.map((svc) => {
        const img = getServiceImage(svc);
        return { ...svc, image: img.src, alt: img.alt };
      });
      setServices(normalized);
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
      setError('');
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error('Error fetching services:', err);
      
      // Fallback mock data
      const mockData = {
        services: [
          {
            id: 1,
            name: "Swedish Massage",
            category: "massage",
            description: "A gentle, relaxing full-body massage that improves circulation and eases muscle tension.",
            duration: 60,
            price: 1200,
            popular: true,
            features: ["Stress Relief", "Improved Circulation", "Muscle Relaxation"],
            rating: 4.8
          },
          {
            id: 2,
            name: "Haircut & Styling",
            category: "hair",
            description: "Precision haircut, blow-dry and styling for every occasion.",
            duration: 60,
            price: 600,
            popular: true,
            features: ["Cut & Finish", "Blow-dry", "Men/Women/Kids"],
            rating: 4.9
          },
          {
            id: 3,
            name: "Hair Coloring & Highlights",
            category: "color",
            description: "Balayage, global color, root touch-up and highlights tailored to you.",
            duration: 120,
            price: 2500,
            popular: true,
            features: ["Balayage", "Highlights", "Root Touch-Up"],
            rating: 4.8
          },
          {
            id: 4,
            name: "Luxury Facial & Skincare",
            category: "skincare",
            description: "Advanced facials for glow, anti-aging and hydration.",
            duration: 75,
            price: 2500,
            popular: true,
            features: ["Hydration", "Brightening", "Anti-aging"],
            rating: 4.7
          },
          {
            id: 5,
            name: "Manicure & Pedicure",
            category: "nails",
            description: "Classic and gel nail care with cuticle work and massage.",
            duration: 50,
            price: 700,
            popular: true,
            features: ["Manicure", "Pedicure", "Gel/Classic"],
            rating: 4.6
          },
          {
            id: 6,
            name: "Bridal & Party Makeup",
            category: "makeup",
            description: "Event-ready makeup with flawless finish and long wear.",
            duration: 180,
            price: 8000,
            popular: true,
            features: ["Bridal", "Party", "HD/Long-wear"],
            rating: 4.9
          }
        ],
        categories: [
          { id: "all", name: "All Services" },
          { id: "massage", name: "Massage Therapies" },
          { id: "facial", name: "Facial Treatments" },
          { id: "body", name: "Body Treatments" },
          { id: "aroma", name: "Aromatherapy" },
          { id: "hair", name: "Hair Services" },
          { id: "color", name: "Coloring & Treatments" },
          { id: "nails", name: "Manicure & Pedicure" },
          { id: "spa", name: "Salon Treatments" },
          { id: "skincare", name: "Facial & Skincare" },
          { id: "makeup", name: "Makeup & Beauty" }
        ]
      };
      const normalized = mockData.services.map((svc) => {
        const img = getServiceImage(svc);
        return { ...svc, image: img.src, alt: img.alt };
      });
      setServices(normalized);
      setCategories(mockData.categories);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]); // Added selectedCategory as dependency

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, fetchServices]); // Added fetchServices to dependency array

  const sortedServices = [...services].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'duration':
        return a.duration - b.duration;
      case 'popular':
      default:
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.rating - a.rating;
    }
  });

  const popularServices = services.filter(service => service.popular);
  const averagePrice = services.length > 0 
    ? (services.reduce((sum, service) => sum + service.price, 0) / services.length).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-400 to-yellow-700 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Premium Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Discover our range of professional salon services designed for Indian beauty needs. Each service is tailored to enhance your natural beauty and confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold">{services.length}+</div>
              <div className="text-sm">Services Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold">{popularServices.length}</div>
              <div className="text-sm">Popular Choices</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold">₹{averagePrice}</div>
              <div className="text-sm">Average Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center text-gray-700 font-medium">
                <Filter className="w-5 h-5 mr-2" />
                Filter by:
              </span>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchServices}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && (
        <div className="container mx-auto px-4 py-12">
          {/* Featured Services */}
          {popularServices.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <TrendingUp className="w-8 h-8 text-yellow-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Featured Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularServices.map(service => (
                  <div key={service.id} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.alt || service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                          Most Popular
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="text-white font-bold text-xl">{service.name}</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-400 mr-1" />
                          <span className="text-gray-700">{service.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                          <span className="font-bold text-gray-800">{service.rating}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, index) => (
                            <span 
                              key={index}
                              className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-800">₹{service.price.toLocaleString('en-IN')}</div>
                        <Link 
                          to={`/booking?service=${encodeURIComponent(service.name)}`}
                          className="px-6 py-3 bg-gradient-to-r from-gray-400 to-yellow-600 text-white rounded-lg font-semibold hover:from-gray-500 hover:to-yellow-700 transition-all transform hover:scale-105"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Services */}
          <div>
            <div className="flex items-center mb-8">
              <Sparkles className="w-8 h-8 text-yellow-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">All Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedServices.map(service => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.alt || service.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">₹{service.price}</div>
                    </div>
                    <Link 
                      to={`/booking?service=${encodeURIComponent(service.name)}`}
                      className="block w-full text-center py-3 bg-yellow-50 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
                    >
                      Select Service
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Summary */}
          <div className="mt-20 bg-gradient-to-r from-gray-100 to-yellow-50 rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Service Categories Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.filter(c => c.id !== 'all').map(category => {
                const categoryServices = services.filter(s => s.category === category.id);
                const avgPrice = categoryServices.length > 0 
                  ? (categoryServices.reduce((sum, s) => sum + s.price, 0) / categoryServices.length).toFixed(0)
                  : 0;
                
                return (
                  <div key={category.id} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                    <div className="text-4xl font-bold text-yellow-700 mb-2">
                      {categoryServices.length}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-2">{category.name}</div>
                    <div className="text-gray-600 text-sm mb-3">
                      Average: ₹{avgPrice}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gray-400 to-yellow-600"
                        style={{ width: `${(categoryServices.length / services.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
