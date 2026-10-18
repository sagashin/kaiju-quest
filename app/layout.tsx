import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'お支度クエスト＆怪獣召喚図鑑',
  description: '毎日のクエストをクリアしてカッコいい怪獣を召喚しよう！音声読み上げ＆ド派手エフェクトつきお支度アプリ',
  openGraph: {
    title: 'お支度クエスト＆怪獣召喚図鑑',
    description: '毎日のクエストをクリアしてカッコいい怪獣を召喚しよう！音声読み上げ＆ド派手エフェクトつきお支度アプリ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'お支度クエスト＆怪獣召喚図鑑',
    description: '毎日のクエストをクリアしてカッコいい怪獣を召喚しよう！音声読み上げ＆ド派手エフェクトつきお支度アプリ',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        suppressHydrationWarning
        className="bg-slate-950 text-white antialiased selection:bg-amber-400 selection:text-slate-950"
        style={{
          fontFamily:
            '"Hiragino Maru Gothic ProN", "Hiragino Sans", "BIZ UDPGothic", "Meiryo", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
