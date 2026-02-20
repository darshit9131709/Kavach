'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="font-display bg-[#f7f6f8] dark:bg-[#181121] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-[#8b47eb]/10 p-8 text-center">
        <div className="bg-[#8b47eb]/10 text-[#8b47eb] p-3 rounded-full inline-flex mb-4">
          <span className="material-symbols-outlined text-3xl block">lock_reset</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Password reset isn&apos;t wired up yet. For now, please create a new account or
          sign in with your existing credentials.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <Link
            href="/login"
            className="w-full bg-[#8b47eb] hover:bg-[#8b47eb]/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-[#8b47eb]/20 transition-all transform active:scale-[0.98]"
          >
            Back to Login
          </Link>
          <Link
            href="/register"
            className="w-full py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:border-[#8b47eb]/40 hover:text-[#8b47eb] transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

