import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import "./globals.css";

const notoSelifJp = Noto_Serif_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

// Mantineテーマの設定
const theme = createTheme({
  fontFamily: 'var(--font-noto-sans-jp), sans-serif',
});

export const metadata: Metadata = {
  title: "偉人の名言集",
  description: "歴史上の偉人たちの心に響く言葉",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSelifJp.variable}`}>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}