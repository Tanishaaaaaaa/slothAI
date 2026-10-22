import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine.ts';
import { StoryResult } from '../types/sloth.ts';
import { MoonStar, Play, Square, Volume2, CloudRain, Wind, Flame, Headphones, Timer, Sparkles } from 'lucide-react';

const STORY_THEMES = [
  'Rain on the cecropia leaves and the slow river bend',
  'A warm cedar cabin with pine smoke and star navigation',
  'Mossy branches in twilight and zero deadlines',
  'The ancient sloth monastery where hurrying is prohibited',
];

interface WindDownCompanionProps {
  isLocalOnly: boolean;
}

export const WindDownCompanion: React.FC<WindDownCompanionProps> = ({ isLocalOnly }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [channels, setChannels] = useState({
    rain: 0.5,
    wind: 0.35,
    fire: 0.25,
    binaural: 0.4,
  });
  const [masterVol, setMasterVol] = useState<number>(0.7);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0);
  const [activeTheme, setActiveTheme] = useState<string>(STORY_THEMES[0]);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [loadingStory, setLoadingStory] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      audioEngine.stopSoundscape();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSoundscape = () => {
    if (isPlayingAudio) {
      audioEngine.stopSoundscape();
      setIsPlayingAudio(false);
    } else {
      audioEngine.startSoundscape(channels);
      audioEngine.setMasterVolume(masterVol);
      setIsPlayingAudio(true);
      if (sleepTimerMinutes > 0) {
        audioEngine.setSleepTimer(sleepTimerMinutes, () => setIsPlayingAudio(false));
      }
    }
  };

  const handleChannelChange = (name: keyof typeof channels, val: number) => {
    const updated = { ...channels, [name]: val };
    setChannels(updated);
    audioEngine.updateVolumes(updated);
  };

  const handleMasterVolume = (val: number) => {
    setMasterVol(val);
    audioEngine.setMasterVolume(val);
  };

  const handleSetTimer = (mins: number) => {
    setSleepTimerMinutes(mins);
    if (isPlayingAudio) {
      audioEngine.setSleepTimer(mins, () => setIsPlayingAudio(false));
    }
  };

  const generateBedtimeStory = async () => {
    setLoadingStory(true);
    try {
      const response = await fetch('/api/ai/wind-down', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: activeTheme,
          soundscape: 'Rain, wind, and 4.5Hz binaural waves',
          isLocalOnly,
        }),
      });

      if (!response.ok) throw new Error('Story generation failed');
      const data = await response.json();
      setStory(data);
    } catch (err) {
      console.warn('Backend call failed, using client fallback:', err);
      setStory({
        title: 'The Art of Hanging Suspended in Greenery',
        story: 'High above the forest floor, nestled securely in the fork of a giant cecropia tree, Barnaby the three-toed sloth closed his eyes. The tropical canopy breathed with him—a soft, whispering exhaling of green fronds bathed in early dusk. Below, the river flowed at its own leisurely pace, carving ancient curves through mossy boulders without rush or hurry. You do not need to push the river, for it moves by itself. High in the leaves, there was nowhere to be, no notifications waiting, no servers to restart. Only the quiet rustle of mist settling on cedar needles, and the steady, reassuring warmth of the night blanket.',
        slothReflection: 'The trees take decades to grow their tallest crowns, and they never once apologize for taking their sweet time. Rest now; tomorrow moves slow too.',
        binauralFrequency: 4.5,
        provider: 'Local Story Vault (Offline)',
      });
    } finally {
      setLoadingStory(false);
    }
  };

  const toggleNarration = () => {
    if (!('speechSynthesis' in window) || !story) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(story.story);
      utterance.rate = 0.82; // Calm, relaxed cadence
      utterance.pitch = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Try finding a gentle voice
      const voices = window.speechSynthesis.getVoices();
      const calmVoice = voices.find(v => v.lang.startsWith('en') && /natural|calm|soft|female|male/i.test(v.name));
      if (calmVoice) utterance.voice = calmVoice;

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <span>Automation 04</span>
          <span aria-hidden="true">·</span>
          <span>100% Offline Procedural Sound</span>
          <span aria-hidden="true">·</span>
          <span>Zero Server Streaming</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-100">
          Offline Wind-Down & Soundscape Companion
        </h2>
        <p className="text-stone-300 text-sm mt-1 max-w-2xl">
          Reward yourself after a day of coding. Synthesizes rain, canopy wind, crackling fire, and 4.5 Hz theta binaural beats entirely inside your browser with Web Audio API. No internet needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ambient Procedural Mixer */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-900 relative">
            <img
              src="/src/assets/images/bedtime_calm_1792680120617.jpg"
              alt="Atmospheric twilight forest"
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-300 bg-stone-900/80 px-2 py-1 rounded backdrop-blur border border-stone-700">
                  {isPlayingAudio ? 'Audio Graph: Active' : 'Soundscape: Dormant'}
                </span>
              </div>
              <button
                onClick={toggleSoundscape}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Silence</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Ambient</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mixer Sliders */}
          <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-stone-300 pb-1 border-b border-stone-800">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Master Volume</span>
              </span>
              <span className="tabular-nums font-bold text-amber-300">{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVol}
              onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />

            {/* Individual Channels */}
            <div className="space-y-3 pt-2">
              {/* Rain */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                    <span>Mountain Rain</span>
                  </span>
                  <span className="font-mono text-stone-400 tabular-nums">{Math.round(channels.rain * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={channels.rain}
                  onChange={(e) => handleChannelChange('rain', parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Wind */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Canopy Wind (LFO Gusts)</span>
                  </span>
                  <span className="font-mono text-stone-400 tabular-nums">{Math.round(channels.wind * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={channels.wind}
                  onChange={(e) => handleChannelChange('wind', parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Fire */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Campfire Crackle</span>
                  </span>
                  <span className="font-mono text-stone-400 tabular-nums">{Math.round(channels.fire * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={channels.fire}
                  onChange={(e) => handleChannelChange('fire', parseFloat(e.target.value))}
                  className="w-full accent-orange-400 cursor-pointer"
                />
              </div>

              {/* Binaural */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-purple-400" />
                    <span>4.5 Hz Theta Waves (Headphones)</span>
                  </span>
                  <span className="font-mono text-stone-400 tabular-nums">{Math.round(channels.binaural * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={channels.binaural}
                  onChange={(e) => handleChannelChange('binaural', parseFloat(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Sleep Timer */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                <span>Sleep Timer:</span>
              </span>
              <div className="flex gap-1.5">
                {[0, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetTimer(mins)}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                      sleepTimerMinutes === mins
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {mins === 0 ? 'Off' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calming Sloth Story */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300">
                Bedtime Narrative Theme:
              </span>
              <button
                onClick={generateBedtimeStory}
                disabled={loadingStory}
                className="px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loadingStory ? 'Weaving story...' : 'Generate New Story'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {STORY_THEMES.map((theme, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTheme(theme)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors text-left ${
                    activeTheme === theme
                      ? 'bg-stone-800 text-amber-300 border border-amber-500/40'
                      : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Story Viewport */}
          {loadingStory ? (
            <div className="h-64 rounded-2xl bg-stone-900/40 border border-stone-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <div className="text-sm font-medium text-stone-200">Whispering to the canopy...</div>
              <p className="text-xs text-stone-400 max-w-xs">
                Generating restful, low-heart-rate bedtime prose.
              </p>
            </div>
          ) : story ? (
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h3 className="text-lg font-bold text-stone-100">{story.title}</h3>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">
                    Theta carrier: {story.binauralFrequency} Hz
                  </div>
                </div>
                {'speechSynthesis' in window && (
                  <button
                    onClick={toggleNarration}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      isSpeaking
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Pause Narration' : 'Read to Me'}</span>
                  </button>
                )}
              </div>

              <p className="text-sm text-stone-200 leading-relaxed font-serif tracking-wide bg-stone-950/40 p-4 rounded-xl border border-stone-800/80">
                {story.story}
              </p>

              {story.slothReflection && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-200 flex items-start gap-2.5">
                  <span className="text-lg">🦥</span>
                  <div>
                    <div className="text-amber-400 font-mono uppercase font-semibold text-[11px] tracking-wider">
                      Sloth Night Reflection
                    </div>
                    <div className="mt-1 italic">{story.slothReflection}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 rounded-2xl bg-stone-900/40 border border-stone-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <MoonStar className="w-10 h-10 text-stone-600" />
              <div className="text-sm font-medium text-stone-300">Quiet Hours</div>
              <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                Click &ldquo;Generate New Story&rdquo; or start the procedural soundscape to ease your mind into sleep mode.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
