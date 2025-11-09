import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nifty 50 AI Trading Agent',
  description: 'Advanced AI trading agent for Nifty 50 with dynamic support/resistance levels and RSI analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
