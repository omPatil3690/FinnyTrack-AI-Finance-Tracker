import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import "@/lib/env-validation"; // Validate environment variables

const outfit = Outfit({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: "FinTrack - AI-Powered Personal Finance Management",
  description: "Transform your financial life with intelligent budgeting, expense tracking, and personalized AI insights. Take control of your money and achieve your financial goals effortlessly.",
  keywords: "finance, budgeting, expense tracking, AI, personal finance, money management",
  authors: [{ name: "FinTrack Team" }],
  creator: "FinTrack",
  publisher: "FinTrack",
  robots: "index, follow",
  openGraph: {
    title: "FinTrack - AI-Powered Personal Finance Management",
    description: "Transform your financial life with intelligent budgeting, expense tracking, and personalized AI insights.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinTrack - AI-Powered Personal Finance Management",
    description: "Transform your financial life with intelligent budgeting, expense tracking, and personalized AI insights.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className={outfit.variable} suppressHydrationWarning>
        <body className={`${outfit.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  color: '#374151',
                },
              }}
            />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
