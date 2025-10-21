import './globals.css';
import { ThemeProvider } from '../lib/ThemeContext';

export const metadata = {
  title: 'Translate',
  description: 'A simple and efficient translator application',
  icons: [
    { rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' },
    { rel: 'shortcut icon', url: '/icon.svg', type: 'image/svg+xml' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
