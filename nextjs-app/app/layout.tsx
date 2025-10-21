import './globals.css';

export const metadata = {
  title: 'Translator',
  description: 'A simple and efficient translator application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
