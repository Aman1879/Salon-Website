import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Star, ChevronRight, Award, Users, Calendar } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredGallery, setFeaturedGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=2000', // haircut boy
    'https://images.pexels.com/photos/428333/pexels-photo-428333.jpeg?auto=compress&cs=tinysrgb&w=2000', // haircut girl
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=2000', // face massage
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000', // bridal makeup
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=2000' // massage
  ];




  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured services
      const servicesRes = await axios.get('http://localhost:5000/api/services');
      const services = servicesRes.data.services;

      // Ensure Haircut, Face Massage (or Facial), and Makeup are featured if available
      const find = (re) => services.find(s => new RegExp(re, 'i').test(s.name));
      const selected = [];
      const addIf = (re) => {
        const s = find(re);
        if (s && !selected.find(x => x.id === s.id)) selected.push(s);
      };

      addIf('hair|cut');
      addIf('face massage|facial|face');
      addIf('makeup|make-over|bridal');

      // Fill to 3 if some are missing using popular services (excluding any already added)
      if (selected.length < 3) {
        services
          .filter(s => s.popular && !selected.find(x => x.id === s.id))
          .slice(0, 3 - selected.length)
          .forEach(s => selected.push(s));
      }

      setFeaturedServices(selected.slice(0, 3));

      // Fetch featured gallery items
      const galleryRes = await axios.get('http://localhost:5000/api/gallery/featured');
      setFeaturedGallery(galleryRes.data);

      // Fetch testimonials
      const testimonialsRes = await axios.get('http://localhost:5000/api/testimonials');
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Fallback data (keep only Haircut, Face Massage and Makeup)
      setFeaturedServices([
        {
          id: 10,
          name: "Haircut",
          description: "Precision hair cutting and styling",
          price: 500,
          duration: 45,
          image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
          popular: true
        },
        {
          id: 11,
          name: "Face Massage",
          description: "Relaxing facial massage for glowing skin",
          price: 700,
          duration: 45,
          image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
          popular: true
        },
        {
          id: 12,
            name: "Bridal Makeup",
            description: "Stunning bridal makeup for your special day",
          price: 1500,
          duration: 90,
            image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
          popular: true
        }
      ]);
      
      setFeaturedGallery([
        {
          id: 1,
          title: "Precision Haircut",
          image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
        },
        {
          id: 2,
          title: "Balayage & Highlights",
          image: "https://images.pexels.com/photos/3993445/pexels-photo-3993445.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
        }
      ]);

      setTestimonials([
        {
          id: 1,
          name: "Sana Kapoor",
          content: "Best salon service in Mumbai — friendly staff and great styling!",
          rating: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Emoji avatar helper for testimonials
  const emojis = ['🙂','😊','😀','🙋🏽‍♀️','🙋🏽‍♂️','😉','🤗','😇','😌','😍'];
  const getEmoji = (t) => {
    // If backend already returned an emoji string (short), use it
    if (t?.avatar && typeof t.avatar === 'string' && t.avatar.length <= 4) return t.avatar;
    const index = t?.id ? (t.id % emojis.length) : Math.abs((t.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % emojis.length;
    return emojis[index];
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <picture>
            <source
              type="image/jpeg"
              srcSet="/images/gallery/imagesss.jpg 2000w, /images/gallery/barbershop-hero.jpg 1200w, /images/gallery/barbershop-hero.jpg 800w"
              sizes="(min-width:1024px) 2000px, (min-width:640px) 1200px, 800px"
            />
            <img
              src="/images/gallery/barbershop-hero.jpg"
              alt="Stylist working with a client inside a modern barbershop"
              loading="lazy"
              className="w-full h-full object-cover absolute inset-0"
              style={{ filter: 'brightness(0.55)' }}
            />
          </picture>
        </div>
        
        <div className="relative container mx-auto px-4 text-center text-white z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to GlowStack
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Punjab's premier destination where professional styling, beauty care, and relaxation come together to help you look and feel your best.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-gradient-to-r from-gray-400 to-yellow-600 text-white rounded-full text-lg font-semibold hover:from-gray-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Session
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full text-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80 text-sm">Salon Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15</div>
                <div className="text-white/80 text-sm">Expert Stylists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5K+</div>
                <div className="text-white/80 text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">12</div>
                <div className="text-white/80 text-sm">Treatment Rooms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-semibold">Most Popular</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Featured Salon Services
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Discover our most sought-after services that our clients love
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-400 to-yellow-600 text-white rounded-full text-lg font-semibold hover:from-gray-500 hover:to-yellow-700 transition-all group"
            >
              View All Services
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose GlowStack
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Experience the difference with our premium services and expert care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-3xl shadow-lg border border-yellow-100">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Certified Experts</h3>
              <p className="text-gray-600">
                Our therapists are certified professionals with years of experience in holistic wellness.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Care</h3>
              <p className="text-gray-600">
                Every treatment is customized to your specific needs and preferences.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-3xl shadow-lg border border-yellow-100">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Flexible Booking</h3>
              <p className="text-gray-600">
                Easy online booking with flexible scheduling to fit your busy lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Salon Environment
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Take a peek at our salon facilities and styling rooms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {featuredGallery.map((item, index) => (
              <div 
                key={item.id}
                className={`relative rounded-3xl overflow-hidden ${index === 0 ? 'h-96' : 'h-80'}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="opacity-90">Experience our serene environment</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full text-lg font-semibold hover:from-gray-900 hover:to-black transition-all group"
            >
              View Full Gallery
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-gray-100 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Read reviews from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full mr-4 bg-gray-100 flex items-center justify-center text-2xl" aria-hidden="true">
                    {getEmoji(testimonial)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-gray-500 text-sm">{testimonial.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-500 to-yellow-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience GlowStack?
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
            Book your appointment today and take the first step towards relaxation and rejuvenation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-white text-yellow-700 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Book Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;