import React from 'react';

// Define feature data structure
interface Feature {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const FeatureShowcase: React.FC = () => {
    // Feature data with SVG icons
    const features: Feature[] = [
        {
            id: 'real-time',
            title: 'Real-time Analysis',
            description: 'Analyze content as you browse with our powerful AI engine that works in milliseconds.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            color: '#4f46e5' // Indigo color for primary
        },
        {
            id: 'claim-detection',
            title: 'Claim Detection',
            description: 'Automatically identify factual claims in articles, social media posts, and documents.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            ),
            color: '#06b6d4' // Cyan color for secondary
        },
        {
            id: 'source-verification',
            title: 'Source Verification',
            description: 'Cross-reference claims with trusted sources to verify accuracy and provide context.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
            ),
            color: '#f59e0b' // Amber color for warning
        },
        {
            id: 'browser-extension',
            title: 'Browser Extension',
            description: 'Seamlessly integrate fact-checking into your browsing experience with our extension.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19 3 14.775V19.5h18v-4.725L17.885 5.19A1.5 1.5 0 0 0 16.5 4.5h-9a1.5 1.5 0 0 0-1.385.69ZM13.5 10.5h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75Zm-6.75 3h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75Zm8.25-4.5h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75Z" />
                </svg>
            ),
            color: '#4f46e5' // Indigo color for primary
        },
        {
            id: 'multilingual',
            title: 'Multilingual Support',
            description: 'Analyze content in multiple languages with our advanced translation capabilities.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                </svg>
            ),
            color: '#06b6d4' // Cyan color for secondary
        },
        {
            id: 'analytics',
            title: 'Personal Analytics',
            description: 'Track your exposure to misinformation over time with detailed analytics and reports.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
            ),
            color: '#f59e0b' // Amber color for warning
        }
    ];

    return (
        <section className="py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-[var(--color-neutral-800)]">
                    Powerful Features
                </h2>
                <p className="text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto">
                    FactShield AI provides cutting-edge tools to help you identify and combat misinformation in real-time.
                </p>
            </div>

            {/* Feature Cards Grid with Container Queries */}
            <div className="container-type-inline-size">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cq-sm:gap-4 cq-md:gap-6 cq-lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-500 hover:shadow-md
                         transform-style-3d hover:rotate-y-2 hover:rotate-x-2
                         starting:opacity-0 starting:translate-y-8 starting:scale-95
                         animate-in fade-in slide-in-from-bottom duration-500
                         flex flex-col h-full"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="p-6 flex-grow">
                                <div
                                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                                    style={{
                                        backgroundColor: `rgba(${feature.id === 'real-time' || feature.id === 'browser-extension' ? '79, 70, 229' :
                                            feature.id === 'claim-detection' || feature.id === 'multilingual' ? '6, 182, 212' :
                                                '245, 158, 11'}, 0.1)`
                                    }}
                                >
                                    <div style={{ color: feature.color }}>
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-[var(--color-neutral-800)]">{feature.title}</h3>
                                <p className="text-[var(--color-neutral-600)]">{feature.description}</p>
                            </div>
                            <div className="h-1.5 w-full mt-auto" style={{ backgroundColor: feature.color }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Feature Highlight */}
            <div className="mt-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 text-white
                    transition-all duration-500
                    starting:opacity-0 starting:scale-95
                    animate-in fade-in duration-700 delay-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Browser Extension</h3>
                        <p className="mb-6">
                            Our browser extension seamlessly integrates with your browsing experience, providing real-time fact-checking as you navigate the web.
                        </p>
                        <ul className="space-y-2">
                            {[
                                'Instant analysis of web content',
                                'Visual highlighting of questionable claims',
                                'One-click access to verification sources',
                                'Customizable notification settings'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <div className="perspective-[1000px] w-64 h-64">
                            <div className="relative w-full h-full transform-style-3d animate-spin-slow">
                                <div className="absolute inset-0 bg-[color-mix(in_srgb,white,transparent_90%)] border-2 border-[color-mix(in_srgb,white,transparent_70%)] rounded-lg transform rotate-y-0 translate-z-32"></div>
                                <div className="absolute inset-0 bg-[color-mix(in_srgb,white,transparent_90%)] border-2 border-[color-mix(in_srgb,white,transparent_70%)] rounded-lg transform rotate-y-90 translate-z-32"></div>
                                <div className="absolute inset-0 bg-[color-mix(in_srgb,white,transparent_90%)] border-2 border-[color-mix(in_srgb,white,transparent_70%)] rounded-lg transform rotate-y-180 translate-z-32"></div>
                                <div className="absolute inset-0 bg-[color-mix(in_srgb,white,transparent_90%)] border-2 border-[color-mix(in_srgb,white,transparent_70%)] rounded-lg transform rotate-y-270 translate-z-32"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureShowcase;