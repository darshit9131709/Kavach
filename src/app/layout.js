import { Public_Sans } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import VapiWidget from "@/components/VapiWidget";

const publicSans = Public_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Kavach - Personal Safety Dashboard",
  description: "Women safety SaaS platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.vapi.ai" />
        <link rel="preconnect" href="https://vapi.ai" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${publicSans.variable} antialiased`}>
        <Providers>
          {children}
          <VapiWidget />
        </Providers>
      </body>
    </html>
  );
}
