// /src/app/layout.tsx
import '../styles/globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Code Suggestion Agent',
  description: 'Modern frontend using Poppins, TailwindCSS, and clean UI/UX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
