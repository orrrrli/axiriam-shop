'use client';

import React from 'react';
import { TestimonialSection, type TestimonialItem } from '@/components/ui/testimonials';

interface TestimonialsProps {
  title: string;
  items: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;
}

// Pexels healthcare images for each testimonial
const TESTIMONIAL_IMAGES = [
  'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6551076/pexels-photo-6551076.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3760137/pexels-photo-3760137.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function EstudioTestimonials({ title, items }: TestimonialsProps): React.ReactElement {
  const mapped: TestimonialItem[] = items.map((item, i) => ({
    id: i + 1,
    quote: item.text,
    name: item.name,
    role: item.role,
    imageSrc: TESTIMONIAL_IMAGES[i] ?? TESTIMONIAL_IMAGES[0],
  }));

  return (
    <TestimonialSection
      title={title}
      testimonials={mapped}
    />
  );
}
