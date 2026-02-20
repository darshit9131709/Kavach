'use client';

import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-[#8b47eb]/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[#8b47eb] font-bold">
            shield_with_heart
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Kavach
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-[#8b47eb]/10 transition-colors">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
            notifications
          </span>
        </button>
        <div className="size-10 rounded-full border-2 border-[#8b47eb]/20 p-0.5 overflow-hidden">
          <Image
            alt="Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC48U8J9Xs4QIT2c6Kp8kFBPnzHjdTxrtzKx43tcYUNIP3E581ylAPLu1q_9EUHsiKNApe5TI_HI_Z0MyHmr-bBaNlyIiMgHRYVtKA3he8YHRmsR7XOTw6XMOlvBIwtsSw6faSdFeDFCtO9AtngltjT0F_ln2b2kvJmiovDzt2XzUHv-IrDSZ2i-t-JllghKFob6WvYYhMMfpsnIgG7acViyJ30Od4CNMVcBMOtQ-bXOT0RvwbL7Bc17T7pbtEN6EeuY1CeDqL0E9s"
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
