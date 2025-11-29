// app/layout.tsx or app/layout.jsx

import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  // whatever you already had here…
  // title, description, etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}