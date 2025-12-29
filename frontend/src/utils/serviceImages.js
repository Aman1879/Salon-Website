// Centralized, category-correct imagery for services
// Sources: Pexels/Unsplash free-to-use photos

const categoryImageMap = {
  hair: {
    src: 'https://images.pexels.com/photos/3992871/pexels-photo-3992871.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Professional haircut and hairstyling session'
  },
  color: {
    src: 'https://images.pexels.com/photos/3993445/pexels-photo-3993445.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Hair coloring and highlights in salon'
  },
  facial: {
    src: 'https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Facial treatment and skincare session'
  },
  skincare: {
    src: 'https://images.pexels.com/photos/5971881/pexels-photo-5971881.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Advanced skincare facial treatment'
  },
  nails: {
    src: 'https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Manicure and pedicure nail care'
  },
  massage: {
    src: 'https://images.pexels.com/photos/3865792/pexels-photo-3865792.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Relaxing massage therapy at spa'
  },
  body: {
    src: 'https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Body scrub and exfoliation treatment'
  },
  aroma: {
    src: 'https://images.pexels.com/photos/965984/pexels-photo-965984.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Aromatherapy essential oils and diffuser'
  },
  makeup: {
    src: 'https://images.pexels.com/photos/2741701/pexels-photo-2741701.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Professional makeup application for event'
  },
  spa: {
    src: 'https://images.pexels.com/photos/3865685/pexels-photo-3865685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Spa wellness and relaxation ambience'
  },
  default: {
    src: 'https://images.pexels.com/photos/3865675/pexels-photo-3865675.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    alt: 'Salon and spa service'
  }
};

const keywordCategoryMap = [
  { category: 'hair', regex: /(haircut|hair cut|styling|blow|trim|keratin|smooth|bridal|party)/i },
  { category: 'color', regex: /(color|colour|highlight|balayage|root)/i },
  { category: 'facial', regex: /(facial|skin care|skincare|glow|radiance)/i },
  { category: 'skincare', regex: /(anti[- ]?aging|pigmentation|acne)/i },
  { category: 'nails', regex: /(manicure|pedicure|nail)/i },
  { category: 'massage', regex: /(massage|deep tissue|stone|therapy)/i },
  { category: 'body', regex: /(body scrub|detox|wrap|rejuvenation)/i },
  { category: 'aroma', regex: /(aroma|essential oil)/i },
  { category: 'makeup', regex: /(makeup|make-over|bridal)/i },
  { category: 'spa', regex: /(spa|wellness|relax)/i }
];

const normalizeCategory = (category) => {
  if (!category) return null;
  const key = category.toLowerCase();
  if (categoryImageMap[key]) return key;
  return null;
};

const pickCategoryFromName = (name = '') => {
  for (const entry of keywordCategoryMap) {
    if (entry.regex.test(name)) return entry.category;
  }
  return null;
};

export const getServiceImage = (service = {}) => {
  const serviceName = service.name || 'Salon service';

  // Use explicit remote images when provided
  if (service.image && service.image.startsWith('http')) {
    return { src: service.image, alt: `${serviceName} service` };
  }

  const categoryKey = normalizeCategory(service.category) || pickCategoryFromName(serviceName) || 'default';
  const mapped = categoryImageMap[categoryKey] || categoryImageMap.default;

  // If a local path exists but mapped is available, prefer mapped to keep category correctness
  const src = mapped.src || service.image || categoryImageMap.default.src;
  const alt = mapped.alt || `${serviceName} service`;

  return { src, alt };
};

export default categoryImageMap;
