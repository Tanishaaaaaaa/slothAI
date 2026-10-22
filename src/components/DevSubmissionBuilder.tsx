import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Award, FileCode, CheckCircle2 } from 'lucide-react';

interface DevSubmissionBuilderProps {
  isLocalOnly: boolean;
}

export const DevSubmissionBuilder: React.FC<DevSubmissionBuilderProps> = ({ isLocalOnly }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('Tanisha Saxena');
  const [projectTitle, setProjectTitle] = useState<string>('SlothFlow: The Slow & Steady Open-Source AI Suite');
  const [devRelayLink, setDevRelayLink] = useState<string>('https://ais-dev-cupiigpbgs4caubg5t5azw-717461241559.asia-northeast1.run.app');

  const submissionMarkdown = `---
title: ${projectTitle} — Hacktoberfest 2026: Slow & Steady
published: true
tags: hacktoberfest, opensource, ai, webdev
cover_image: https://raw.githubusercontent.com/devchallenge/slothflow/main/cover.png
canonical_url: 
---

# Hacktoberfest 2026 Open-Source AI Challenge: Week 3 Submission

> *"International Sloth Day reminds us: sloths move at their own pace, conserve their energy, and let nature do the heavy lifting. Why shouldn't our AI agents do the exact same thing?"*

**Author:** ${authorName}  
**Challenge:** Hacktoberfest Open-Source AI Challenge Week 3 ("Slow and Steady")  
**Theme:** Channel your inner sloth — build something that does the work so you don't have to.

---

## 🦥 What I Built

**SlothFlow** is a suite of open-source and open-weight AI agents engineered to reward laziness and eliminate dreaded everyday friction. Instead of building yet another frantic productivity tracker that stresses you out with notifications, SlothFlow does the dirty work so you can stay in your hammock:

1. **Overnight Chatter Condenser**: Woke up to 180+ unread Discord/Slack messages? The agent delivers an honest 2-line summary, pulls out real action items, and filters out trivial bikeshed debates.
2. **Lazy Fridge-to-Feast Scanner**: Never stand blankly staring into the fridge with the door open. AI scans what's inside and devises 1-pan, zero-standing meals ready in under 10 minutes (with a strict rule: pan count = 1, dish count = 0).
3. **TidyDesk & Inbox Procrastination Cleaner**: Automatically sorts chaotic desktop screenshots, tax PDFs, and unorganized downloads into structured folders and produces an executable, 1-click bash script.
4. **Offline Wind-Down & Procedural Ambient Soundscape**: Runs completely offline using the browser Web Audio API to synthesize rain, canopy wind, campfire crackle, and 4.5 Hz theta binaural beats, paired with bedtime narratives.

---

## 💡 Why Open Innovation Matters For What I Built

In this week's prompt, the DEV team asked:
*Does it run on a laptop with no internet? Keep someone's data off a server they don't control? Let you fine-tune, swap models, or change how your agent behaves? Cost nothing to run? Tell us where your open-based approach worked better than a closed one.*

Here is why **open-source AI was fundamentally better**:

### 1. Data Sovereignty & Absolute Privacy
Chat logs and personal desk files should **never** be shipped to proprietary cloud silos for training. With local open-weight models (e.g., Gemma 2 / SmolLM / local in-browser heuristics), private conversations, receipts, and personal notes stay strictly in memory on the user's laptop.

### 2. Works with Zero Internet
The bedtime soundscape and local text agents run seamlessly on a plane, during a power outage, or off-grid with no Wi-Fi. The Web Audio graph synthesizes rain and binaural frequencies directly from mathematical oscillators—zero audio assets streamed from a server.

### 3. Zero Subscription Dread & Perpetual Free Operation
Proprietary API tokens run out, require credit card attachments, or break when quotas spike. Open-weight inference costs **$0.00 forever**. You set it up once and never pay a recurring bill.

### 4. Model Swapping & Sovereign Control
With SlothFlow's open architecture, developers can hot-swap between local in-browser inference (zero telemetry) and accelerated open-weight runners. You own the prompt harness, the rules, and the agent behavior.

---

## 🛠️ Architecture & Open Tech Stack

- **AI Runtime**: Open-weight inference support (Gemma 2 / Transformers / Gemini 3.8 Flash runner).
- **Procedural Soundscape**: Browser Web Audio API with pink/brown noise filters, LFO frequency modulation, and stereo-panned binaural beat synthesis.
- **Frontend**: React 19, Tailwind CSS v4, Motion, Lucide icons, accessible typography with tabular numerals.
- **Backend**: Express.js with Vite middleware integration.

---

## 🔗 Live Application & DevRelay Session

- **Live Applet**: [Launch SlothFlow](${devRelayLink})
- **License**: Open Source under Apache-2.0

Happy Hacktoberfest, and happy International Sloth Day! Channel your inner sloth and let open-source AI do the work for you.
`;

  const copyPost = () => {
    navigator.clipboard.writeText(submissionMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>DEV Challenge 4 of 5</span>
          <span aria-hidden="true">·</span>
          <span>Week 3 Submission Template</span>
          <span aria-hidden="true">·</span>
          <span>Open-Source Rationale</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-100">
          Hacktoberfest 2026 Submission Post Generator
        </h2>
        <p className="text-stone-300 text-sm mt-1 max-w-2xl">
          Ready to publish on DEV? SlothFlow prepares your complete, contest-compliant Markdown post answering all prompt criteria: open innovation rationale, local offline benefits, and DevRelay session link.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Post Customizer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 space-y-4">
            <div className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
              Contest Metadata
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300">Project Headline</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300">Live App / DevRelay URL</label>
              <input
                type="text"
                value={devRelayLink}
                onChange={(e) => setDevRelayLink(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Badges preview */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <div className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Eligible Badges:</span>
              </div>
              <div className="flex gap-2">
                <div className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-center flex-1">
                  <div className="text-lg">🏅</div>
                  <div className="text-[11px] font-semibold text-stone-200 mt-1">Completion Badge</div>
                  <div className="text-[10px] text-stone-500 font-mono">HF26 Week 3</div>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-center flex-1">
                  <div className="text-lg">🏆</div>
                  <div className="text-[11px] font-semibold text-amber-300 mt-1">Winner Badge</div>
                  <div className="text-[10px] text-stone-500 font-mono">Partner Categories</div>
                </div>
              </div>
            </div>

            <button
              onClick={copyPost}
              className="w-full py-3 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy DEV.to Markdown'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Markdown Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 pb-1 border-b border-stone-800">
            <span className="flex items-center gap-1.5 font-mono">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Submission Post Preview (~{submissionMarkdown.split(/\s+/).length} words)</span>
            </span>
            <span className="text-emerald-400 font-mono">Ready to Publish</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 max-h-[520px] overflow-y-auto">
            <pre className="text-xs font-mono text-stone-300 whitespace-pre-wrap leading-relaxed">
              {submissionMarkdown}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
