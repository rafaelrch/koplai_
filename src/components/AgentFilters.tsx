import React from 'react';

interface AgentFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const AgentFilters: React.FC<AgentFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    'Todos',
    'Instagram', 
    'Youtube',
    'Cliente',
    'Copywriting',
    'Marketing'
  ];

  return (
    <div className="mb-6 sm:mb-8">
      {/* Desktop filters */}
      <div className="hidden sm:flex gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              rounded-md border border-gray-300 px-4 py-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150
              ${activeFilter === filter
                ? 'text-black border-gray-300'
                : 'text-gray-400 border-gray-200 hover:text-black hover:border-gray-300'}
            `}
            style={{ background: 'transparent' }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Mobile filters with horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide touch-scroll custom-scrollbar -mx-4 px-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`
                rounded-xl border border-gray-200 px-5 py-2 text-base font-bold whitespace-nowrap transition-colors duration-150 flex-shrink-0
                ${activeFilter === filter
                  ? 'text-black border-gray-300'
                  : 'text-gray-400 border-gray-200 hover:text-black hover:border-gray-300'}
              `}
              style={{ background: 'transparent' }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
