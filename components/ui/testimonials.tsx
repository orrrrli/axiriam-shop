'use client';

import { motion, type Variants } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
}

interface TestimonialSectionProps {
  title: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
}

export const TestimonialSection = ({
  title,
  subtitle,
  testimonials,
}: TestimonialSectionProps) => {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="w-full py-16 sm:py-24" style={{ background: '#f5f2ef' }}>
      <div className="mx-auto max-w-screen-xl px-8 sm:px-16 text-center">
        <h2
          className="font-bold tracking-tight"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(3.2rem, 4vw, 4.8rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#101010',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mx-auto mt-4 max-w-2xl"
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '1.55rem',
              color: 'rgba(16,16,16,0.52)',
              lineHeight: 1.65,
            }}
          >
            {subtitle}
          </p>
        )}

        <motion.div
          className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="relative overflow-hidden rounded-2xl shadow-sm"
              style={{ minHeight: '580px' }}
              variants={itemVariants}
            >
              <div className="relative w-full h-full" style={{ minHeight: '580px' }}>
                <Image
                  src={testimonial.imageSrc}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-left text-white">
                <Quote className="mb-4 h-10 w-10" style={{ color: 'rgba(255,255,255,0.4)' }} aria-hidden="true" />
                <blockquote
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: '1.55rem',
                    fontWeight: 400,
                    lineHeight: 1.65,
                  }}
                >
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-4">
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.3rem', fontWeight: 700 }}>
                    &mdash; {testimonial.name},
                    <span className="ml-1" style={{ fontWeight: 400, color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
                      {testimonial.role}
                    </span>
                  </p>
                </figcaption>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
