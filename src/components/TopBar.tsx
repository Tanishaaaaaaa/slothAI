import React from 'react';
import { AppTab } from '../types/sloth.ts';

interface TopBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onQuickSlothMode: () => void;
  isQuickModeActive: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onQuickSlothMode,
  isQuickModeActive,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onTabChange('overview')}
        className="text-lg font-bold tracking-tight text-amber-100 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
      >
        <span className="text-xl">🦥</span>
        <span>SlothFlow</span>
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-400">
        <button
          onClick={() => onTabChange('chat-condenser')}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'chat-condenser' ? 'text-amber-300 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Chat Condenser
        </button>
        <button
          onClick={() => onTabChange('fridge-chef')}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'fridge-chef' ? 'text-amber-300 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Lazy Fridge Chef
        </button>
        <button
          onClick={() => onTabChange('tidy-desk')}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'tidy-desk' ? 'text-amber-300 font-semibold underline underline-offset-8' : ''
          }`}
        >
          TidyDesk
        </button>
        <button
          onClick={() => onTabChange('wind-down')}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'wind-down' ? 'text-amber-300 font-semibold underline underline-offset-8' : ''
          }`}
        >
          Wind-Down Soundscape
        </button>
        <button
          onClick={() => onTabChange('dev-submission')}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'dev-submission' ? 'text-amber-300 font-semibold underline underline-offset-8' : ''
          }`}
        >
          DEV Submission
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onQuickSlothMode}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            isQuickModeActive
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'bg-stone-800 text-amber-200 hover:bg-stone-700 border border-stone-700'
          }`}
        >
          <span>{isQuickModeActive ? 'Energy Conserved' : 'Conserve Energy'}</span>
        </button>
      </div>
    </header>
  );
};
