import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Journalist",
    company: "Global News Network",
    content: "FactShield AI has completely transformed how I verify information for my articles. The browser extension saves me hours of research time and helps me maintain the highest standards of journalistic integrity.",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Professor",
    company: "University of Technology",
    content: "I recommend FactShield AI to all my students. In an era of rampant misinformation, this tool has become essential for academic research and critical thinking development.",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Content Strategist",
    company: "Digital Marketing Solutions",
    content: "Our content team relies on FactShield AI daily. It helps us create trustworthy content that builds credibility with our audience and stands out in a crowded digital landscape.",
    avatar: "https://i.pravatar.cc/150?img=25"
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Research Analyst",
    company: "Policy Institute",
    content: "The accuracy and speed of FactShield AI are unmatched. It's become an indispensable tool for our policy research, helping us base recommendations on verified information.",
    avatar: "https://i.pravatar.cc/150?img=53"
  }
];

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-12 text-center text-[var(--color-neutral-800)]">
        What Our Users Say
      </h2>

      {/* Mobile Testimonial Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out" 
               style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover mb-4"
                  />
                  <p className="text-[var(--color-neutral-600)] mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-[var(--color-neutral-500)]">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center mt-6 gap-2">
          <button 
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-[var(--color-neutral-100)]"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-[var(--color-neutral-100)]"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === activeIndex 
                  ? 'bg-[var(--color-primary)]' 
                  : 'bg-[var(--color-neutral-300)]'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Testimonial Grid */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full animate-fade-in"
            style={{ animationDelay: `${testimonial.id * 150}ms` }}
          >
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-[var(--color-neutral-500)]">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
            <p className="text-[var(--color-neutral-600)] flex-grow">"{testimonial.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;