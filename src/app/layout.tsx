import "~/styles/globals.css";

import { Source_Sans_3, Oswald } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSansPro.variable} ${oswald.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
