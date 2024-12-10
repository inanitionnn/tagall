import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Source_Sans_3, Nunito_Sans } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { type Session } from "next-auth";
import { SessionProviderWrapper } from "./_components/wrappers/session-provider-wrapper";
import { ToastWrapper } from "./_components/wrappers/toast-wrapper";
import { Suspense } from "react";
import Loaging from "./loading";

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Tagall",
  description: "Collect all you want",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  params: { session },
}: Readonly<{
  children: React.ReactNode;
  params: { session: Session | null | undefined };
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSansPro.variable} ${nunitoSans.variable}`}
    >
      <body className="bg-muted">
        <TRPCReactProvider>
          <SessionProviderWrapper session={session}>
            <ToastWrapper>
              <SpeedInsights />
              <Analytics />
              <Suspense fallback={<Loaging />}>{children}</Suspense>
            </ToastWrapper>
          </SessionProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
