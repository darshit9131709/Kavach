'use client';

import { useState } from 'react';

/**
 * FakeCallSettings
 *
 * Bottom-sheet modal to configure fake call options:
 * - Caller name (preset or custom)
 * - Delay before call rings
 */
const PRESET_CALLERS = [
  { name: 'Mom', icon: 'face', color: 'text-pink-500' },
  { name: 'Dad', icon: 'face_6', color: 'text-blue-500' },
  { name: 'Boss', icon: 'business_center', color: 'text-amber-500' },
  { name: 'Police', icon: 'local_police', color: 'text-red-500' },
  { name: 'Brother', icon: 'face_4', color: 'text-green-500' },
  { name: 'Sister', icon: 'face_3', color: 'text-purple-500' },
];

const DELAY_OPTIONS = [
  { label: 'Now', value: 0 },
  { label: '5 sec', value: 5 },
  { label: '10 sec', value: 10 },
  { label: '30 sec', value: 30 },
];

export default function FakeCallSettings({ visible, onClose, onStart }) {
  const [selectedCaller, setSelectedCaller] = useState('Mom');
  const [customCaller, setCustomCaller] = useState('');
  const [delay, setDelay] = useState(0);
  const [isCustom, setIsCustom] = useState(false);

  const handleStart = () => {
    const callerName = isCustom && customCaller.trim()
      ? customCaller.trim()
      : selectedCaller;

    if (onStart) {
      onStart({ callerName, delay });
    }
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990]"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[9991] bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto fake-call-sheet-enter">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Fake Call Settings
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-slate-500 text-lg">
                close
              </span>
            </button>
          </div>

          {/* Caller Name Selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
              Who should call you?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_CALLERS.map((caller) => (
                <button
                  key={caller.name}
                  onClick={() => {
                    setSelectedCaller(caller.name);
                    setIsCustom(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    !isCustom && selectedCaller === caller.name
                      ? 'border-[#8b47eb] bg-[#8b47eb]/5'
                      : 'border-slate-200 dark:border-slate-600 hover:border-[#8b47eb]/30'
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl ${caller.color}`}>
                    {caller.icon}
                  </span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {caller.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Caller Input */}
          <div className="mb-6">
            <button
              onClick={() => setIsCustom(!isCustom)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                isCustom
                  ? 'border-[#8b47eb] bg-[#8b47eb]/5'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[#8b47eb]">edit</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Custom name
              </span>
            </button>
            {isCustom && (
              <input
                type="text"
                placeholder="Enter caller name..."
                value={customCaller}
                onChange={(e) => setCustomCaller(e.target.value)}
                maxLength={30}
                className="w-full mt-3 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:border-[#8b47eb] focus:outline-none transition-colors"
                autoFocus
              />
            )}
          </div>

          {/* Delay Selection */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
              Ring after delay
            </label>
            <div className="flex gap-3">
              {DELAY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDelay(opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    delay === opt.value
                      ? 'border-[#8b47eb] bg-[#8b47eb] text-white'
                      : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-[#8b47eb]/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8b47eb] to-[#6d28d9] text-white font-bold text-base shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">phone_in_talk</span>
            {delay > 0
              ? `Start Fake Call (in ${delay}s)`
              : 'Start Fake Call Now'}
          </button>
        </div>
      </div>
    </>
  );
}
