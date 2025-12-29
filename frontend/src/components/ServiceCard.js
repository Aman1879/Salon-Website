import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Sparkles } from 'lucide-react';
import { getServiceImage } from '../utils/serviceImages';

const ServiceCard = ({ service }) => {
  const image = getServiceImage(service);

  return (
    <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image.src} 
          alt={image.alt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            // Fallback to a generic service-safe image
            e.target.src = 'https://images.pexels.com/photos/3865675/pexels-photo-3865675.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop';
          }}
          loading="lazy"
        />
        
        {/* Popular Badge */}
        {service.popular && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-gray-400 to-yellow-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Popular
            </span>
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white flex items-center justify-between">
            <div>
              <div className="font-bold text-xl">{service.name}</div>
              <div className="text-sm opacity-90">{service.category}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹{service.price.toLocaleString('en-IN')}</div>
              <div className="text-sm opacity-90 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {service.duration} min
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-6 line-clamp-2">
          {service.description}
        </p>
        
        {/* Features */}
        {service.features && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {service.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Rating */}
        {service.rating && (
          <div className="flex items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {service.rating} ({service.reviews || '50+'} reviews)
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            to={`/booking?service=${encodeURIComponent(service.name)}`}
            className="flex-1 bg-gradient-to-r from-gray-400 to-yellow-600 text-white py-3 rounded-xl font-semibold text-center hover:from-gray-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
          >
            Book Now
          </Link>
          <Link 
            to={`/services`}
            className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-yellow-600 hover:text-yellow-700 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;