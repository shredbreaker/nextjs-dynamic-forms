import "@/app/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Bitcount_Grid_Double, Open_Sans, Jost, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ThemeProvider } from "next-themes";
import { LocalizationProviderWrapper } from "@/components/providers/localization-provider-wrapper";
import { routing } from "@/i18n/routing";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["800"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "200", "400", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const bitcountGridDouble = Bitcount_Grid_Double({
  variable: "--font-bitcount",
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
});

export const metadata: Metadata = {
  title: "Dynamic Forms Demo",
  description: "Dynamic Forms by Shredbreaker",
  openGraph: {
    title: "Dynamic Forms Demo",
    description: "Dynamic Forms by Shredbreaker",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dynamic Forms Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dynamic Forms Demo",
    description: "Dynamic Forms by Shredbreaker",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} ${openSans.variable} ${jost.variable} ${montserrat.variable} ${bitcountGridDouble.variable} smooth-scroll`}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LocalizationProviderWrapper>
              <main className="flex-grow">{children}</main>
            </LocalizationProviderWrapper>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
