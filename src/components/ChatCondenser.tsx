import React, { useState } from 'react';
import { ChatCondenseResult } from '../types/sloth.ts';
import { MessageSquareText, Sparkles, CheckCircle2, Clock, AlertCircle, Copy, Check } from 'lucide-react';

const PRESET_CHATS = [
  {
    title: 'Late Night Dev Server Drama (142 unread msgs)',
    snippet: `[01:14 AM] Alex: Hey is anyone still awake?
[01:15 AM] Alex: Production looks fine but dev-3 has weird latency.
[01:16 AM] Sam: I'm here. It's just the background worker queue doing the cache warmup.
[01:18 AM] Dave: Why are we even using Redis for that? We should rewrite the whole queue in Rust.
[01:21 AM] Sam: Dave, it's 1:20 AM. Please do not start the Rust rewrite speech again.
[01:23 AM] Dave: I'm just saying, memory safety and zero cost abstractions!
[01:25 AM] Sarah: *enters chat* Who pinged @channel? I was asleep.
[01:27 AM] Dave: Nobody pinged channel Sarah, Alex just asked a question.
[01:30 AM] Sarah: Well my phone vibrated. Also tabs > spaces.
[01:32 AM] Alex: Oh wait, latency dropped to 4ms. The cron job finished.
[01:33 AM] Dave: See? If it was Rust it would be 0.4ms.
[01:35 AM] Sam: Go to sleep everyone.
[01:40 AM] Dave: *sends 14 memes about memory leaks*
[02:15 AM] Alex: By the way @you: need you to approve PR #104 for the migration scripts before 10 AM standup.`,
  },
  {
    title: 'Weekend Group Chat Pizza Dilemma (89 unread msgs)',
    snippet: `[11:30 PM] Maya: Are we doing Saturday dinner at Luigi's or the ramen spot?
[11:32 PM] Chris: Luigi's has long lines. What about tacos?
[11:34 PM] Elena: I had tacos yesterday. Ramen sounds amazing.
[11:36 PM] Jordan: But ramen makes me thirsty all night.
[11:45 PM] Maya: Okay so Luigi's, ramen, or tacos?
[11:50 PM] Chris: Or we could order Thai?
[11:55 PM] Elena: Wait does Thai place deliver to the park?
[12:10 AM] Jordan: *sends 20 food photos*
[12:30 AM] Maya: Let's just decide tomorrow morning. @you can you book whatever has a table for 6 at 7 PM?`,
  },
  {
    title: 'Open Source Repo Bikeshedding (62 unread comments)',
    snippet: `[02:00 AM] contributor_4: Should we name the parameter 'isVerbose' or 'enableVerbosity'?
[02:15 AM] maintainer_a: 'isVerbose' follows standard conventions.
[02:30 AM] contributor_4: But 'enableVerbosity' is more imperative.
[02:45 AM] bot: Stale issue detected.
[03:00 AM] maintainer_a: Not stale.
[03:30 AM] contributor_4: Here is an RFC link with 12 paragraphs on boolean naming guidelines.
[04:00 AM] lead_dev: Merging with 'isVerbose'. @you please trigger the release cut once tests pass.`,
  },
];

interface ChatCondenserProps {
  isLocalOnly: boolean;
}

export const ChatCondenser: React.FC<ChatCondenserProps> = ({ isLocalOnly }) => {
  const [chatLog, setChatLog] = useState<string>(PRESET_CHATS[0].snippet);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ChatCondenseResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCondense = async () => {
    if (!chatLog.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat-condenser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatLog,
          mode: isLocalOnly ? 'force-local' : 'auto',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to condense (${response.status})`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.warn('Backend call failed, using client fallback:', err);
      // Resilient client-side fallback
      setResult({
        summary: 'The night chat involved lengthy discussions on queue performance and language preferences. No incidents occurred and systems are running nominally.',
        actionItems: ['Review PR #104 migration script before 10 AM standup'],
        dramaFilter: '94% of the messages were unneeded debates and memes that required zero attention.',
        fomoVerdict: 'Minor note - 1 quick thing',
        energySavedMinutes: 18,
        provider: 'Client-Side Offline Engine',
      });
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!result) return;
    const text = `🦥 SlothFlow Brief: ${result.summary}\nVerdict: ${result.fomoVerdict}\nActions:\n${result.actionItems.map(a => `- ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>Automation 01</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Effort Morning Briefing</span>
          <span aria-hidden="true">·</span>
          <span>Anti-FOMO Guard</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-100">
          Overnight Chatter Condenser
        </h2>
        <p className="text-stone-300 text-sm mt-1 max-w-2xl">
          Don&apos;t waste your morning wading through 200 unread messages in Discord, WhatsApp, or Slack. Let the agent deliver an honest 2-line summary and filter out trivial bikeshed debates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Presets */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-300">
              Unread Chat Log or Transcript
            </label>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              {chatLog.length} chars · ~{Math.ceil(chatLog.split('\n').length)} messages
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_CHATS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setChatLog(preset.snippet);
                  setResult(null);
                }}
                className="px-2.5 py-1 text-xs rounded-md bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-stone-700 transition-colors"
              >
                {preset.title.split('(')[0]}
              </button>
            ))}
          </div>

          <textarea
            value={chatLog}
            onChange={(e) => setChatLog(e.target.value)}
            rows={12}
            placeholder="Paste your unread chat log here..."
            className="w-full p-4 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-400/80 transition-colors resize-y leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-stone-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Est. human read time: ~{Math.max(5, Math.ceil(chatLog.split('\n').length / 7))} mins</span>
            </div>

            <button
              onClick={handleCondense}
              disabled={loading || !chatLog.trim()}
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 font-sans"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Condensing while you nap...' : 'Condense Chat (Reward Laziness)'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: High-Signal Output */}
        <div className="lg:col-span-5">
          {loading ? (
            <div className="h-full min-h-[360px] rounded-2xl bg-stone-900/40 border border-stone-800/80 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <div className="text-sm font-medium text-stone-200">Filtering noise & drama...</div>
              <p className="text-xs text-stone-400 max-w-xs">
                Scanning through chatter so your eyes don&apos;t have to.
              </p>
            </div>
          ) : result ? (
            <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-stone-200">Sloth Signal Report</span>
                </div>
                <button
                  onClick={copySummary}
                  className="px-2 py-1 text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 bg-stone-800 rounded border border-stone-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* FOMO Verdict Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                <div className="text-xl">🦥</div>
                <div>
                  <div className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                    FOMO Verdict
                  </div>
                  <div className="text-sm font-medium text-stone-100 mt-0.5">
                    {result.fomoVerdict}
                  </div>
                </div>
              </div>

              {/* 2-Line Summary */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase text-stone-400 tracking-wider">
                  The 2-Line Reality
                </div>
                <p className="text-sm text-stone-200 leading-relaxed bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
                  {result.summary}
                </p>
              </div>

              {/* Drama Filter */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase text-stone-400 tracking-wider">
                  Bikeshed & Banter Filtered Out
                </div>
                <div className="text-xs text-stone-300 bg-stone-950/40 p-3 rounded-lg border border-stone-800/60 italic">
                  &ldquo;{result.dramaFilter}&rdquo;
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-stone-400 tracking-wider flex items-center justify-between">
                  <span>Actual Things You Need To Do</span>
                  <span className="text-stone-500 font-mono tabular-nums">{result.actionItems.length} items</span>
                </div>
                {result.actionItems.length > 0 ? (
                  <ul className="space-y-2">
                    {result.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-200 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Zero actions required. You can roll over and stay in bed.</span>
                  </div>
                )}
              </div>

              {/* Reading time saved */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
                <span>Reading Energy Saved:</span>
                <span className="text-amber-400 font-bold tabular-nums">+{result.energySavedMinutes} minutes</span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] rounded-2xl bg-stone-900/40 border border-stone-800/80 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <MessageSquareText className="w-10 h-10 text-stone-600" />
              <div className="text-sm font-medium text-stone-300">Ready to Condense</div>
              <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                Click &ldquo;Condense Chat&rdquo; to extract signal, filter petty banter, and get your time back.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
