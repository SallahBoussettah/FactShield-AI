import React from 'react';

interface AIModel {
  id: string;
  name: string;
  type: 'claim-extraction' | 'credibility-assessment' | 'source-verification' | 'translation';
  version: string;
  status: 'active' | 'disabled';
  confidence: number;
  description: string;
}

interface AIModelCardProps {
  model: AIModel;
  onToggleStatus: (modelId: string) => void;
  onConfigure: (modelId: string) => void;
}

const AIModelCard: React.FC<AIModelCardProps> = ({ model, onToggleStatus, onConfigure }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[var(--color-neutral-200)]">
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
            {model.type === 'claim-extraction' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
            {model.type === 'credibility-assessment' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            {model.type === 'source-verification' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            {model.type === 'translation' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">
              {model.name}
            </h3>
            <p className="text-sm text-[var(--color-neutral-500)] capitalize">
              {model.type.replace('-', ' ')} • v{model.version}
            </p>
          </div>
        </div>
        <span className={`
          px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${model.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
          }
        `}>
          {model.status}
        </span>
      </div>
      
      <div className="px-5 py-3 border-t border-[var(--color-neutral-200)]">
        <p className="text-sm text-[var(--color-neutral-600)]">
          {model.description}
        </p>
      </div>
      
      <div className="px-5 py-3 border-t border-[var(--color-neutral-200)]">
        <div className="flex items-center">
          <div className="text-xs font-medium text-[var(--color-neutral-700)] mr-2">
            Confidence:
          </div>
          <div className="flex-grow">
            <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${model.confidence * 100}%`,
                  backgroundColor: model.confidence > 0.8 
                    ? 'var(--color-secondary)' 
                    : model.confidence > 0.6 
                      ? 'var(--color-warning)' 
                      : 'var(--color-danger)'
                }}
              ></div>
            </div>
          </div>
          <div className="ml-2 text-xs text-[var(--color-neutral-500)]">
            {Math.round(model.confidence * 100)}%
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] flex justify-end space-x-2">
        <button
          onClick={() => onConfigure(model.id)}
          className="inline-flex items-center px-3 py-1 border border-[var(--color-neutral-300)] rounded-md shadow-sm text-xs font-medium text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-100)]"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configure
        </button>
        <button
          onClick={() => onToggleStatus(model.id)}
          className={`
            inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white
            ${model.status === 'active'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {model.status === 'active' ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
};

export default AIModelCard;