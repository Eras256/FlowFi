import type { Metadata } from 'next'
import { Inter, Outfit, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CasperWalletProvider } from '@/components/providers'
import Navbar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'FlowFi | AI-Powered Invoice Factoring on Casper Network',
    description: 'Transform unpaid invoices into instant working capital using Casper Network\'s enterprise-grade security and NodeOps AI risk scoring. Get funded in minutes, not months.',
    keywords: ['DeFi', 'Invoice Factoring', 'Casper Network', 'RWA', 'Real World Assets', 'AI', 'Blockchain', 'NFT', 'Fintech'],
    authors: [{ name: 'FlowFi Team' }],
    openGraph: {
        title: 'FlowFi | AI-Powered Invoice Factoring',
        description: 'Instant liquidity for SMBs via AI Risk Audits & Casper Blockchain',
        type: 'website',
        locale: 'en_US',
        siteName: 'FlowFi',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FlowFi | Liquidity at the Speed of AI',
        description: 'Transform unpaid invoices into instant working capital',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta name="theme-color" content="#030712" />
            </head>
            <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
                {/* Noise Overlay for texture */}
                <div className="noise-overlay" />

                <CasperWalletProvider>
                    <div className="flex flex-col min-h-screen relative">
                        <Navbar />
                        <main className="flex-grow pt-20 relative z-10">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </CasperWalletProvider>

                {/* Background Grid Pattern */}
                <div className="fixed inset-0 bg-grid pointer-events-none opacity-30 z-0" />
            </body>
        </html>
    )
}

