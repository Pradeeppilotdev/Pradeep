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

export const metadata = {
  title: 'Pradeep — Full-Stack & Web3 Developer',
  description:
    'Chandrapradeep R — final-year CS engineer building ZK-proof systems, on-chain agents, and Web3 infrastructure.',
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
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <Scene3D />
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
