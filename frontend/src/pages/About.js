import React from 'react';
import { Heart, Users, Award, Clock, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Head Therapist & Founder",
      experience: "15 years",
      specialty: "Holistic Massage",
      bio: "Certified massage therapist with expertise in Swedish, deep tissue, and hot stone therapies.",
      avatar: "👩🏽"
    },
    {
      id: 2,
      name: "Shiven Mishra",
      role: "Facial Specialist",
      experience: "12 years",
      specialty: "Skin Care",
      bio: "Advanced facial therapy expert with focus on anti-aging and skin rejuvenation treatments.",
      avatar: "👨🏽"
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Aromatherapist",
      experience: "10 years",
      specialty: "Essential Oils",
      bio: "Certified aromatherapist creating custom blends for emotional and physical well-being.",
      avatar: "👩🏽"
    },
    {
      id: 4,
      name: "Aman Singh",
      role: "Salon Director",
      experience: "20 years",
      specialty: "Salon Operations",
      bio: "Oversees all salon operations and creates personalized beauty programs for clients.",
      avatar: "👨🏽"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Client-Centered Care",
      description: "Every treatment is personalized to meet your unique needs and wellness goals."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Excellence in Service",
      description: "We maintain the highest standards in every aspect of our salon experience."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Professional Expertise",
      description: "Our team consists of certified professionals with extensive experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874')"
          }}
        />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              About GlowStack
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              For over a decade, we've been providing exceptional salon and beauty experiences in Punjab,
              promoting confidence, style, and holistic wellness for every client.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-700 mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-700 mb-2">25+</div>
                <div className="text-gray-600">Expert Therapists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-700 mb-2">50K+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-700 mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">
                Our Story & Mission
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  Founded in 2010, GlowStack began with a simple mission: to bring world-class
                  salon and beauty services to Phagwara, Punjab, creating an oasis 
                  where people could find true relaxation and rejuvenation.
                </p>
                <p>
                  What started as a small wellness center has grown into one of Punjab's most 
                  respected salon destinations, known for our exceptional service, expert stylists, 
                  and tranquil environment.
                </p>
                <p>
                  Our mission is to provide personalized beauty and wellness experiences tailored
                  to Indian skin and hair types, using only the finest products and techniques.
                </p>
              </div>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/services"
                  className="px-8 py-3 bg-gradient-to-r from-gray-400 to-yellow-600 text-white rounded-full font-semibold hover:from-gray-500 hover:to-yellow-700 transition-all"
                >
                  Explore Services
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 border-2 border-yellow-600 text-yellow-700 rounded-full font-semibold hover:bg-yellow-50 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200" 
                  alt="Salon Interior"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <Award className="w-12 h-12 text-yellow-500 mr-4" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">Best Salon 2026</div>
                    <div className="text-gray-600">Beauty & Style Awards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-r from-gray-100 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              These principles guide everything we do at GlowStack
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-yellow-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our certified therapists bring years of experience and passion to every treatment
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden flex items-center justify-center bg-gray-100">
                  <div className="text-7xl" aria-hidden="true">{member.avatar}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-sm">{member.bio}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-yellow-700 font-medium mb-3">
                    {member.role}
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{member.experience} experience</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      <span>Specialty: {member.specialty}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Tour */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our World-Class Facility
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Experience luxury and comfort in our thoughtfully designed salon environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🏊‍♀️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Hydrotherapy Pool</h3>
              <p className="text-gray-600">
                Temperature-controlled pool with massage jets for ultimate relaxation
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🧖‍♀️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Steam Rooms</h3>
              <p className="text-gray-600">
                Aromatic steam rooms with essential oils for detoxification
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🎋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Meditation Garden</h3>
              <p className="text-gray-600">
                Outdoor garden space for meditation and relaxation sessions
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Relaxation Lounge</h3>
              <p className="text-gray-600">
                Comfortable lounge area with herbal tea and refreshments
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Boutique</h3>
              <p className="text-gray-600">
                Curated selection of premium wellness products for home care
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Parking</h3>
              <p className="text-gray-600">
                Complimentary valet parking for all salon guests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-500 to-yellow-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Experience GlowStack Today
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied clients who have discovered the GlowStack difference
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-white text-yellow-700 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Book Your Visit
            </Link>
            <Link
              to="/gallery"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Virtual Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;