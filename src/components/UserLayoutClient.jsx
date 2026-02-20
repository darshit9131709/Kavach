"use client";

import { usePathname } from "next/navigation";
import LayoutWrapper from "@/components/LayoutWrapper";

export default function UserLayoutClient({ children }) {
  const pathname = usePathname();

  // Dashboard has its own header, nav and SOS — skip LayoutWrapper
  if (pathname === "/user/dashboard") {
    return <>{children}</>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
}
