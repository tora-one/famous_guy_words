import type { Metadata } from "next";
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import "./globals.css";

import { cinecaption } from "./font/cinecaption";


// Mantineテーマの設定
const theme = createTheme({
  fontFamily: 'var(--font-cinecaption), sans-serif',
});

export const metadata: Metadata = {
  title: "小説の名台詞",
  description: "物語の中で生まれし美しき言葉達",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cinecaption.variable}>
      <body>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}