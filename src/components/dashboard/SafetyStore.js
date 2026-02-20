'use client';

import Image from 'next/image';
import Link from 'next/link';

const STORE_ITEMS = [
  {
    name: 'Pepper Spray',
    price: '₹299',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvg2gMy98oxQdHbwCc1VrqgkCmjFqOaGJPqHMNzTJCVcmCufLmkNqVDFxZ_vVzf1tgLMzCkDGmdHbmURNPGjVLVYMpYEyc_3PF21zp5G2WgU0yXHKDcPlGnGTtHPPiW6SCKxwtdwBatcpf4C1_Vwg5TbW5PYJAxqLq5lZzpV6h-FC053GbjYG1zfaGnZ0FSVswYpbSga1k8EclZsoYqxGyRjG-vgSxOBZoSegU4iRfa6t7Yoq1pf0Wwly2e7v6mOXxD1ACcJ0eXrQ',
  },
  {
    name: 'Safety Alarm',
    price: '₹450',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBaNc_9EXXMvFGuEnfTgi-TaQ_Gg30UvrZjwf_e1oui6Hy6aLcYUXLUWj55g789umwnBB9b_R8iMNc29iAVNrEE5mKGILNGwwW_Cv7Ag9XA3mW2qX0Lcz8UR5BWAglgKO1E15M2RbXbPRBeWZdsQJ66jT68C3bThFnC7F9a_28ijoktamc65zjjTu8jrbTcNm-WAcMIjRBKs1y9qtSxDmOQr_oaZ0OJQ3Dkwbah7mh-H-a6NkV0NZtI-r97rrrRnA4pD2IL2ThFXXU',
  },
  {
    name: 'Smart Ring',
    price: '₹1,999',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcnyh2X99Yl4gwy5iJbdLpcLLShuOvy1cPQzwdqfRjO26lntsQKrYEJkr-JVpz4z2rvZmyq-RDhHN2tVEyTBJBkEZYi8nN32XWM7hfIW14G-TbxyAO9WgOkSNSOH_I0rdQeSUPmBJsL8N_LzneovXBn2XGtsF86mK-8yJTaFnb3Ca9domXnvfaiBLXVkCF2mg3hq6s4MA1JENqD4fbU2qGrmeLOCfWGCcunmWofWh92XgxQKLKSycGkJ2sJGAibUooYHSddXu8DAw',
  },
];

export default function SafetyStore({ onViewAll }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">Safety Store</h3>
        {onViewAll ? (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-[#8b47eb] hover:underline"
          >
            View All
          </button>
        ) : (
          <Link
            href="/store"
            className="text-xs font-semibold text-[#8b47eb] hover:underline"
          >
            View All
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
        {STORE_ITEMS.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-36 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <Image
              alt={item.name}
              src={item.imageUrl}
              width={144}
              height={96}
              className="h-24 w-full object-cover"
            />
            <div className="p-2">
              <p className="text-xs font-bold truncate">{item.name}</p>
              <p className="text-[10px] text-[#8b47eb] font-bold">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
