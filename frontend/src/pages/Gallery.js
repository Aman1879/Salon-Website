import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight, Grid, Filter } from 'lucide-react';

const Gallery = () => {
  const [galleryData, setGalleryData] = useState({ gallery: [], categories: [] });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/gallery');
      setGalleryData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load gallery. Please try again.');
      console.error('Error fetching gallery:', err);
      
      // Fallback mock data aligned to service categories
      const mockData = {
        gallery: [
          {
            id: 1,
            title: "Precision Haircut",
            category: "hair",
            image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Layered cut and blow-dry in our styling chair",
            featured: true
          },
          {
            id: 2,
            title: "Balayage & Highlights",
            category: "color",
            image: "https://images.pexels.com/photos/3993445/pexels-photo-3993445.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Custom coloring and lightening service",
            featured: true
          },
          {
            id: 3,
            title: "Bridal Makeup",
            category: "makeup",
            image: "https://images.pexels.com/photos/2741701/pexels-photo-2741701.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Event-ready bridal and party makeup",
            featured: true
          },
          {
            id: 4,
            title: "Luxury Facial Room",
            category: "facial",
            image: "https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Hydrating facial therapy setup",
            featured: false
          },
          {
            id: 5,
            title: "Massage & Spa",
            category: "massage",
            image: "https://images.pexels.com/photos/3865792/pexels-photo-3865792.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Full-body massage with aromatherapy oils",
            featured: true
          },
          {
            id: 6,
            title: "Body Scrub Ritual",
            category: "body",
            image: "https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Exfoliating body treatment and polish",
            featured: false
          },
          {
            id: 7,
            title: "Nail Care Lounge",
            category: "nails",
            image: "https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Manicure and pedicure services",
            featured: false
          },
          {
            id: 8,
            title: "Aromatherapy Setup",
            category: "aroma",
            image: "https://images.pexels.com/photos/965984/pexels-photo-965984.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Essential oils and diffuser for mood-balancing sessions",
            featured: false
          },
          {
            id: 9,
            title: "Salon Reception",
            category: "facility",
            image: "https://images.pexels.com/photos/962989/pexels-photo-962989.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            description: "Warm, professional welcome area for guests",
            featured: true
          }
        ],
        categories: [
          { id: "all", name: "All Photos", count: 9 },
          { id: "hair", name: "Hair Styling", count: 1 },
          { id: "color", name: "Hair Coloring", count: 1 },
          { id: "makeup", name: "Makeup & Beauty", count: 1 },
          { id: "facial", name: "Facial & Skincare", count: 1 },
          { id: "massage", name: "Massage & Spa", count: 1 },
          { id: "body", name: "Body Treatments", count: 1 },
          { id: "nails", name: "Nail Care", count: 1 },
          { id: "aroma", name: "Aromatherapy", count: 1 },
          { id: "facility", name: "Salon Facility", count: 1 }
        ]
      };
      setGalleryData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'all' 
    ? galleryData.gallery 
    : galleryData.gallery.filter(img => img.category === selectedCategory);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction) => {
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;
    
    setSelectedImage(filteredImages[newIndex]);
    setLightboxIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-gray-600 to-yellow-700">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874')" }}
        ></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Salon Gallery</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Take a visual journey through our tranquil facilities and treatments
          </p>
          <div className="mt-6 flex items-center text-white/80">
            <Grid className="w-5 h-5 mr-2" />
            <span>{galleryData.gallery.length} Photos</span>
            <span className="mx-3">•</span>
            <Filter className="w-5 h-5 mr-2" />
            <span>{galleryData.categories.length} Categories</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {galleryData.categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-gray-400 to-yellow-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id 
                    ? 'bg-white/30' 
                    : 'bg-gray-200'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchGalleryData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                onClick={() => openLightbox(image, index)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-gray-200 mb-3">{image.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase">
                        {image.category}
                      </span>
                      {image.featured && (
                        <span className="text-xs bg-yellow-600 px-3 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick View Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 text-white p-2 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No photos found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}

          {/* Gallery Stats */}
          <div className="mt-20 bg-gradient-to-r from-gray-100 to-yellow-50 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Gallery Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-gray-600 mb-2">{galleryData.gallery.length}</div>
                <div className="text-gray-600 font-medium">Total Photos</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-yellow-700 mb-2">
                  {galleryData.gallery.filter(img => img.featured).length}
                </div>
                <div className="text-gray-600 font-medium">Featured</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {galleryData.categories.length}
                </div>
                <div className="text-gray-600 font-medium">Categories</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-gray-700 mb-2">
                  {filteredImages.length}
                </div>
                <div className="text-gray-600 font-medium">Currently Viewing</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() => navigateLightbox(-1)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={() => navigateLightbox(1)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="max-w-6xl max-h-[90vh] w-full">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-2/3 bg-black flex items-center justify-center p-8">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                </div>

                {/* Info Panel */}
                <div className="lg:w-1/3 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedImage.title}</h2>
                  <p className="text-gray-600 mb-6">{selectedImage.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Category</h4>
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                        {selectedImage.category}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Status</h4>
                      <span className={`inline-block px-4 py-2 rounded-full font-medium ${
                        selectedImage.featured 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedImage.featured ? 'Featured Photo' : 'Regular Photo'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3">
                      Photo {lightboxIndex + 1} of {filteredImages.length}
                    </p>
                    <div className="flex space-x-2">
                      {filteredImages.slice(0, 5).map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => {
                            setSelectedImage(img);
                            setLightboxIndex(idx);
                          }}
                          className={`flex-1 h-1 rounded-full transition-all ${
                            idx === lightboxIndex ? 'bg-yellow-600' : 'bg-gray-300'
                          }`}
                          aria-label={`Go to photo ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;