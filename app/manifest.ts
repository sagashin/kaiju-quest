import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'かいじゅうクエスト',
    short_name: 'かいじゅうクエスト',
    description: '毎日のクエストをクリアしてカッコいい怪獣を召喚しよう！音声読み上げ＆ド派手エフェクトつきお支度アプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#0f172a',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}

