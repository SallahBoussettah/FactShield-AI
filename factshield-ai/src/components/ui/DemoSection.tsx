import React, { useState } from 'react';
import Button from './Button';

// Define the tab data structure
interface DemoTab {
  id: string;
  label: string;
  content: {
    before: string;
    after: string;
    highlights: Array<{
      text: string;
      credibility: 'high' | 'medium' | 'low';
      explanation: string;
    }>;
  };
}

const DemoSection: React.FC = () => {
  // Define demo tabs with different use cases
  const demoTabs: DemoTab[] = [
    {
      id: 'news',
      label: 'News Articles',
      content: {
        before: `Climate scientists say that the recent extreme weather events are completely natural and not related to human activity. A recent study found no evidence linking carbon emissions to global warming trends observed over the past century.`,
        after: `Climate scientists say that the recent extreme weather events are completely natural and not related to human activity. A recent study found no evidence linking carbon emissions to global warming trends observed over the past century.`,
        highlights: [
          {
            text: 'Climate scientists say that the recent extreme weather events are completely natural and not related to human activity.',
            credibility: 'low',
            explanation: 'Multiple peer-reviewed studies and the IPCC have concluded that human activity is contributing to extreme weather events.'
          },
          {
            text: 'A recent study found no evidence linking carbon emissions to global warming trends observed over the past century.',
            credibility: 'low',
            explanation: 'The scientific consensus, based on thousands of studies, confirms that carbon emissions are a primary driver of observed warming trends.'
          }
        ]
      }
    },
    {
      id: 'social',
      label: 'Social Media',
      content: {
        before: `BREAKING: New miracle supplement reverses aging by 20 years in just one month! Scientists are shocked by the results. Big pharma doesn't want you to know about this natural solution that costs just pennies a day!`,
        after: `BREAKING: New miracle supplement reverses aging by 20 years in just one month! Scientists are shocked by the results. Big pharma doesn't want you to know about this natural solution that costs just pennies a day!`,
        highlights: [
          {
            text: 'New miracle supplement reverses aging by 20 years in just one month!',
            credibility: 'low',
            explanation: 'No scientifically validated supplement has been shown to reverse aging to this degree. Claims of dramatic anti-aging effects are typically exaggerated.'
          },
          {
            text: 'Scientists are shocked by the results.',
            credibility: 'low',
            explanation: 'Vague references to unnamed "shocked scientists" is a common tactic in misleading health claims.'
          },
          {
            text: 'Big pharma doesn\'t want you to know about this natural solution',
            credibility: 'low',
            explanation: 'Conspiracy narratives about "hidden cures" are common in health misinformation and lack evidence.'
          }
        ]
      }
    },
    {
      id: 'health',
      label: 'Health Claims',
      content: {
        before: `Studies show that drinking lemon water on an empty stomach every morning can help detoxify your body, boost your immune system, and help you lose weight quickly. It's also been proven to prevent cancer and heart disease.`,
        after: `Studies show that drinking lemon water on an empty stomach every morning can help detoxify your body, boost your immune system, and help you lose weight quickly. It's also been proven to prevent cancer and heart disease.`,
        highlights: [
          {
            text: 'drinking lemon water on an empty stomach every morning can help detoxify your body',
            credibility: 'low',
            explanation: 'The human body has its own detoxification systems (liver and kidneys). No scientific evidence supports the claim that lemon water "detoxifies" the body.'
          },
          {
            text: 'help you lose weight quickly',
            credibility: 'medium',
            explanation: 'While staying hydrated can support weight management, and replacing sugary drinks with water may help reduce calorie intake, lemon water itself has no significant effect on weight loss speed.'
          },
          {
            text: 'proven to prevent cancer and heart disease',
            credibility: 'low',
            explanation: 'No scientific evidence supports that lemon water prevents cancer or heart disease. While citrus fruits contain beneficial compounds, they are not proven preventative treatments.'
          }
        ]
      }
    }
  ];

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>(demoTabs[0].id);
  
  // Get current tab content
  const currentTab = demoTabs.find(tab => tab.id === activeTab) || demoTabs[0];
  
  // State for showing analysis
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  // Function to highlight text with different colors based on credibility
  const renderHighlightedText = (text: string, highlights: DemoTab['content']['highlights']) => {
    let result = text;
    
    // Replace text with highlighted spans
    highlights.forEach(highlight => {
      const credibilityColor = {
        high: 'bg-green-100 border-b-2 border-green-500',
        medium: 'bg-yellow-100 border-b-2 border-yellow-500',
        low: 'bg-red-100 border-b-2 border-red-500'
      }[highlight.credibility];
      
      const highlightedText = `<span class="${credibilityColor} relative group cursor-help">
        ${highlight.text}
        <span class="absolute bottom-full left-0 w-64 bg-white p-2 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          ${highlight.explanation}
        </span>
      </span>`;
      
      result = result.replace(highlight.text, highlightedText);
    });
    
    return result;
  };

  return (
    <section className="py-16 bg-[var(--color-neutral-100)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-neutral-800)]">
            See FactShield AI in Action
          </h2>
          <p className="text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto">
            Experience how our AI identifies and analyzes potentially misleading content in real-time.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {demoTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAnalysis(false);
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Demo Header */}
          <div className="bg-[var(--color-neutral-800)] p-4 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-white text-sm flex-grow text-center">
              {showAnalysis ? 'FactShield AI Analysis Results' : 'Content Before Analysis'}
            </div>
          </div>

          {/* Demo Content */}
          <div className="p-6 min-h-[300px]">
            {/* Before/After Toggle */}
            <div className="flex justify-end mb-4">
              <div className="bg-[var(--color-neutral-100)] rounded-full p-1 flex">
                <button
                  onClick={() => setShowAnalysis(false)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    !showAnalysis
                      ? 'bg-white shadow-sm'
                      : 'text-[var(--color-neutral-600)]'
                  }`}
                >
                  Before
                </button>
                <button
                  onClick={() => setShowAnalysis(true)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    showAnalysis
                      ? 'bg-white shadow-sm'
                      : 'text-[var(--color-neutral-600)]'
                  }`}
                >
                  After Analysis
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-lg p-4 border border-[var(--color-neutral-200)]">
              {!showAnalysis ? (
                <div className="prose max-w-none">
                  <p>{currentTab.content.before}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ 
                      __html: renderHighlightedText(
                        currentTab.content.after, 
                        currentTab.content.highlights
                      ) 
                    }} 
                  />
                  
                  <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)]">
                    <h3 className="text-lg font-semibold mb-3">Analysis Summary</h3>
                    <div className="space-y-3">
                      {currentTab.content.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            highlight.credibility === 'low' ? 'bg-red-500' :
                            highlight.credibility === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}>
                            {highlight.credibility === 'low' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                            ) : highlight.credibility === 'medium' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">"{highlight.text}"</p>
                            <p className="text-sm text-[var(--color-neutral-600)]">{highlight.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              {!showAnalysis ? (
                <Button 
                  onClick={() => setShowAnalysis(true)}
                  rightIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  }
                >
                  Analyze Content
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => setShowAnalysis(false)}
                >
                  Reset Demo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-2 text-[var(--color-neutral-700)]">Credibility Indicators</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">Low Credibility</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm">Medium Credibility</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">High Credibility</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;