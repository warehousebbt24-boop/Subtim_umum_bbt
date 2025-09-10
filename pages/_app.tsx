// pages/_app.tsx
import '@/styles/global.css'; // Sesuaikan path jika perlu
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="transition-opacity duration-700 ease-out">
      <Component {...pageProps} />
    </div>
  );
}