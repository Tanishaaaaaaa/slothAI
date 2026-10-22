/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppTab } from './types/sloth.ts';
import { TopBar } from './components/TopBar.tsx';
import { HeroOverview } from './components/HeroOverview.tsx';
import { ChatCondenser } from './components/ChatCondenser.tsx';
import { FridgeScanner } from './components/FridgeScanner.tsx';
import { TidyDesk } from './components/TidyDesk.tsx';
import { WindDownCompanion } from './components/WindDownCompanion.tsx';
import { DevSubmissionBuilder } from './components/DevSubmissionBuilder.tsx';
import { ShieldCheck, Cpu, Wifi, WifiOff } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [isLocalOnly, setIsLocalOnly] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [energySavedMinutes, setEnergySavedMinutes] = useState<number>(45);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsLocalOnly(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQuickSlothMode = () => {
    setEnergySavedMinutes(prev => prev + 15);
    setIsLocalOnly(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-900/40 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickSlothMode={handleQuickSlothMode}
        isQuickModeActive={isLocalOnly}
      />

      {/* Main Viewport Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'overview' && (
          <HeroOverview
            onSelectTab={setActiveTab}
            isLocalOnly={isLocalOnly}
            onToggleLocal={() => setIsLocalOnly(!isLocalOnly)}
          />
        )}

        {activeTab === 'chat-condenser' && (
          <ChatCondenser isLocalOnly={isLocalOnly} />
        )}

        {activeTab === 'fridge-chef' && (
          <FridgeScanner isLocalOnly={isLocalOnly} />
        )}

        {activeTab === 'tidy-desk' && (
          <TidyDesk isLocalOnly={isLocalOnly} />
        )}

        {activeTab === 'wind-down' && (
          <WindDownCompanion isLocalOnly={isLocalOnly} />
        )}

        {activeTab === 'dev-submission' && (
          <DevSubmissionBuilder isLocalOnly={isLocalOnly} />
        )}
      </main>

      {/* Persistent Quiet Telemetry & Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-stone-300">SlothFlow</span>
            <span aria-hidden="true">·</span>
            <span>Hacktoberfest 2026: Week 3 (Slow & Steady)</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono text-amber-300">
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isOnline ? 'Network Active' : 'Offline Mode'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Sovereignty: 100% Client-Side Ready</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">|</span>
            <span className="text-stone-300 tabular-nums">
              Sloth Energy Saved: <strong className="text-amber-400 font-bold">{energySavedMinutes}m</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
