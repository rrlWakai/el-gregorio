import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviewsService } from '@/services/reviews';
import type { Review } from '@/types';

const fallbackReviews: Review[] = [
  {
    id: '1',
    guest_name: 'Maria Santos',
    avatar_url: null,
    rating: 5,
    review_text:
      'We had a great family outing here. The place is peaceful and the pool is clean. The kids loved it and we will definitely come back!',
    is_visible: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    guest_name: 'John Ramirez',
    avatar_url: null,
    rating: 5,
    review_text:
      'Perfect place for team building. The staff were very accommodating and the facilities were excellent. Highly recommend for corporate events.',
    is_visible: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    guest_name: 'Angela Cruz',
    avatar_url: null,
    rating: 5,
    review_text:
      'We celebrated a birthday here and the environment was very refreshing. The farm atmosphere made it extra special. Wonderful experience!',
    is_visible: true,
    sort_order: 3,
    created_at: '',
    updated_at: '',
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover 
                 transition-shadow duration-300 flex flex-col gap-5"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-accent/40" />

      {/* Review text */}
      <p className="font-body text-gray-600 text-sm leading-relaxed flex-1">
        {review.review_text}
      </p>

      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating
                ? 'text-accent fill-accent'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Reviewer */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        {review.avatar_url ? (
          <img
            src={review.avatar_url}
            alt={review.guest_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center 
                          justify-center flex-shrink-0">
            <span className="font-body text-sm font-semibold text-primary">
              {getInitials(review.guest_name)}
            </span>
          </div>
        )}
        <div>
          <p className="font-body text-sm font-semibold text-gray-900">
            {review.guest_name}
          </p>
          <p className="font-body text-xs text-gray-400">Verified Guest</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    reviewsService.getVisibleReviews().then(({ data }) => {
      if (data && data.length > 0) setReviews(data);
    });
  }, []);

  return (
    <section id="reviews" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-accent/15 text-accent-600 px-4 py-1.5 
                           rounded-full font-body text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="section-title mb-4">Guest Reviews</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Hear from our guests about their unforgettable experiences at 
            El Gregorio Farm Resort.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
