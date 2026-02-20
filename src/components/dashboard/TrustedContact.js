'use client';

import Image from 'next/image';

export default function TrustedContact({ 
  name, 
  imageUrl, 
  onClick,
  isAddButton = false 
}) {
  if (isAddButton) {
    return (
      <div className="flex flex-col items-center gap-2 min-w-[70px]">
        <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer">
          <span className="material-symbols-outlined text-slate-500">add</span>
        </div>
        <span className="text-xs font-medium text-slate-500">Add</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
    >
      <div className="size-14 rounded-full bg-[#8b47eb]/10 border-2 border-[#8b47eb]/30 p-0.5">
        <Image
          alt={name}
          src={imageUrl}
          width={56}
          height={56}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <span className="text-xs font-medium">{name}</span>
    </div>
  );
}
