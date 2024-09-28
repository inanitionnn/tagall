import { Navbar } from "../_components/modules";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar>{children}</Navbar>
    </>
  );
}
