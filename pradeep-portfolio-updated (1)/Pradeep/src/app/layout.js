import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import ThemeProvider from '@/components/ThemeProvider'
import SmoothScroll from '@/components/SmoothScroll'
import Navbar from '@/components/Navbar'
import ScrollAnimator from '@/components/ScrollAnimator'
import Scene3D from '@/components/Scene3D'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

const siteUrl = 'https://pradeeppilot.xyz'
const title = 'Pradeep — Full-Stack & Web3 Developer'
const description =
  "Chandrapradeep R — final-year CS engineer building ZK-proof systems, on-chain agents, and Web3 infrastructure. I build systems that verify themselves."

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'Chandrapradeep R', 'Web3 developer', 'Zero-knowledge proofs', 'Solidity engineer',
    'ZK-SNARKs', 'Circom', 'on-chain agents', 'AI engineer India', 'blockchain internship',
  ],
  authors: [{ name: 'Chandrapradeep R', url: siteUrl }],
  creator: 'Chandrapradeep R',
  alternates: { canonical: siteUrl },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Pradeep — Full-Stack & Web3 Developer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@pradeeppilot2k5',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <Script id="suppress-clock-warning" strategy="beforeInteractive">
          {`
          const warn = console.warn;
          console.warn = function() {
            if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('THREE.Clock')) return;
            warn.apply(console, arguments);
          };
          `}
        </Script>
        <Script id="set-initial-theme" strategy="beforeInteractive">
          {`
          try {
            const saved = localStorage.getItem('theme');
            const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            if (theme === 'dark') document.documentElement.classList.add('dark');
          } catch (e) {}
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <Scene3D />
          <SmoothScroll>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Navbar />
              <ScrollAnimator />
              {children}
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
