// app/layout.js
import "./globals.css";
import { Yeseva_One } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const yeseva = Yeseva_One({
  weight: "400",            // Yeseva One ships only 400; it looks naturally bold
  subsets: ["latin"],
  variable: "--font-yeseva",
  display: "swap",
});

export const metadata = {
  title: "Mindfulness with Mind",
  description: "AI Automation for the Conscious",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={yeseva.variable}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
