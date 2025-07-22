import React from 'react';
import Button from './Button';

const HeroSection: React.FC = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Container query wrapper */}
            <div className="container-type:inline-size max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 @container-lg:grid-cols-2 gap-8 items-center py-12 @container-lg:py-24">
                    {/* Hero content */}
                    <div className="space-y-6 @container-lg:pr-8">
                        <h1 className="text-4xl @container-md:text-5xl @container-lg:text-6xl font-bold text-[var(--color-neutral-900)]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                                Fact-check
                            </span>{' '}
                            content in real-time with AI
                        </h1>

                        <p className="text-lg @container-md:text-xl text-[var(--color-neutral-600)] max-w-xl">
                            FactShield AI uses cutting-edge natural language processing to identify and flag potentially misleading content as you browse the web.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button
                                size="lg"
                                rightIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                }
                            >
                                Get Started Free
                            </Button>
                            <Button variant="outline" size="lg">
                                See How It Works
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-[var(--color-neutral-200)] border-2 border-white overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-neutral-300)] to-[var(--color-neutral-400)]"></div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-[var(--color-neutral-600)]">
                                <span className="font-semibold">5,000+</span> users already trust FactShield
                            </p>
                        </div>
                    </div>

                    {/* 3D animated illustration */}
                    <div className="relative @container-lg:h-[500px] flex items-center justify-center">
                        <div className="relative w-full max-w-md mx-auto">
                            {/* Main illustration with 3D transforms */}
                            <div
                                className="w-full aspect-square bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl shadow-xl 
                          transform rotate-y-12 rotate-x-12 perspective-1000 transition-transform duration-700 ease-out
                          hover:rotate-y-6 hover:rotate-x-6 hover:scale-105
                          @starting-style:opacity-0 @starting-style:translate-y-12 @starting-style:rotate-y-24 @starting-style:rotate-x-24
                          animate-in fade-in slide-in-from-bottom duration-1000"
                            >
                                {/* Shield icon */}
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32 opacity-90">
                                        <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.75v4.5a13.25 13.25 0 0 1-3.965 9.5 13.04 13.04 0 0 1-3.27 2.28 8.99 8.99 0 0 1-1.88.75.75.75 0 0 1-.5 0 8.99 8.99 0 0 1-1.88-.75 13.04 13.04 0 0 1-3.27-2.28 13.25 13.25 0 0 1-3.965-9.5v-4.5a.75.75 0 0 1 .721-.75 11.208 11.208 0 0 0 7.878-3.08ZM10.5 10.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V10.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute top-1/4 -left-8 w-16 h-16 bg-white rounded-lg shadow-lg 
                            transform rotate-y-12 rotate-x-6 perspective-1000
                            animate-float-slow
                            @starting-style:opacity-0 @starting-style:translate-y-8
                            animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                                <div className="flex items-center justify-center h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[var(--color-primary)]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-1/4 -right-8 w-16 h-16 bg-white rounded-lg shadow-lg 
                            transform rotate-y-12 rotate-x-6 perspective-1000
                            animate-float
                            @starting-style:opacity-0 @starting-style:translate-y-8
                            animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                                <div className="flex items-center justify-center h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[var(--color-secondary)]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 left-1/4 w-20 h-20 bg-white rounded-lg shadow-lg 
                            transform rotate-y-12 rotate-x-6 perspective-1000
                            animate-float-slow
                            @starting-style:opacity-0 @starting-style:translate-y-8
                            animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
                                <div className="flex items-center justify-center h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--color-neutral-700)]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[var(--color-secondary)] opacity-5 rounded-full blur-3xl"></div>
        </section>
    );
};

export default HeroSection;