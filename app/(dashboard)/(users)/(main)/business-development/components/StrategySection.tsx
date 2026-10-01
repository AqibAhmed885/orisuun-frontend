import React from 'react';
import Toggle from '@/components/ui/toggle';
import { strategyColorMap, strategyOptions } from '@/data/dashboard/BusinessDevelopment';

interface StrategySectionProps {
  watchedStrategy: string;
  handleStrategyToggle: (strategy: string) => Promise<void>;
  error?: string;
}

const StrategySection: React.FC<StrategySectionProps> = ({
  watchedStrategy,
  handleStrategyToggle,
  error,
}) => (
  <div className="space-y-2">
    <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
      Strategy
    </h5>
    <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
      Choose the strategy
    </p>
    <div className="grid grid-cols-12 gap-2">
      {strategyOptions?.map((strategy, index) => {
        const selectedStyles = strategyColorMap[strategy] || {};
        return (
          <div key={index} className="col-span-12 md:col-span-6">
            <Toggle
              className="text-center"
              onClick={() => handleStrategyToggle(strategy)}
              selectedColor={`${selectedStyles.bg} ${selectedStyles.text} ${selectedStyles.border} border 2xl:text-scaled-h5 text-h9`}
              checked={watchedStrategy?.includes(strategy)}
              spanColor={selectedStyles.text}
              value={strategy}
            >
              {strategy}
            </Toggle>
          </div>
        );
      })}
    </div>
    {error && <p className="text-red-500">{error}</p>}
  </div>
);

export default StrategySection;