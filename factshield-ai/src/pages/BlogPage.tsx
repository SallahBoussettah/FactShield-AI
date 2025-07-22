import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Rise of AI-Generated Misinformation: What You Need to Know",
      excerpt: "As AI technology advances, so does its potential for creating sophisticated misinformation. Learn how to identify and protect yourself from AI-generated fake content.",
      author: "Dr. Sarah Chen",
      date: "January 15, 2025",
      readTime: "5 min read",
      category: "AI & Technology",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "How Social Media Algorithms Amplify Misinformation",
      excerpt: "Understanding the role of recommendation algorithms in spreading false information and what platforms are doing to combat this issue.",
      author: "Michael Rodriguez",
      date: "January 10, 2025",
      readTime: "7 min read",
      category: "Social Media",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Fact-Checking in the Digital Age: Tools and Techniques",
      excerpt: "A comprehensive guide to modern fact-checking methods and the technology behind automated verification systems.",
      author: "Aisha Johnson",
      date: "January 5, 2025",
      readTime: "6 min read",
      category: "Fact-Checking",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Building Media Literacy in Schools: A Practical Approach",
      excerpt: "How educators can teach students to critically evaluate information and develop strong media literacy skills.",
      author: "Dr. Sarah Chen",
      date: "December 28, 2024",
      readTime: "8 min read",
      category: "Education",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "The Psychology Behind Why We Believe Fake News",
      excerpt: "Exploring the cognitive biases and psychological factors that make people susceptible to misinformation.",
      author: "Dr. James Wilson",
      date: "December 20, 2024",
      readTime: "9 min read",
      category: "Psychology",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "FactShield AI: Behind the Scenes of Our Technology",
      excerpt: "A deep dive into the machine learning models and natural language processing techniques that power our fact-checking platform.",
      author: "Michael Rodriguez",
      date: "December 15, 2024",
      readTime: "10 min read",
      category: "Technology",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = ["All", "AI & Technology", "Social Media", "Fact-Checking", "Education", "Psychology", "Technology"];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">FactShield Blog</h1>
            <p className="text-xl text-[var(--color-neutral-600)] mb-8">
              Stay informed about the latest developments in fact-checking, AI technology, and the fight against misinformation.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-[var(--color-neutral-50)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All" 
                    ? "bg-[var(--color-primary)] text-white" 
                    : "bg-white text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-[var(--color-neutral-200)] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-[var(--color-neutral-500)] text-sm">Blog post image</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-100)] px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-[var(--color-neutral-500)]">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-[var(--color-neutral-600)] mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[var(--color-neutral-300)] rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{post.author}</p>
                        <p className="text-xs text-[var(--color-neutral-500)]">{post.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read More
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-[var(--color-neutral-50)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-[var(--color-neutral-600)] mb-8">
              Subscribe to our newsletter to get the latest insights on fact-checking and misinformation directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-[var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-sm text-[var(--color-neutral-500)] mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Fight Misinformation?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of users who are already using FactShield AI to navigate the information landscape with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-white"
                  size="lg"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/70">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BlogPage;