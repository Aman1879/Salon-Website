import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const GalleryGrid = ({ images = [], categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

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
    <div className="gallery-container">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-gray-400 to-yellow-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <div 
            key={image.id} 
            className="gallery-item group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
            onClick={() => openLightbox(image, index)}
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={image.image || '/default-gallery.jpg'}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                <p className="text-sm text-gray-200 mb-3">{image.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    {image.category}
                  </span>
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Featured Badge */}
            {image.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
          <p className="text-gray-500">Try selecting a different category</p>
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

          <div className="max-w-6xl max-h-[90vh] flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Info Panel */}
            <div className="md:w-96 bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{selectedImage.title}</h2>
              <p className="text-gray-300 mb-6">{selectedImage.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Category</h4>
                  <span className="inline-block bg-yellow-600 text-white px-4 py-1 rounded-full text-sm">
                    {selectedImage.category}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Image Details</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Gallery ID: #{selectedImage.id}</p>
                    <p>Status: {selectedImage.featured ? 'Featured' : 'Regular'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  {lightboxIndex + 1} of {filteredImages.length} images
                </p>
                <div className="flex space-x-2 mt-3">
                  {filteredImages.slice(0, 5).map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setSelectedImage(img);
                        setLightboxIndex(idx);
                      }}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        idx === lightboxIndex ? 'bg-yellow-600' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;