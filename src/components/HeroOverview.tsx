import React from 'react';
import { AppTab } from '../types/sloth.ts';
import { MessageSquareText, UtensilsCrossed, FolderArchive, MoonStar, ArrowRight, ShieldCheck, Cpu, FlameKindling, ZapOff } from 'lucide-react';

interface HeroOverviewProps {
  onSelectTab: (tab: AppTab) => void;
  isLocalOnly: boolean;
  onToggleLocal: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  onSelectTab,
  isLocalOnly,
  onToggleLocal,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero 2-Column Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Metadata Text */}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>Hacktoberfest 2026 Challenge 4 of 5</span>
            <span aria-hidden="true">·</span>
            <span>Theme: Slow & Steady</span>
            <span aria-hidden="true">·</span>
            <span>International Sloth Day</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-100 leading-tight">
            Channel your inner sloth. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
              Let open-source AI do the work.
            </span>
          </h1>

          <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-2xl">
            This year&apos;s Hacktoberfest is about building with open-weight models that reward laziness. 
            SlothFlow eliminates the mundane friction you dread—from overnight group chat chaos to unorganized file clutter—keeping your data strictly on your machine.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectTab('chat-condenser')}
              className="px-5 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Condense Night Chatter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('dev-submission')}
              className="px-5 py-3 text-sm font-medium text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg transition-colors"
            >
              View DEV.to Submission
            </button>
          </div>

          {/* Inference Mode Switcher */}
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 max-w-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-stone-200">
                    Inference Engine: {isLocalOnly ? 'Local Open-Source (100% Offline)' : 'Hybrid Open-Weight Runner'}
                  </div>
                  <div className="text-xs text-stone-400">
                    {isLocalOnly
                      ? 'Zero network requests. Heuristics & local browser model weights.'
                      : 'Accelerated via server-side open weights (Gemma 2 / Gemini 3.8 Flash runner).'}
                  </div>
                </div>
              </div>
              <button
                onClick={onToggleLocal}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors whitespace-nowrap shrink-0"
              >
                {isLocalOnly ? 'Switch to Cloud' : 'Force Local'}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full h-80 sm:h-96 lg:h-full min-h-[340px] rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl">
            <img
              src="/src/assets/images/sloth_mascot_1792680118962.jpg"
              alt="SlothFlow Mascot relaxing on a branch"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-stone-900/80 backdrop-blur border border-stone-800">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">Sloth Philosophy</div>
              <div className="text-xs text-stone-300 mt-1 italic">
                &ldquo;Why rush through tasks that an open-weight model can solve in milliseconds while you nap?&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Metric Full-Width Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-stone-800/80">
        <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-800/60">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs uppercase font-mono tracking-wider">Privacy</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-100">0 KB</div>
          <div className="text-xs text-stone-400 mt-1">Data sent off-device in local mode</div>
        </div>

        <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-800/60">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ZapOff className="w-4 h-4" />
            <span className="text-xs uppercase font-mono tracking-wider">Friction Lost</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-100">185+ min</div>
          <div className="text-xs text-stone-400 mt-1">Average dread eliminated weekly</div>
        </div>

        <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-800/60">
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span className="text-xs uppercase font-mono tracking-wider">Cost</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-100">$0.00</div>
          <div className="text-xs text-stone-400 mt-1">Open-source & open weights forever</div>
        </div>

        <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-800/60">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <FlameKindling className="w-4 h-4" />
            <span className="text-xs uppercase font-mono tracking-wider">Pan Count</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-100">1 max</div>
          <div className="text-xs text-stone-400 mt-1">Strict limit on dirty dinner dishes</div>
        </div>
      </section>

      {/* 4 Thematic Bento Automation Cards */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-stone-100">The 4 Sloth Automations</h2>
          <p className="text-sm text-stone-400 mt-1">
            Hand off the four most dreaded daily mental chores to open-weight intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Chat Condenser */}
          <div
            onClick={() => onSelectTab('chat-condenser')}
            className="group cursor-pointer p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                Overnight Chatter Condenser
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Woke up to 180 unread messages in Discord or Slack? The agent extracts an honest 2-line summary, pulls out real action items, and silences pointless debates.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-4 border-t border-stone-800 text-stone-400 font-mono">
              <span>Bikeshed Drama Filter</span>
              <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Condenser →
              </span>
            </div>
          </div>

          {/* Card 2: Fridge Chef */}
          <div
            onClick={() => onSelectTab('fridge-chef')}
            className="group cursor-pointer p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                Lazy Fridge-to-Feast Scanner
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Never stand blankly staring into the fridge with the door open. Snap a photo or tap ingredients: AI plans low-effort, single-pan meals ready in under 10 minutes.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-4 border-t border-stone-800 text-stone-400 font-mono">
              <span>Strict 1-Pan Rule</span>
              <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Fridge Chef →
              </span>
            </div>
          </div>

          {/* Card 3: TidyDesk */}
          <div
            onClick={() => onSelectTab('tidy-desk')}
            className="group cursor-pointer p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                TidyDesk Procrastination Cleaner
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Automatically sorts chaotic desktop screenshots, tax PDFs, and unorganized downloads. Produces clean ISO renaming and a copy-paste 1-click bash script.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-4 border-t border-stone-800 text-stone-400 font-mono">
              <span>Automated Batch Script</span>
              <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open TidyDesk →
              </span>
            </div>
          </div>

          {/* Card 4: Wind-Down Companion */}
          <div
            onClick={() => onSelectTab('wind-down')}
            className="group cursor-pointer p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <MoonStar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                Offline Wind-Down & Soundscape
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Generates relaxing bedtime sloth tales with procedural browser Web Audio rain, pine wind, campfire crackle, and theta binaural beats. Zero internet required.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-4 border-t border-stone-800 text-stone-400 font-mono">
              <span>Web Audio API Procedural</span>
              <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Wind-Down →
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
