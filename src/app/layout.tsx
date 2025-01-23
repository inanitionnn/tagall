import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Source_Sans_3, Nunito_Sans } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { type Session } from "next-auth";
import { SessionProviderWrapper } from "./_components/wrappers/session-provider-wrapper";
import { ToastWrapper } from "./_components/wrappers/toast-wrapper";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { cloakSSROnlySecret } from "ssr-only-secrets";
import { headers } from "next/headers";

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

export default async function RootLayout({
  children,
  params: { session },
}: Readonly<{
  children: React.ReactNode;
  params: { session: Session | null | undefined };
}>) {
  const cookie = new Headers(headers()).get("cookie");
  const encryptedCookie = await cloakSSROnlySecret(
    cookie ?? "",
    "SECRET_CLIENT_COOKIE_VAR",
  );
  return (
    <html
      lang="en"
      className={`${sourceSansPro.variable} ${nunitoSans.variable}`}
    >
      <body>
        <TRPCReactProvider ssrOnlySecret={encryptedCookie}>
          <SessionProviderWrapper session={session}>
            <ToastWrapper>
              <Suspense fallback={<LoadingPage />}>
                {children}
                <SpeedInsights />
                <Analytics />
              </Suspense>
            </ToastWrapper>
          </SessionProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
