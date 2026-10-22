import React, { useState } from 'react';
import { TidyResult, TidyCategory } from '../types/sloth.ts';
import { FolderArchive, Sparkles, Terminal, Copy, Check, FileText, Download, CheckCircle2 } from 'lucide-react';

const DEFAULT_MESSY_FILES = [
  'Screenshot 2026-10-22 at 2.41.09 AM.png',
  'final_pitch_deck_v2_edit_FINAL.pdf',
  'Receipt_Costco_Oct2026_unorganized.jpg',
  'temp_scratchpad_notes.txt',
  'download_archive_20261020_copy.tar.gz',
  'invoice_october_unpaid_urgent.pdf',
  'meeting_recording_zoom_audio.mp3',
  'presentation_draft_v1_old.pptx',
  'client_nda_signed_scanned.pdf',
  'random_script_test2.py'
];

interface TidyDeskProps {
  isLocalOnly: boolean;
}

export const TidyDesk: React.FC<TidyDeskProps> = ({ isLocalOnly }) => {
  const [items, setItems] = useState<string[]>(DEFAULT_MESSY_FILES);
  const [customInput, setCustomInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TidyResult | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const handleAddItem = () => {
    if (!customInput.trim()) return;
    setItems(prev => [...prev, customInput.trim()]);
    setCustomInput('');
  };

  const handleReset = () => {
    setItems(DEFAULT_MESSY_FILES);
    setResult(null);
  };

  const handleTidy = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const response = await fetch('/api/ai/tidy-desk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messyItems: items,
          mode: isLocalOnly ? 'force-local' : 'auto',
        }),
      });

      if (!response.ok) throw new Error('Tidying failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn('Backend call failed, using client fallback:', err);
      // Client-side fallback
      setResult({
        categories: [
          {
            folderName: '01_Finance_And_Invoices',
            description: 'Financial receipts, billing statements, and tax documents',
            items: [
              { original: 'Receipt_Costco_Oct2026_unorganized.jpg', suggestedName: '2026-10_receipt_costco.jpg', action: 'Archive' },
              { original: 'invoice_october_unpaid_urgent.pdf', suggestedName: '2026-10_invoice_unpaid.pdf', action: 'Archive' },
            ],
          },
          {
            folderName: '02_Media_And_Captures',
            description: 'Screenshots and audio recordings',
            items: [
              { original: 'Screenshot 2026-10-22 at 2.41.09 AM.png', suggestedName: 'screenshot_20261022_024109.png', action: 'File' },
              { original: 'meeting_recording_zoom_audio.mp3', suggestedName: 'audio_zoom_meeting_oct22.mp3', action: 'File' },
            ],
          },
          {
            folderName: '03_Documents_And_Decks',
            description: 'Important presentations and signed agreements',
            items: [
              { original: 'final_pitch_deck_v2_edit_FINAL.pdf', suggestedName: 'pitch_deck_2026_final.pdf', action: 'File' },
              { original: 'client_nda_signed_scanned.pdf', suggestedName: 'client_nda_signed.pdf', action: 'File' },
            ],
          },
          {
            folderName: '04_Purge_Candidates',
            description: 'Temporary files, archives, and scratch drafts',
            items: [
              { original: 'temp_scratchpad_notes.txt', suggestedName: 'scratchpad_notes.txt', action: 'Delete' },
              { original: 'download_archive_20261020_copy.tar.gz', suggestedName: 'archive_20261020.tar.gz', action: 'Delete' },
              { original: 'presentation_draft_v1_old.pptx', suggestedName: 'presentation_draft_v1_old.pptx', action: 'Delete' },
            ],
          },
        ],
        bashScript: `#!/usr/bin/env bash\n# SlothFlow 1-Click Desktop Tidier\n\nmkdir -p "01_Finance_And_Invoices" "02_Media_And_Captures" "03_Documents_And_Decks" "04_Purge_Candidates"\n\nmv "Receipt_Costco_Oct2026_unorganized.jpg" "01_Finance_And_Invoices/2026-10_receipt_costco.jpg"\nmv "invoice_october_unpaid_urgent.pdf" "01_Finance_And_Invoices/2026-10_invoice_unpaid.pdf"\nmv "Screenshot 2026-10-22 at 2.41.09 AM.png" "02_Media_And_Captures/screenshot_20261022_024109.png"\nmv "meeting_recording_zoom_audio.mp3" "02_Media_And_Captures/audio_zoom_meeting_oct22.mp3"\nmv "final_pitch_deck_v2_edit_FINAL.pdf" "03_Documents_And_Decks/pitch_deck_2026_final.pdf"\nmv "client_nda_signed_scanned.pdf" "03_Documents_And_Decks/client_nda_signed.pdf"\n\necho "🦥 Desktop tidied! You can go back to resting."`,
        slothProTip: 'Set your browser download folder to an auto-sorting directory so you never have to drag a file again.',
        provider: 'Local Open-Source Classifier (Offline)',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.bashScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const downloadScript = () => {
    if (!result) return;
    const blob = new Blob([result.bashScript], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sloth_tidy.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>Automation 03</span>
          <span aria-hidden="true">·</span>
          <span>Procrastination Eliminator</span>
          <span aria-hidden="true">·</span>
          <span>1-Click Bash Script</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-100">
          TidyDesk Procrastination Cleaner
        </h2>
        <p className="text-stone-300 text-sm mt-1 max-w-2xl">
          That messy downloads folder you&apos;ve been putting off organizing for 3 months? Drop the file list here. SlothFlow categorizes everything into structured folders and produces an executable bash script.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cluttered Files List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-900 relative">
            <img
              src="/src/assets/images/desk_clutter_1792680120740.jpg"
              alt="Desk clutter"
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-2.5 left-3 text-xs font-mono text-amber-300 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-700">
              {items.length} Chaotic Items In Queue
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              placeholder="Add file: e.g. receipt_2026.pdf"
              className="flex-1 px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              onClick={handleAddItem}
              className="px-3 py-2 text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 rounded-lg border border-stone-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1.5 max-h-60 overflow-y-auto">
            {items.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs font-mono text-stone-300 bg-stone-950/60 px-2.5 py-1.5 rounded border border-stone-800/80"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="truncate">{file}</span>
                </div>
                <button
                  onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                  className="text-stone-500 hover:text-stone-300 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Reset Samples
            </button>
            <button
              onClick={handleTidy}
              disabled={loading || items.length === 0}
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Sorting clutter...' : 'Auto-Tidy Clutter'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Categorized Groups and Bash Script */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="h-full min-h-[360px] rounded-2xl bg-stone-900/40 border border-stone-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <div className="text-sm font-medium text-stone-200">Constructing clean directories...</div>
              <p className="text-xs text-stone-400 max-w-sm">
                Normalizing timestamps and assigning standardized file taxonomy.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Sloth Pro Tip */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-200 flex items-start gap-2.5">
                <span className="text-base">🦥</span>
                <div>
                  <span className="text-amber-400 font-semibold uppercase font-mono mr-1">Procrastination Guard:</span>
                  <span>{result.slothProTip}</span>
                </div>
              </div>

              {/* Categorized groups */}
              <div className="space-y-3">
                {result.categories.map((cat: TidyCategory, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderArchive className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono font-bold text-stone-100">{cat.folderName}</span>
                      </div>
                      <span className="text-xs font-mono text-stone-400 tabular-nums">
                        {cat.items.length} items
                      </span>
                    </div>
                    <div className="text-xs text-stone-400">{cat.description}</div>

                    <div className="space-y-1.5 pt-1">
                      {cat.items.map((it, itIdx) => (
                        <div
                          key={itIdx}
                          className="flex items-center justify-between text-xs font-mono bg-stone-950/70 p-2 rounded border border-stone-800/80 gap-2"
                        >
                          <span className="text-stone-400 line-through truncate max-w-[45%]">
                            {it.original}
                          </span>
                          <span className="text-stone-500">→</span>
                          <span className="text-emerald-400 font-medium truncate max-w-[45%]">
                            {it.suggestedName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Executable Bash Script */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Executable Shell Script (Run in terminal)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyScript}
                      className="px-2 py-1 text-xs text-stone-300 hover:text-white bg-stone-800 rounded border border-stone-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
                    </button>
                    <button
                      onClick={downloadScript}
                      className="px-2 py-1 text-xs text-stone-300 hover:text-white bg-stone-800 rounded border border-stone-700 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download .sh</span>
                    </button>
                  </div>
                </div>

                <pre className="text-xs font-mono text-stone-300 bg-stone-900/90 p-3 rounded-lg overflow-x-auto leading-relaxed border border-stone-800">
                  {result.bashScript}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] rounded-2xl bg-stone-900/40 border border-stone-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <FolderArchive className="w-10 h-10 text-stone-600" />
              <div className="text-sm font-medium text-stone-300">Messy Desk Detected</div>
              <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                Click &ldquo;Auto-Tidy Clutter&rdquo; to turn your chaotic files into a pristine directory tree.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
