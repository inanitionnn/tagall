import "~/styles/globals.css";

import { Source_Sans_3, Oswald } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Session } from "next-auth";
import { Wrapper } from "./_components/wrapper";

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

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
    <html lang="en" className={`${sourceSansPro.variable} ${oswald.variable}`}>
      <body>
        <TRPCReactProvider>
          <Wrapper session={session}>{children}</Wrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
